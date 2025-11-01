import { prisma } from '../config/db.js'

export const itemCategoryService = {
  /**
   * ดึงหมวดหมู่ทั้งหมด (พร้อม pagination และ filter)
   */
  async list(params = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      categoryType = null,
      isActive = null,
      sort = 'createdAt',
      order = 'desc'
    } = params

    const skip = (page - 1) * limit
    const where = {}

    // Filter by search (name)
    if (search && search.trim()) {
      where.name = { contains: search.trim(), mode: 'insensitive' }
    }

    // Filter by categoryType
    if (categoryType) {
      where.categoryType = categoryType
    }

    // Filter by isActive
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === true || isActive === 'true'
    }

    const [items, total] = await Promise.all([
      prisma.itemCategory.findMany({
        where,
        orderBy: { [sort]: order },
        skip,
        take: limit
      }),
      prisma.itemCategory.count({ where })
    ])

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  },

  /**
   * ดึงหมวดหมู่สำหรับ dropdown (เฉพาะที่ active)
   */
  async getForDropdown(params = {}) {
    const { search = '', limit = 50, categoryType = null } = params

    const where = { isActive: true }

    if (search && search.trim()) {
      where.name = { contains: search.trim(), mode: 'insensitive' }
    }

    // Filter by categoryType
    if (categoryType) {
      where.categoryType = categoryType
    }

    const items = await prisma.itemCategory.findMany({
      where,
      select: {
        id: true,
        name: true,
        categoryType: true
      },
      orderBy: { name: 'asc' },
      take: Number(limit)
    })

    return items
  },

  /**
   * ดึงหมวดหมู่ตาม ID
   */
  async getById(id) {
    const item = await prisma.itemCategory.findUnique({
      where: { id: parseInt(id) }
    })

    if (!item) {
      throw new Error('ไม่พบหมวดหมู่ที่ระบุ')
    }

    return item
  },

  /**
   * สร้างหมวดหมู่ใหม่
   */
  async create(payload) {
    const {
      name,
      categoryType,
      isActive = true,
      createdBy,
      updatedBy
    } = payload

    if (!name || !categoryType) {
      throw new Error('name และ categoryType จำเป็น')
    }

    // Validate categoryType
    const validTypes = ['DRUG_SUPPLY', 'COURSE', 'LAB_XRAY', 'DIAGNOSIS', 'ADVICE_REFERENCE', 'EXPENSE']
    if (!validTypes.includes(categoryType)) {
      throw new Error(`categoryType ต้องเป็นหนึ่งใน: ${validTypes.join(', ')}`)
    }

    const item = await prisma.itemCategory.create({
      data: {
        name,
        categoryType,
        isActive: isActive !== false,
        createdBy: createdBy || null,
        updatedBy: updatedBy || null
      }
    })

    return item
  },

  /**
   * อัปเดตหมวดหมู่
   */
  async update(id, payload) {
    if (!id) throw new Error('id จำเป็น')

    const {
      name,
      categoryType,
      isActive,
      updatedBy
    } = payload

    // Check if exists
    const existing = await prisma.itemCategory.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existing) {
      throw new Error('ไม่พบหมวดหมู่ที่ระบุ')
    }

    // Validate categoryType if provided
    if (categoryType) {
      const validTypes = ['DRUG_SUPPLY', 'COURSE', 'LAB_XRAY', 'DIAGNOSIS', 'ADVICE_REFERENCE', 'EXPENSE']
      if (!validTypes.includes(categoryType)) {
        throw new Error(`categoryType ต้องเป็นหนึ่งใน: ${validTypes.join(', ')}`)
      }
    }

    // Update
    const item = await prisma.itemCategory.update({
      where: { id: parseInt(id) },
      data: {
        ...(name !== undefined && { name }),
        ...(categoryType !== undefined && { categoryType }),
        ...(isActive !== undefined && { isActive }),
        ...(updatedBy && { updatedBy: String(updatedBy) })
      }
    })

    return item
  },

  /**
   * Toggle active status
   */
  async toggleActive(id, userId) {
    if (!id) throw new Error('id จำเป็น')

    const existing = await prisma.itemCategory.findUnique({
      where: { id: parseInt(id) },
      select: { isActive: true }
    })

    if (!existing) {
      throw new Error('ไม่พบหมวดหมู่ที่ระบุ')
    }

    const item = await prisma.itemCategory.update({
      where: { id: parseInt(id) },
      data: {
        isActive: !existing.isActive,
        updatedBy: userId ? String(userId) : null
      }
    })

    return item
  },

  /**
   * ลบหมวดหมู่ (hard delete - ตรวจสอบว่าไม่มี items ใช้)
   */
  async delete(id) {
    if (!id) throw new Error('id จำเป็น')

    const existing = await prisma.itemCategory.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            items: true
          }
        }
      }
    })

    if (!existing) {
      throw new Error('ไม่พบหมวดหมู่ที่ระบุ')
    }

    // ถ้ามี items ใช้ ให้ throw error
    if (existing._count.items > 0) {
      throw new Error('ไม่สามารถลบหมวดหมู่ที่ถูกใช้งานในรายการตรวจ')
    }

    await prisma.itemCategory.delete({
      where: { id: parseInt(id) }
    })

    return { success: true }
  }
}

