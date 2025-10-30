// สร้างเลข OPD ต่อสาขา-ต่อปี ภายในทรานแซกชันของ Prisma
// รับปีจากวันที่ที่เลือก (createdDate) หากส่งมา ไม่เช่นนั้นใช้วันนี้

/**
 * คืนค่าเลข OPD ถัดไปสำหรับสาขาและปีที่ระบุ (ทำงานใน tx เท่านั้น)
 * @param {import('@prisma/client').Prisma.TransactionClient} tx
 * @param {number|string} branchId
 * @param {Date|string|null} createdDate
 * @returns {Promise<{ opdNumber: string, year: number, seq: number }>}
 */
export async function getNextOpdNumber(tx, branchId, createdDate = null) {
  const dateObj = createdDate ? new Date(createdDate) : new Date()
  const year = dateObj.getFullYear()
  const bId = parseInt(branchId)

  // อัปเดตเคาน์เตอร์สาขา+ปี
  await tx.opdCounter.upsert({
    where: { branchId_year: { branchId: bId, year } },
    update: { current: { increment: 1 } },
    create: { branchId: bId, year, current: 1 },
  })

  const refreshed = await tx.opdCounter.findUnique({
    where: { branchId_year: { branchId: bId, year } },
    select: { current: true },
  })

  const seq = refreshed.current
  const opdNumber = `OPD${year}${String(seq).padStart(5, '0')}`

  return { opdNumber, year, seq }
}


