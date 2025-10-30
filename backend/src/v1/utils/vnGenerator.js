import { prisma } from '../config/db.js'
import { getLocalDayBounds } from './dateUtils.js'

/**
 * สร้าง VN (Visit Number) อัตโนมัติ
 * Format: 1, 2, 3, 4, 5...
 * รีเซ็ททุกวัน
 * 
 * @param {number} branchId - ID ของสาขา
 * @returns {Promise<string>} VN ที่สร้างขึ้น
 */
export const generateVN = async (branchId, prismaOrTx = prisma, forDate = null) => {
  try {
    const { startOfDay: start, endOfDay: end } = getLocalDayBounds(forDate)
    const lastRegistration = await prismaOrTx.registration.findFirst({
      where: {
        branchId: parseInt(branchId),
        createdAt: { gte: start, lt: end }
      },
      orderBy: { vnNumber: 'desc' }
    })
    
    let nextNumber = 1
    if (lastRegistration) {
      // ดึงหมายเลขสุดท้ายจาก VN
      const lastNumber = parseInt(lastRegistration.vnNumber)
      nextNumber = lastNumber + 1
    }
    
    // สร้าง VN ใหม่ (แค่หมายเลข ต่อวัน)
    // กลไกกันชนแบบ count+retry เผื่อ concurrency
    const baseCount = await prismaOrTx.registration.count({
      where: { branchId: parseInt(branchId), createdAt: { gte: start, lt: end } }
    })

    const maxAttempts = 5
    for (let i = 0; i < maxAttempts; i++) {
      const candidate = (Math.max(baseCount, nextNumber - 1) + 1 + i).toString()
      const exists = await prismaOrTx.registration.findFirst({
        where: {
          branchId: parseInt(branchId),
          createdAt: { gte: start, lt: end },
          vnNumber: candidate
        }
      })
      if (!exists) return candidate
    }

    throw new Error('VN generation exceeded retry attempts')
  } catch (error) {
    console.error('Error generating VN:', error)
    throw new Error(`ไม่สามารถสร้าง VN ได้: ${error.message}`)
  }
}

/**
 * ตรวจสอบรูปแบบ VN
 * @param {string} vn - VN ที่ต้องการตรวจสอบ
 * @returns {boolean} true ถ้ารูปแบบถูกต้อง
 */
export const isValidVNFormat = (vn) => {
  const vnPattern = /^\d+$/
  return vnPattern.test(vn)
}

/**
 * ดึงข้อมูลจาก VN
 * @param {string} vn - VN ที่ต้องการแยกข้อมูล
 * @returns {object} ข้อมูลหมายเลข
 */
export const parseVN = (vn) => {
  if (!isValidVNFormat(vn)) {
    throw new Error('รูปแบบ VN ไม่ถูกต้อง')
  }
  
  const number = parseInt(vn)
  
  return {
    number,
    vnString: vn
  }
}
