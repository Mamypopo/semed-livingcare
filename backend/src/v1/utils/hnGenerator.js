import { prisma } from '../config/db.js'

/**
 * สร้างหมายเลข HN ตาม format: HN + year + branchCode + runningNumber
 * @param {number} branchId - ID ของสาขา
 * @returns {Promise<string>} หมายเลข HN ที่สร้างขึ้น
 */
export const generateHN = async (branchId) => {
  try {
    // ดึงข้อมูลสาขา
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      select: { code: true, name: true }
    })

    if (!branch) {
      throw new Error('ไม่พบข้อมูลสาขา')
    }

    // สร้าง year (2 หลักสุดท้ายของปี พ.ศ.)
    const currentYear = new Date().getFullYear()
    const buddhistYear = currentYear + 543 // แปลงเป็นปี พ.ศ.
    const year = buddhistYear.toString().slice(-2)

    const branchCode = branch.code

    // หา running number ล่าสุดสำหรับสาขานี้ในปีนี้
    const prefix = `HN${year}${branchCode}`
    
    const lastPatient = await prisma.patient.findFirst({
      where: {
        hn: {
          startsWith: prefix
        }
      },
      orderBy: {
        hn: 'desc'
      },
      select: {
        hn: true
      }
    })

    let runningNumber = 1

    if (lastPatient) {
      // แยก running number จาก HN ล่าสุด
      const lastRunningNumber = parseInt(lastPatient.hn.slice(-4))
      runningNumber = lastRunningNumber + 1
    }

    // สร้าง HN ใหม่
    const newHN = `${prefix}${runningNumber.toString().padStart(4, '0')}`

    // ตรวจสอบว่า HN นี้มีอยู่แล้วหรือไม่ (ป้องกัน race condition)
    const existingHN = await prisma.patient.findFirst({
      where: { hn: newHN }
    })

    if (existingHN) {
      // ถ้ามีอยู่แล้ว ให้ลองใหม่
      return await generateHN(branchId)
    }

    return newHN

  } catch (error) {
    console.error('Error generating HN:', error)
    throw new Error('ไม่สามารถสร้างหมายเลข HN ได้')
  }
}

/**
 * ตรวจสอบว่า HN มีอยู่แล้วหรือไม่
 * @param {string} hn - หมายเลข HN ที่ต้องการตรวจสอบ
 * @returns {Promise<boolean>} true ถ้ามีอยู่แล้ว, false ถ้าไม่มี
 */
export const isHNExists = async (hn) => {
  try {
    const existingHN = await prisma.patient.findFirst({
      where: { hn }
    })
    return !!existingHN
  } catch (error) {
    console.error('Error checking HN:', error)
    return false
  }
}

/**
 * ตัวอย่าง HN ที่จะได้:
 * - HN68S0010001 (ปี 2568, สาขา S001, ลำดับ 0001)
 * - HN68S0010002 (ปี 2568, สาขา S001, ลำดับ 0002)
 * - HN68S1010001 (ปี 2568, สาขา S101, ลำดับ 0001)
 */
