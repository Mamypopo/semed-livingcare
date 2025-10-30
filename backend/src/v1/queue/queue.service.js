import { prisma } from '../config/db.js'
import { generateQueueNumber } from '../utils/queueNumberGenerator.js'
import { normalizeCreatedDate, toLocalStartOfDay } from '../utils/dateUtils.js'
import { createQueueLog } from '../utils/queueLogger.js'

/**
 * สร้างคิวใหม่
 * @param {object} data - ข้อมูลคิว
 * @param {number} createdBy - ID ของผู้สร้าง
 * @returns {Promise<object>} ข้อมูลคิวที่สร้างขึ้น
 */
export const createQueue = async (data, createdBy) => {
  try {
    const {
      registrationId,
      branchId,
      queueType = 'OPD',
      note = null,
      status = 'WAITING',
      createdDate = null
    } = data

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!registrationId || !branchId) {
      throw new Error('กรุณากรอกข้อมูลที่จำเป็นครบถ้วน (การลงทะเบียน, สาขา)')
    }

    // ตรวจสอบว่าการลงทะเบียนมีอยู่จริง
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        patient: {
          select: { id: true, hn: true, first_name: true, last_name: true, isActive: true }
        }
      }
    })

    if (!registration) {
      throw new Error('ไม่พบข้อมูลการลงทะเบียน')
    }

    if (registration.status === 'CANCELLED') {
      throw new Error('ไม่สามารถสร้างคิวจากการลงทะเบียนที่ถูกยกเลิกแล้ว')
    }

    if (!registration.patient.isActive) {
      throw new Error('ผู้ป่วยนี้ถูกปิดใช้งานแล้ว')
    }

    // ตรวจสอบว่ามีคิวอยู่แล้วหรือไม่
    const existingQueue = await prisma.queue.findFirst({
      where: {
        registrationId: registrationId,
        status: {
          in: ['WAITING', 'CALLING']
        }
      }
    })

    if (existingQueue) {
      throw new Error('การลงทะเบียนนี้มีคิวอยู่แล้ว')
    }

    const result = await prisma.$transaction(async (tx) => {
      const dateObj = normalizeCreatedDate(createdDate)
      // ใช้ departmentId จาก registration เพื่อรีเซ็ตเลขต่อแผนก
      const depId = registration?.departmentId || null
      const queueNumber = await generateQueueNumber(branchId, depId, queueType, tx, createdDate)
      const queueDateStart = toLocalStartOfDay(dateObj)

      // สร้างคิว
      const queue = await tx.queue.create({
        data: {
          queueNumber,
          registrationId,
          branchId: parseInt(branchId),
          queueType,
          departmentId: depId,
          status,
          note,
          queueDate: queueDateStart,
          createdAt: dateObj,
          createdBy: createdBy ? parseInt(createdBy) : null
        },
        include: {
          registration: {
            include: {
              patient: {
                select: {
                  id: true,
                  hn: true,
                  prefix: true,
                  first_name: true,
                  last_name: true,
                  gender: true,
                  phone_1: true,
                  patientGroup: {
                    select: { id: true, name: true, color: true }
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
                  code: true
                }
              }
            }
          },
          branch: {
            select: {
              id: true,
              name: true,
              code: true
            }
          },
          createdByUser: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      // Log ภายใน transaction
      await createQueueLog(tx, {
        queueId: queue.id,
        action: 'CREATE',
        details: {
          queueNumber: queue.queueNumber,
          queueType: queue.queueType,
          status: queue.status,
          patientName: `${queue.registration.patient.first_name} ${queue.registration.patient.last_name}`,
          patientHN: queue.registration.patient.hn,
          doctorName: queue.registration.doctor?.name,
          departmentName: queue.registration.department?.name
        },
        userId: createdBy ? parseInt(createdBy) : null,
        branchId: queue.branchId,
        queueNumber: queue.queueNumber,
        hn: queue.registration.patient.hn
      })

      return queue
    })

    return result
  } catch (error) {
    console.error('Error creating queue:', error)
    throw error
  }
}

/**
 * ดึงข้อมูลคิวทั้งหมด
 * @param {object} params - พารามิเตอร์การค้นหา
 * @returns {Promise<object>} ข้อมูลคิวและ pagination
 */
export const getAllQueues = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = 'all',
      queueType = 'all',
      branchId = null,
      departmentId = null,
      doctorId = null,
      dateFrom = null,
      dateTo = null,
      sort = 'createdAt',
      order = 'desc'
    } = params

    const skip = (page - 1) * limit
    const where = {}

    // Filter by status
    if (status !== 'all') {
      where.status = status
    }

    // Filter by queue type (OPD/IPD) - ใช้ registration.type แทน
    if (queueType !== 'all') {
      where.registration = {
        ...where.registration,
        type: queueType
      }
    }

    // Filter by branch
    if (branchId) {
      where.branchId = parseInt(branchId)
    }

    // Filter by department
    if (departmentId) {
      where.registration = {
        departmentId: parseInt(departmentId)
      }
    }

    // Filter by doctor
    if (doctorId) {
      where.registration = {
        ...where.registration,
        doctorId: parseInt(doctorId)
      }
    }

    // Filter by date range
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo)
      }
    }

    // Search by queue number, patient name, HN, VN
    if (search) {
      where.OR = [
        { queueNumber: { contains: search, mode: 'insensitive' } },
        { registration: { vnNumber: { contains: search, mode: 'insensitive' } } },
        { registration: { patient: { hn: { contains: search, mode: 'insensitive' } } } },
        { registration: { patient: { first_name: { contains: search, mode: 'insensitive' } } } },
        { registration: { patient: { last_name: { contains: search, mode: 'insensitive' } } } }
      ]
    }

    const [queues, total] = await Promise.all([
      prisma.queue.findMany({
        where,
        skip,
        take: limit,
        include: {
          registration: {
            include: {
              patient: {
                select: {
                  id: true,
                  hn: true,
                  prefix: true,
                  first_name: true,
                  last_name: true,
                  patientGroup: {
                    select: { id: true, name: true, color: true }
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
                  name: true
                }
              }
            }
          },
          department: {
            select: {
              id: true,
              name: true
            }
          },
          branch: {
            select: {
              id: true,
              name: true,
              code: true
            }
          }
        },
        orderBy: { [sort]: order }
      }),
      prisma.queue.count({ where })
    ])

    return {
      queues,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('Error getting all queues:', error)
    throw error
  }
}

/**
 * ดึงข้อมูลคิวตาม ID
 * @param {number} id - ID ของคิว
 * @returns {Promise<object>} ข้อมูลคิว
 */
export const getQueueById = async (id) => {
  try {
    const queue = await prisma.queue.findUnique({
      where: { id: parseInt(id) },
      include: {
        registration: {
          include: {
            patient: {
              select: {
                id: true,
                hn: true,
                prefix: true,
                first_name: true,
                last_name: true,
                gender: true,
                birth_date: true,
                phone_1: true,
                email: true,
                address: true,
                patientGroup: {
                  select: { id: true, name: true, color: true }
                },
                insuranceType: {
                  select: { id: true, name: true }
                }
              }
            },
            doctor: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            },
            department: {
              select: {
                id: true,
                name: true,
                code: true,
                description: true
              }
            }
          }
        },
        room: {
          select: { id: true, name: true, number: true }
        },
        branch: {
          select: {
            id: true,
            name: true,
            code: true,
            address: true
          }
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        updatedByUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        cancelledByUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!queue) {
      throw new Error('ไม่พบข้อมูลคิว')
    }

    return queue
  } catch (error) {
    console.error('Error getting queue by ID:', error)
    throw error
  }
}

/**
 * ยกเลิกคิว
 * @param {number} id - ID ของคิว
 * @param {number} cancelledBy - ID ของผู้ยกเลิก
 * @param {string} reason - เหตุผลการยกเลิก
 * @returns {Promise<object>} ข้อมูลคิวที่ยกเลิกแล้ว
 */
export const cancelQueue = async (id, cancelledBy, reason = '') => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const queue = await tx.queue.findUnique({
        where: { id: parseInt(id) },
        include: {
          registration: {
            include: {
              patient: {
                select: { id: true, hn: true, first_name: true, last_name: true }
              }
            }
          }
        }
      })

      if (!queue) {
        throw new Error('ไม่พบข้อมูลคิว')
      }

      if (queue.status === 'CANCELLED') {
        throw new Error('คิวนี้ถูกยกเลิกแล้ว')
      }

      if (queue.status === 'COMPLETED') {
        throw new Error('ไม่สามารถยกเลิกคิวที่เสร็จสิ้นแล้ว')
      }

      const updatedQueue = await tx.queue.update({
        where: { id: parseInt(id) },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancelledBy: cancelledBy ? parseInt(cancelledBy) : null,
          cancellationReason: reason,
          updatedBy: cancelledBy ? parseInt(cancelledBy) : null
        },
        include: {
          registration: {
            include: {
              patient: {
                select: {
                  id: true,
                  hn: true,
                  prefix: true,
                  first_name: true,
                  last_name: true
                }
              },
              doctor: {
                select: {
                  id: true,
                  name: true
                }
              },
              department: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      })

      await createQueueLog(tx, {
        queueId: updatedQueue.id,
        action: 'CANCEL',
        details: {
          queueNumber: updatedQueue.queueNumber,
          queueType: updatedQueue.queueType,
          changes: {
            before: { status: queue.status },
            after: { status: updatedQueue.status }
          },
          patientName: `${updatedQueue.registration.patient.first_name} ${updatedQueue.registration.patient.last_name}`,
          patientHN: updatedQueue.registration.patient.hn,
          doctorName: updatedQueue.registration.doctor?.name,
          departmentName: updatedQueue.registration.department?.name
        },
        reason: reason,
        userId: cancelledBy ? parseInt(cancelledBy) : null,
        branchId: updatedQueue.branchId,
        queueNumber: updatedQueue.queueNumber,
        hn: updatedQueue.registration.patient.hn
      })

      return updatedQueue
    })

    return result
  } catch (error) {
    console.error('Error cancelling queue:', error)
    throw error
  }
}

