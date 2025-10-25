import { prisma } from '../config/db.js'
import { generateVN } from '../utils/vnGenerator.js'
import { generateQueueNumber } from '../utils/queueNumberGenerator.js'
import { createRegistrationLog } from '../utils/registrationLogger.js'
import { createQueueLog } from '../utils/queueLogger.js'

/**
 * สร้าง Registration พร้อม Queue ในครั้งเดียว
 * @param {object} data - ข้อมูลการลงทะเบียนและคิว
 * @param {number} createdBy - ID ของผู้สร้าง
 * @returns {Promise<object>} ข้อมูล Registration และ Queue ที่สร้างขึ้น
 */
export const createRegistrationWithQueue = async (data, createdBy) => {
  const { 
    patientId, 
    doctorId, 
    departmentId, 
    branchId, 
    queueType, 
    note = null 
  } = data

  // ตรวจสอบข้อมูลที่จำเป็น
  if (!patientId || !doctorId || !departmentId || !branchId || !queueType) {
    throw new Error('กรุณากรอกข้อมูลที่จำเป็นครบถ้วน (ผู้ป่วย, แพทย์, แผนก, สาขา, ประเภทคิว)')
  }

  // ตรวจสอบ queueType ถ้ามีเพิ่มก็มาแก้ตรงนี้ ส่ง queueType มาจากหน้าบ้าน
  if (!['OPD', 'IPD'].includes(queueType)) {
    throw new Error('ประเภทคิวต้องเป็น OPD หรือ IPD เท่านั้น')
  }

  // ตรวจสอบว่า patient มีอยู่จริง
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    select: { id: true, hn: true, prefix: true, first_name: true, last_name: true }
  })

  if (!patient) {
    throw new Error('ไม่พบข้อมูลผู้ป่วย')
  }

  // ตรวจสอบว่า doctor มีอยู่จริง
  const doctor = await prisma.user.findUnique({
    where: { id: doctorId },
    select: { id: true, name: true, role: true }
  })

  if (!doctor || doctor.role !== 'DOCTOR') {
    throw new Error('ไม่พบข้อมูลแพทย์หรือไม่ใช่แพทย์')
  }

  // ตรวจสอบว่า department มีอยู่จริงและเปิดใช้งาน
  const department = await prisma.department.findUnique({
    where: { id: departmentId },
    select: { id: true, name: true, isActive: true }
  })

  if (!department || !department.isActive) {
    throw new Error('ไม่พบข้อมูลแผนกหรือแผนกปิดใช้งาน')
  }

  // ตรวจสอบว่า branch มีอยู่จริง
  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
    select: { id: true, name: true }
  })

  if (!branch) {
    throw new Error('ไม่พบข้อมูลสาขา')
  }

  // เริ่ม transaction
  const result = await prisma.$transaction(async (tx) => {
    // สร้าง VN
    const vn = await generateVN(branchId)

    // สร้าง Registration
    const registration = await tx.registration.create({
      data: {
        vnNumber: vn,
        patientId: parseInt(patientId),
        doctorId: parseInt(doctorId),
        departmentId: departmentId,
        branchId: parseInt(branchId),
        appointmentDate: new Date(),
        createdBy: createdBy.toString(),
        updatedBy: createdBy.toString()
      },
      include: {
        patient: {
          select: { id: true, hn: true, prefix: true, first_name: true, last_name: true }
        },
        doctor: {
          select: { id: true, name: true }
        },
        department: {
          select: { id: true, name: true }
        },
        branch: {
          select: { id: true, name: true }
        }
      }
    })

    // สร้าง Queue Number
    const queueNumber = await generateQueueNumber(branchId, departmentId, queueType)

    // สร้าง Queue
    const queue = await tx.queue.create({
      data: {
        queueNumber,
        registrationId: registration.id,
        departmentId: departmentId,
        branchId: parseInt(branchId),
        status: 'WAITING',
        createdBy: createdBy.toString(),
        updatedBy: createdBy.toString()
      },
      include: {
        registration: {
          include: {
            patient: {
              select: { id: true, hn: true, prefix: true, first_name: true, last_name: true }
            },
            doctor: {
              select: { id: true, name: true }
            },
            department: {
              select: { id: true, name: true }
            },
            branch: {
              select: { id: true, name: true }
            }
          }
        },
        department: {
          select: { id: true, name: true }
        },
        branch: {
          select: { id: true, name: true }
        }
      }
    })

    return { registration, queue }
  })

  // บันทึก Registration Log
  await createRegistrationLog({
    registrationId: result.registration.id,
    action: 'CREATE',
    details: {
      vn: result.registration.vnNumber,
      patientName: `${result.registration.patient.first_name} ${result.registration.patient.last_name}`,
      patientHN: result.registration.patient.hn,
      doctorName: result.registration.doctor.name,
      departmentName: result.registration.department.name,
      status: 'COMPLETED',
      note: note
    },
    userId: createdBy,
    branchId: parseInt(branchId),
    hn: result.registration.patient.hn
  })

  // บันทึก Queue Log
  await createQueueLog({
    queueId: result.queue.id,
    action: 'CREATE',
    details: {
      queueNumber: result.queue.queueNumber,
      queueType: result.queue.queueType,
      status: result.queue.status,
      patientName: `${result.queue.registration.patient.first_name} ${result.queue.registration.patient.last_name}`,
      patientHN: result.queue.registration.patient.hn,
      doctorName: result.queue.registration.doctor.name,
      departmentName: result.queue.registration.department.name
    },
    userId: createdBy,
    branchId: parseInt(branchId),
    queueNumber: result.queue.queueNumber,
    hn: result.queue.registration.patient.hn
  })

  return result
}
