import { prisma } from '../config/db.js'

// รองรับทั้งแบบส่ง tx/prisma + data หรือส่ง data อย่างเดียว (ย้อนกลับได้)
export const createRegistrationLog = async (clientOrData, maybeData) => {
  try {
    const client = maybeData ? clientOrData : prisma
    const data = maybeData || clientOrData

    const {
      registrationId,
      action,
      details = null,
      reason = null,
      userId = null,
      branchId = null,
      hn = null
    } = data || {}

    const log = await client.registrationLog.create({
      data: {
        registrationId,
        action,
        details: details ? toJson(details) : null,
        reason,
        userId: userId ? parseInt(userId) : null,
        branchId: branchId ? parseInt(branchId) : null,
        hn
      }
    })

    return log
  } catch (error) {
    console.error('Error creating registration log:', error)
    throw error
  }
}

/**
 * ดึง Registration Logs ตาม Registration ID
 * @param {string} registrationId - ID ของการลงทะเบียน
 * @returns {Promise<Array>} รายการ logs
 */
export const getRegistrationLogs = async (registrationId) => {
  try {
    const logs = await prisma.registrationLog.findMany({
      where: {
        registrationId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return logs
  } catch (error) {
    console.error('Error getting registration logs:', error)
    throw error
  }
}

/**
 * ดึง Registration Logs ตามสาขาและวันที่
 * @param {object} params - พารามิเตอร์การค้นหา
 * @returns {Promise<object>} ข้อมูล logs และ pagination
 */
export const getAllRegistrationLogs = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      branchId = null,
      dateFrom = null,
      dateTo = null,
      action = null,
      userId = null
    } = params

    const skip = (page - 1) * limit
    const where = {}

    if (branchId) {
      where.branchId = parseInt(branchId)
    }

    if (userId) {
      where.userId = parseInt(userId)
    }

    if (action) {
      where.action = action
    }

    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo)
      }
    }

    const [logs, total] = await Promise.all([
      prisma.registrationLog.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          registration: {
            select: {
              id: true,
              vn: true,
              patient: {
                select: {
                  id: true,
                  hn: true,
                  first_name: true,
                  last_name: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.registrationLog.count({ where })
    ])

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('Error getting all registration logs:', error)
    throw error
  }
}

function toJson(v) {
  if (v == null) return null
  try {
    return typeof v === 'string' ? { message: v } : v
  } catch {
    return { message: String(v) }
  }
}
