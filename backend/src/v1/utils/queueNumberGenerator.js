import { prisma } from '../config/db.js'
import { getLocalDayBounds } from './dateUtils.js'

/**
 * สร้างหมายเลขคิวอัตโนมัติสำหรับแผนกและประเภทคิวที่กำหนด
 * Format: 1, 2, 3, 4, 5...
 * รีเซ็ททุกวัน
 *
 * @param {number} branchId - ID ของสาขา
 * @param {number} departmentId - ID ของแผนก
 * @param {string} queueType - ประเภทคิว (OPD, IPD)
 * @returns {Promise<string>} หมายเลขคิวที่สร้างขึ้น
 */
export const generateQueueNumber = async (branchId, departmentId, queueType, prismaOrTx = prisma, forDate = null) => {
  try {
    const { startOfDay, endOfDay } = getLocalDayBounds(forDate)

    // ค้นหาคิวสุดท้ายของวันนี้สำหรับแผนกและประเภทคิวที่กำหนด
    const lastQueue = await prismaOrTx.queue.findFirst({
      where: {
        branchId: parseInt(branchId),
        departmentId: departmentId,
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      orderBy: {
        queueNumber: 'desc', // เรียงจากมากไปน้อยเพื่อหาหมายเลขสูงสุด
      },
    })

    let nextNumber = 1
    if (lastQueue) {
      // ถ้ามีคิวอยู่แล้ว ให้เพิ่มหมายเลขจากคิวสุดท้าย
      nextNumber = parseInt(lastQueue.queueNumber) + 1
    }

    // สร้างหมายเลขคิวใหม่ (ไม่ต้อง pad ด้วย 0)
    const queueNumber = nextNumber.toString()

    return queueNumber
  } catch (error) {
    console.error('Error generating queue number:', error)
    throw new Error(`ไม่สามารถสร้างหมายเลขคิวได้: ${error.message}`)
  }
}
