import { prisma } from '../config/db.js'

/**
 * สร้าง Queue Log
 * @param {object} data - ข้อมูล log
 * @returns {Promise<object>} ข้อมูล log ที่สร้างขึ้น
 */
export const createQueueLog = async (data) => {
  try {
    const {
      queueId,
      action,
      details = null,
      reason = null,
      userId = null,
      branchId = null,
      queueNumber = null,
      hn = null
    } = data

    const log = await prisma.queueLog.create({
      data: {
        queueId,
        action,
        details: details ? JSON.stringify(details) : null,
        reason,
        userId: userId ? parseInt(userId) : null,
        branchId: branchId ? parseInt(branchId) : null,
        queueNumber,
        hn
      }
    })

    return log
  } catch (error) {
    console.error('Error creating queue log:', error)
    throw error
  }
}

/**
 * ดึง Queue Logs ตาม Queue ID
 * @param {string} queueId - ID ของคิว
 * @returns {Promise<Array>} รายการ logs
 */
export const getQueueLogs = async (queueId) => {
  try {
    const logs = await prisma.queueLog.findMany({
      where: {
        queueId
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
    console.error('Error getting queue logs:', error)
    throw error
  }
}

/**
 * ดึง Queue Logs ตามสาขาและวันที่
 * @param {object} params - พารามิเตอร์การค้นหา
 * @returns {Promise<object>} ข้อมูล logs และ pagination
 */
export const getAllQueueLogs = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      branchId = null,
      dateFrom = null,
      dateTo = null,
      action = null,
      userId = null,
      hn = null
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

    if (hn) {
      where.hn = hn
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
      prisma.queueLog.findMany({
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
          queue: {
            select: {
              id: true,
              queueNumber: true,
              queueType: true,
              status: true,
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
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.queueLog.count({ where })
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
    console.error('Error getting all queue logs:', error)
    throw error
  }
}

/**
 * ดึงสถิติ Queue Logs
 * @param {object} params - พารามิเตอร์การค้นหา
 * @returns {Promise<object>} สถิติ logs
 */
export const getQueueLogStats = async (params = {}) => {
  try {
    const { branchId, dateFrom, dateTo } = params
    
    const where = {}
    
    if (branchId) {
      where.branchId = parseInt(branchId)
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
    
    const [
      total,
      byAction,
      byUser,
      byQueueType
    ] = await Promise.all([
      prisma.queueLog.count({ where }),
      prisma.queueLog.groupBy({
        by: ['action'],
        _count: { action: true },
        where
      }),
      prisma.queueLog.groupBy({
        by: ['userId'],
        _count: { userId: true },
        where,
        include: {
          user: {
            select: { id: true, name: true }
          }
        }
      }),
      prisma.queueLog.groupBy({
        by: ['queue'],
        _count: { queueId: true },
        where,
        include: {
          queue: {
            include: {
              registration: {
                include: {
                  department: {
                    select: { id: true, name: true }
                  }
                }
              }
            }
          }
        }
      })
    ])
    
    return {
      total,
      byAction,
      byUser,
      byQueueType
    }
  } catch (error) {
    console.error('Error getting queue log stats:', error)
    throw error
  }
}
