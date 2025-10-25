import { prisma } from '../config/db.js'

/**
 * ดึงข้อมูลคิวพร้อมข้อมูลผู้ป่วยสำหรับหน้า OPD Management
 * @param {string} queueId - ID ของคิว
 * @returns {Promise<object>} ข้อมูลคิวพร้อมข้อมูลผู้ป่วย
 */
export const getQueueForOPDManagement = async (queueId) => {
  try {
    const queue = await prisma.queue.findUnique({
      where: { id: queueId },
      include: {
        registration: {
          include: {
            patient: {
              include: {
                insuranceType: {
                  select: {
                    id: true,
                    name: true,
                    code: true
                  }
                }
              }
            },
            doctor: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            department: {
              select: {
                id: true,
                name: true,
                isActive: true
              }
            }
          }
        },
        department: {
          select: {
            id: true,
            name: true,
            isActive: true
          }
        },
        branch: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    })

    if (!queue) {
      throw new Error('ไม่พบข้อมูลคิว')
    }

    // จัดรูปแบบข้อมูลให้เหมาะสมกับ frontend
    const formattedData = {
      // ข้อมูลคิว
      queue: {
        id: queue.id,
        queueNumber: queue.queueNumber,
        status: queue.status,
        createdAt: queue.createdAt,
        updatedAt: queue.updatedAt,
        reason: queue.reason,
        cancelledAt: queue.cancelledAt,
        cancelledBy: queue.cancelledBy
      },
      
      // ข้อมูลการลงทะเบียน
      registration: {
        id: queue.registration.id,
        vnNumber: queue.registration.vnNumber,
        type: queue.registration.type,
        appointmentDate: queue.registration.appointmentDate,
        reason: queue.registration.reason,
        cancelledAt: queue.registration.cancelledAt,
        cancelledBy: queue.registration.cancelledBy,
        createdAt: queue.registration.createdAt,
        updatedAt: queue.registration.updatedAt
      },
      
      // ข้อมูลผู้ป่วย (ใช้ข้อมูลทั้งหมดที่ได้จาก include)
      patient: queue.registration.patient,
      
      // ข้อมูลแพทย์
      doctor: queue.registration.doctor,
      
      // ข้อมูลแผนก
      department: queue.registration.department || queue.department,
      
      // ข้อมูลสาขา
      branch: queue.branch
    }

    return formattedData

  } catch (error) {
    console.error('Error getting queue for OPD management:', error)
    throw error
  }
}
