// สร้างรหัสรายการตรวจ SEM1, SEM2, SEM3, ... ภายในทรานแซกชันของ Prisma

/**
 * คืนค่ารหัสรายการตรวจถัดไป (SEMn) ทำงานใน tx เท่านั้น
 * @param {import('@prisma/client').Prisma.TransactionClient} tx
 * @returns {Promise<{ code: string, seq: number }>}
 */
export async function getNextItemCode(tx) {
  // ใช้ upsert เพื่อให้ atomic (ถ้ายังไม่มี counter ให้สร้างใหม่)
  // เนื่องจาก ItemCodeCounter ไม่มี unique constraint เราต้องหาวิธีอื่น
  // วิธีที่ปลอดภัย: ดึง counter ล่าสุด (หรือสร้างใหม่) แล้ว update
  
  let counter = await tx.itemCodeCounter.findFirst({
    orderBy: { id: 'desc' }
  })

  if (!counter) {
    // สร้าง counter ใหม่ถ้ายังไม่มี
    counter = await tx.itemCodeCounter.create({
      data: { current: 0 }
    })
  }

  // อัปเดต counter โดย increment
  const updated = await tx.itemCodeCounter.update({
    where: { id: counter.id },
    data: { current: { increment: 1 } },
    select: { current: true }
  })

  const seq = updated.current
  const code = `SEM${seq}`

  return { code, seq }
}

