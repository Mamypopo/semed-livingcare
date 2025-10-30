import { prisma } from "../config/db.js";

export const icd10Service = {
  async search({ query, limit = 20, offset = 0 }) {
    const raw = (query || '').trim()
    const qNoDot = raw.replace(/\./g, '')
    const qUpper = qNoDot.toUpperCase()
    const isCodeLike = /^[A-Z][0-9]{1,5}$/.test(qUpper)

    // ถ้าเป็นรูปแบบรหัส (เช่น A01, A010, M4922) ให้ค้นหาแบบ prefix ของรหัสเท่านั้น
    // เพื่อหลีกเลี่ยงชื่อโรคที่มีข้อความอย่าง "(A01-...)" ติดมา
    const where = isCodeLike
      ? {
          isActive: true,
          OR: [
            { code: { startsWith: qUpper } },
            { groupCode: { startsWith: qUpper } }
          ]
        }
      : {
          isActive: true,
          ...(raw
            ? {
                OR: [
                  { code: { startsWith: qUpper } },
                  { nameTh: { contains: raw, mode: 'insensitive' } },
                  { nameEn: { contains: raw, mode: 'insensitive' } },
                  { groupCode: { startsWith: qUpper } },
                  { groupNameTh: { contains: raw, mode: 'insensitive' } },
                  { groupNameEn: { contains: raw, mode: 'insensitive' } }
                ]
              }
            : {})
        }

    const [items, total] = await Promise.all([
      prisma.icd10.findMany({
        where,
        select: {
          id: true,
          code: true,
          nameTh: true,
          nameEn: true,
          groupCode: true,
          groupNameTh: true,
          groupNameEn: true
        },
        orderBy: { code: 'asc' },
        skip: Number(offset) || 0,
        take: Math.min(Number(limit) || 20, 100)
      }),
      prisma.icd10.count({ where })
    ])

    return {
      items,
      total,
      limit: Number(limit) || 20,
      offset: Number(offset) || 0,
      hasMore: (Number(offset) || 0) + items.length < total
    }
  }
}


