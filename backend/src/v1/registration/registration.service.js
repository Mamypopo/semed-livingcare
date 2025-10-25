import { prisma } from '../config/db.js'
import { generateVN } from '../utils/vnGenerator.js'

/**
 * สร้างการลงทะเบียนใหม่
 * @param {object} data - ข้อมูลการลงทะเบียน
 * @param {number} createdBy - ID ของผู้สร้าง
 * @returns {Promise<object>} ข้อมูลการลงทะเบียนที่สร้างขึ้น
 */
export const createRegistration = async (data, createdBy) => {
  try {
    const {
      patientId,
      doctorId,
      departmentId,
      branchId,
      note,
      status = 'COMPLETED'
    } = data

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!patientId || !doctorId || !departmentId || !branchId) {
      throw new Error('กรุณากรอกข้อมูลที่จำเป็นครบถ้วน (ผู้ป่วย, แพทย์, แผนก, สาขา)')
    }

    // ตรวจสอบว่าผู้ป่วยมีอยู่จริง
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(patientId) },
      select: { id: true, hn: true, first_name: true, last_name: true, isActive: true }
    })

    if (!patient) {
      throw new Error('ไม่พบข้อมูลผู้ป่วย')
    }

    if (!patient.isActive) {
      throw new Error('ผู้ป่วยนี้ถูกปิดใช้งานแล้ว')
    }

    // ตรวจสอบว่าแพทย์มีอยู่จริง
    const doctor = await prisma.user.findUnique({
      where: { id: parseInt(doctorId) },
      select: { id: true, name: true, role: true, isActive: true }
    })

    if (!doctor) {
      throw new Error('ไม่พบข้อมูลแพทย์')
    }

    if (doctor.role !== 'DOCTOR') {
      throw new Error('ผู้ใช้ที่เลือกไม่ใช่แพทย์')
    }

    if (!doctor.isActive) {
      throw new Error('แพทย์นี้ถูกปิดใช้งานแล้ว')
    }

    // ตรวจสอบว่าแผนกมีอยู่จริง
    const department = await prisma.department.findUnique({
      where: { id: parseInt(departmentId) },
      select: { id: true, name: true, isActive: true }
    })

    if (!department) {
      throw new Error('ไม่พบข้อมูลแผนก')
    }

    if (!department.isActive) {
      throw new Error('แผนกนี้ถูกปิดใช้งานแล้ว')
    }

    // สร้าง VN อัตโนมัติ
    const vn = await generateVN(branchId)

    // สร้างการลงทะเบียน
    const registration = await prisma.registration.create({
      data: {
        vn,
        patientId: parseInt(patientId),
        doctorId: parseInt(doctorId),
        departmentId: parseInt(departmentId),
        branchId: parseInt(branchId),
        status,
        note,
        registrationDate: new Date(),
        createdBy: createdBy ? parseInt(createdBy) : null
      },
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

    return registration
  } catch (error) {
    console.error('Error creating registration:', error)
    throw error
  }
}

/**
 * ดึงข้อมูลการลงทะเบียนทั้งหมด
 * @param {object} params - พารามิเตอร์การค้นหา
 * @returns {Promise<object>} ข้อมูลการลงทะเบียนและ pagination
 */
export const getAllRegistrations = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = 'all',
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

    // Filter by branch
    if (branchId) {
      where.branchId = parseInt(branchId)
    }

    // Filter by department
    if (departmentId) {
      where.departmentId = parseInt(departmentId)
    }

    // Filter by doctor
    if (doctorId) {
      where.doctorId = parseInt(doctorId)
    }

    // Filter by date range
    if (dateFrom || dateTo) {
      where.registrationDate = {}
      if (dateFrom) {
        where.registrationDate.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.registrationDate.lte = new Date(dateTo)
      }
    }

    // Search by VN, patient name, HN
    if (search) {
      where.OR = [
        { vn: { contains: search, mode: 'insensitive' } },
        { patient: { hn: { contains: search, mode: 'insensitive' } } },
        { patient: { first_name: { contains: search, mode: 'insensitive' } } },
        { patient: { last_name: { contains: search, mode: 'insensitive' } } }
      ]
    }

    const [registrations, total] = await Promise.all([
      prisma.registration.findMany({
        where,
        skip,
        take: limit,
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
          },
          branch: {
            select: {
              id: true,
              name: true,
              code: true
            }
          },
          queues: {
            select: {
              id: true,
              queueNumber: true,
              queueType: true,
              status: true,
              createdAt: true
            }
          }
        },
        orderBy: { [sort]: order }
      }),
      prisma.registration.count({ where })
    ])

    return {
      registrations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('Error getting all registrations:', error)
    throw error
  }
}

/**
 * ดึงข้อมูลการลงทะเบียนตาม ID
 * @param {number} id - ID ของการลงทะเบียน
 * @returns {Promise<object>} ข้อมูลการลงทะเบียน
 */
export const getRegistrationById = async (id) => {
  try {
    const registration = await prisma.registration.findUnique({
      where: { id: parseInt(id) },
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
        },
        branch: {
          select: {
            id: true,
            name: true,
            code: true,
            address: true
          }
        },
        queues: {
          include: {
            room: {
              select: { id: true, name: true, number: true }
            }
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
        }
      }
    })

    if (!registration) {
      throw new Error('ไม่พบข้อมูลการลงทะเบียน')
    }

    return registration
  } catch (error) {
    console.error('Error getting registration by ID:', error)
    throw error
  }
}

/**
 * ยกเลิกการลงทะเบียน
 * @param {number} id - ID ของการลงทะเบียน
 * @param {number} cancelledBy - ID ของผู้ยกเลิก
 * @param {string} reason - เหตุผลการยกเลิก
 * @returns {Promise<object>} ข้อมูลการลงทะเบียนที่ยกเลิกแล้ว
 */
export const cancelRegistration = async (id, cancelledBy, reason = '') => {
  try {
    const registration = await prisma.registration.findUnique({
      where: { id: parseInt(id) },
      include: {
        queues: true
      }
    })

    if (!registration) {
      throw new Error('ไม่พบข้อมูลการลงทะเบียน')
    }

    if (registration.status === 'CANCELLED') {
      throw new Error('การลงทะเบียนนี้ถูกยกเลิกแล้ว')
    }

    // อัปเดตสถานะการลงทะเบียน
    const updatedRegistration = await prisma.registration.update({
      where: { id: parseInt(id) },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancelledBy: cancelledBy ? parseInt(cancelledBy) : null,
        cancellationReason: reason,
        updatedBy: cancelledBy ? parseInt(cancelledBy) : null
      },
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
    })

    // อัปเดตสถานะคิวที่เกี่ยวข้อง
    if (registration.queues.length > 0) {
      await prisma.queue.updateMany({
        where: {
          registrationId: parseInt(id)
        },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date()
        }
      })
    }

    return updatedRegistration
  } catch (error) {
    console.error('Error cancelling registration:', error)
    throw error
  }
}

