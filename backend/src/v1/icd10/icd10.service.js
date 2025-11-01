import { prisma } from "../config/db.js";

// Helper functions
function emptyToNull(v) {
  if (v === undefined || v === null || v === '') return null
  return v
}

export const icd10Service = {
  /**
   * ค้นหา ICD10 (สำหรับ dropdown/search)
   */
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
  },

  /**
   * ดึงรายการ ICD10 ทั้งหมด (พร้อม pagination และ filter)
   */
  async list(params = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      groupCode = null,
      isActive = null,
      sort = 'createdAt',
      order = 'desc'
    } = params

    const skip = (page - 1) * limit
    const where = {}

    // Filter by search (code, nameTh, nameEn, groupCode, groupNameTh, groupNameEn)
    if (search && search.trim()) {
      const raw = search.trim()
      const qNoDot = raw.replace(/\./g, '')
      const qUpper = qNoDot.toUpperCase()
      where.OR = [
        { code: { contains: qUpper, mode: 'insensitive' } },
        { nameTh: { contains: raw, mode: 'insensitive' } },
        { nameEn: { contains: raw, mode: 'insensitive' } },
        { groupCode: { contains: qUpper, mode: 'insensitive' } },
        { groupNameTh: { contains: raw, mode: 'insensitive' } },
        { groupNameEn: { contains: raw, mode: 'insensitive' } }
      ]
    }

    // Filter by groupCode
    if (groupCode) {
      where.groupCode = groupCode
    }

    // Filter by isActive
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === true || isActive === 'true'
    }

    const [items, total] = await Promise.all([
      prisma.icd10.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, categoryType: true }
          }
        },
        orderBy: { [sort]: order },
        skip,
        take: limit
      }),
      prisma.icd10.count({ where })
    ])

    return {
      data: items,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  },

  /**
   * ดึงรายการ ICD10 ตาม ID
   */
  async getById(id) {
    const item = await prisma.icd10.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: {
          select: { id: true, name: true, categoryType: true }
        }
      }
    })

    if (!item) {
      throw new Error('ICD10 not found')
    }

    return item
  },

  /**
   * สร้างรายการ ICD10 ใหม่
   */
  async create(payload) {
    const {
      code,
      groupCode,
      nameTh,
      nameEn,
      groupNameTh,
      groupNameEn,
      categoryId,
      isActive = true
    } = payload

    // Validate required fields
    if (!code || !code.trim()) {
      throw new Error('Code is required')
    }
    if (!nameTh || !nameTh.trim()) {
      throw new Error('Name (Thai) is required')
    }

    // Normalize code (uppercase, remove dots)
    const normalizedCode = code.replace(/\./g, '').toUpperCase()

    // Check if code already exists
    const existing = await prisma.icd10.findUnique({
      where: { code: normalizedCode }
    })

    if (existing) {
      throw new Error('ICD10 code already exists')
    }

    const item = await prisma.icd10.create({
      data: {
        code: normalizedCode,
        groupCode: emptyToNull(groupCode),
        nameTh: nameTh.trim(),
        nameEn: emptyToNull(nameEn),
        groupNameTh: emptyToNull(groupNameTh),
        groupNameEn: emptyToNull(groupNameEn),
        categoryId: categoryId ? parseInt(categoryId) : null,
        isActive: isActive === true || isActive === 'true'
      }
    })

    return item
  },

  /**
   * อัพเดทรายการ ICD10
   */
  async update(id, payload) {
    const existing = await this.getById(id)

    const {
      code,
      groupCode,
      nameTh,
      nameEn,
      groupNameTh,
      groupNameEn,
      categoryId,
      isActive
    } = payload

    // Validate required fields if provided
    if (code !== undefined && (!code || !code.trim())) {
      throw new Error('Code is required')
    }
    if (nameTh !== undefined && (!nameTh || !nameTh.trim())) {
      throw new Error('Name (Thai) is required')
    }

    // Normalize code if provided (uppercase, remove dots)
    const normalizedCode = code ? code.replace(/\./g, '').toUpperCase() : existing.code

    // Check if code already exists (if changed)
    if (normalizedCode !== existing.code) {
      const duplicate = await prisma.icd10.findUnique({
        where: { code: normalizedCode }
      })

      if (duplicate) {
        throw new Error('ICD10 code already exists')
      }
    }

    const item = await prisma.icd10.update({
      where: { id: parseInt(id) },
      data: {
        ...(code !== undefined && { code: normalizedCode }),
        ...(groupCode !== undefined && { groupCode: emptyToNull(groupCode) }),
        ...(nameTh !== undefined && { nameTh: nameTh.trim() }),
        ...(nameEn !== undefined && { nameEn: emptyToNull(nameEn) }),
        ...(groupNameTh !== undefined && { groupNameTh: emptyToNull(groupNameTh) }),
        ...(groupNameEn !== undefined && { groupNameEn: emptyToNull(groupNameEn) }),
        ...(categoryId !== undefined && { categoryId: categoryId ? parseInt(categoryId) : null }),
        ...(isActive !== undefined && { isActive: isActive === true || isActive === 'true' })
      }
    })

    return item
  },

  /**
   * เปิด/ปิดใช้งานรายการ ICD10
   */
  async toggleActive(id) {
    const existing = await this.getById(id)

    const item = await prisma.icd10.update({
      where: { id: parseInt(id) },
      data: {
        isActive: !existing.isActive
      }
    })

    return item
  },

  /**
   * ลบรายการ ICD10
   */
  async delete(id) {
    const existing = await this.getById(id)

    // Check if used in visits
    const usedInVisits = await prisma.visitDiagnosis.count({
      where: { icd10Id: existing.id }
    })

    if (usedInVisits > 0) {
      throw new Error(`Cannot delete ICD10: used in ${usedInVisits} visit(s)`)
    }

    await prisma.icd10.delete({
      where: { id: parseInt(id) }
    })

    return { success: true }
  }
}


