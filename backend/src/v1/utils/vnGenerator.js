import { prisma } from '../config/db.js'

/**
 * สร้าง VN (Visit Number) อัตโนมัติ
 * Format: 1, 2, 3, 4, 5...
 * รีเซ็ททุกวัน
 * 
 * @param {number} branchId - ID ของสาขา
 * @returns {Promise<string>} VN ที่สร้างขึ้น
 */
export const generateVN = async (branchId) => {
  try {
    const today = new Date()
    const dateStr = today.toISOString().slice(0, 10) // YYYY-MM-DD
    
    // หา VN สุดท้ายของวันนี้ในสาขานี้
    const lastRegistration = await prisma.registration.findFirst({
      where: {
        branchId: parseInt(branchId),
        createdAt: {
          gte: new Date(today.toISOString().slice(0, 10) + 'T00:00:00.000Z'),
          lt: new Date(today.toISOString().slice(0, 10) + 'T23:59:59.999Z')
        }
      },
      orderBy: {
        vnNumber: 'desc'
      }
    })
    
    let nextNumber = 1
    if (lastRegistration) {
      // ดึงหมายเลขสุดท้ายจาก VN
      const lastNumber = parseInt(lastRegistration.vnNumber)
      nextNumber = lastNumber + 1
    }
    
    // สร้าง VN ใหม่ (แค่หมายเลข)
    const vn = nextNumber.toString()
    
    // ตรวจสอบว่า VN ไม่ซ้ำ
    const existingVN = await prisma.registration.findUnique({
      where: { vnNumber: vn }
    })
    
    if (existingVN) {
      throw new Error(`VN ${vn} already exists`)
    }
    
    return vn
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
