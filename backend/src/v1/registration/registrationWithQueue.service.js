import { prisma } from '../config/db.js'
import { generateVN } from '../utils/vnGenerator.js'
import { generateQueueNumber } from '../utils/queueNumberGenerator.js'
import { normalizeCreatedDate, toLocalStartOfDay } from '../utils/dateUtils.js'
import { createRegistrationLog } from '../Loggers/registrationLogger.js'
import { createQueueLog } from '../Loggers/queueLogger.js'
import { getNextOpdNumber } from '../utils/opdNumberGenerator.js'

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
    note = null,
    createdDate = null 
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
    const dateObj = normalizeCreatedDate(createdDate)
    // สร้าง VN ตามวันที่เลือก
    const vn = await generateVN(branchId, tx, createdDate)
    const { opdNumber, year, seq: opdSeq } = await getNextOpdNumber(tx, branchId, dateObj)

    // สร้าง Registration
    const registration = await tx.registration.create({
      data: {
        vnNumber: vn,
        opdNumber,
        opdYear: year,
        opdSeq: opdSeq,
        patientId: parseInt(patientId),
        doctorId: parseInt(doctorId),
        departmentId: departmentId,
        branchId: parseInt(branchId),
        appointmentDate: dateObj,
        createdAt: dateObj,
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

    // สร้าง Queue Number ต่อสาขา+แผนก ตามวันที่เลือก
    const queueNumber = await generateQueueNumber(branchId, departmentId, queueType, tx, createdDate)

    // สร้าง Queue
    const queue = await tx.queue.create({
      data: {
        queueNumber,
        registrationId: registration.id,
        departmentId: departmentId,
        branchId: parseInt(branchId),
        status: 'WAITING',
        createdAt: dateObj,
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

    // Log ภายในทรานแซคชัน
    await createRegistrationLog(tx, {
      registrationId: registration.id,
      action: 'CREATE',
      details: {
        vn: registration.vnNumber,
        patientName: `${registration.patient.first_name} ${registration.patient.last_name}`,
        patientHN: registration.patient.hn,
        doctorName: registration.doctor.name,
        departmentName: registration.department.name,
        status: 'COMPLETED',
        note: note
      },
      userId: createdBy,
      branchId: parseInt(branchId),
      hn: registration.patient.hn
    })

    await createQueueLog(tx, {
      queueId: queue.id,
      action: 'CREATE',
      details: {
        queueNumber: queue.queueNumber,
        queueType: queue.queueType,
        status: queue.status,
        patientName: `${queue.registration.patient.first_name} ${queue.registration.patient.last_name}`,
        patientHN: queue.registration.patient.hn,
        doctorName: queue.registration.doctor.name,
        departmentName: queue.registration.department.name
      },
      userId: createdBy,
      branchId: parseInt(branchId),
      queueNumber: queue.queueNumber,
      hn: queue.registration.patient.hn
    })

    return { registration, queue }
  })

  return result
}
