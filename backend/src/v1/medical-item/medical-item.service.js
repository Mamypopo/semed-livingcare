import { prisma } from '../config/db.js'
import { getNextItemCode } from '../utils/itemCodeGenerator.js'

// Helper functions
function emptyToNull(v) {
  if (v === undefined || v === null || v === '') return null
  return v
}

function toDecimalOrNull(v) {
  if (v === undefined || v === null || v === '') return null
  const n = Number(v)
  return Number.isNaN(n) ? null : n
}

export const medicalItemService = {
  /**
   * ดึงรายการตรวจทั้งหมด (พร้อม pagination และ filter)
   */
  async list(params = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      categoryId = null,
      examType = null,
      isActive = null,
      sort = 'createdAt',
      order = 'desc'
    } = params

    const skip = (page - 1) * limit
    const where = {}

    // Filter by search (code, name, genericName, nhsoCode)
    if (search && search.trim()) {
      where.OR = [
        { code: { contains: search.trim(), mode: 'insensitive' } },
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { genericName: { contains: search.trim(), mode: 'insensitive' } },
        { nhsoCode: { contains: search.trim(), mode: 'insensitive' } }
      ]
    }

    // Filter by category
    if (categoryId) {
      where.categoryId = parseInt(categoryId)
    }

    // Filter by examType
    if (examType) {
      where.examType = examType
    }

    // Filter by isActive
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === true || isActive === 'true'
    }

    const [items, total] = await Promise.all([
      prisma.medicalItem.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, categoryType: true }
          },
          _count: {
            select: {
              packageComponents: true
            }
          }
        },
        orderBy: { [sort]: order },
        skip,
        take: limit
      }),
      prisma.medicalItem.count({ where })
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
   * ดึงรายการตรวจตาม ID (พร้อม components ถ้าเป็น PACKAGE)
   */
  async getById(id) {
    const item = await prisma.medicalItem.findUnique({
      where: { id: String(id) },
      include: {
        category: {
          select: { id: true, name: true, categoryType: true }
        },
        packageComponents: {
          include: {
            childItem: {
              select: {
                id: true,
                code: true,
                name: true,
                unit: true,
                priceOpd: true,
                priceIpd: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!item) {
      throw new Error('ไม่พบรายการตรวจที่ระบุ')
    }

    return item
  },

  /**
   * สร้างรายการตรวจใหม่ (พร้อม generate code SEMn)
   */
  async create(payload) {
    const {
      name,
      examType,
      categoryId,
      nhsoCode,
      genericName,
      unit,
      priceOpd,
      priceIpd,
      isActive = true,
      createdBy,
      updatedBy
    } = payload

    if (!name || !examType) {
      throw new Error('name และ examType จำเป็น')
    }

    return await prisma.$transaction(async (tx) => {
      // Generate code SEMn
      const { code } = await getNextItemCode(tx)

      // Validate examType
      const validTypes = ['GENERAL', 'LAB', 'XRAY', 'PACKAGE']
      if (!validTypes.includes(examType)) {
        throw new Error(`examType ต้องเป็นหนึ่งใน: ${validTypes.join(', ')}`)
      }

      // Create medical item
      const item = await tx.medicalItem.create({
        data: {
          code,
          name,
          examType,
          categoryId: categoryId ? parseInt(categoryId) : null,
          nhsoCode: emptyToNull(nhsoCode),
          genericName: emptyToNull(genericName),
          unit: emptyToNull(unit),
          priceOpd: toDecimalOrNull(priceOpd),
          priceIpd: toDecimalOrNull(priceIpd),
          isActive: isActive !== false,
          createdBy: emptyToNull(createdBy),
          updatedBy: emptyToNull(updatedBy)
        },
        include: {
          category: {
            select: { id: true, name: true, categoryType: true }
          }
        }
      })

      return item
    })
  },

  /**
   * อัปเดตรายการตรวจ (ห้ามเปลี่ยน code)
   */
  async update(id, payload) {
    if (!id) throw new Error('id จำเป็น')

    const {
      name,
      examType,
      categoryId,
      nhsoCode,
      genericName,
      unit,
      priceOpd,
      priceIpd,
      isActive,
      updatedBy
    } = payload

    // Check if exists
    const existing = await prisma.medicalItem.findUnique({
      where: { id: String(id) }
    })

    if (!existing) {
      throw new Error('ไม่พบรายการตรวจที่ระบุ')
    }

    // Validate examType if provided
    if (examType) {
      const validTypes = ['GENERAL', 'LAB', 'XRAY', 'PACKAGE']
      if (!validTypes.includes(examType)) {
        throw new Error(`examType ต้องเป็นหนึ่งใน: ${validTypes.join(', ')}`)
      }
    }

    // Update
    const item = await prisma.medicalItem.update({
      where: { id: String(id) },
      data: {
        ...(name !== undefined && { name }),
        ...(examType !== undefined && { examType }),
        ...(categoryId !== undefined && { categoryId: categoryId ? parseInt(categoryId) : null }),
        ...(nhsoCode !== undefined && { nhsoCode: emptyToNull(nhsoCode) }),
        ...(genericName !== undefined && { genericName: emptyToNull(genericName) }),
        ...(unit !== undefined && { unit: emptyToNull(unit) }),
        ...(priceOpd !== undefined && { priceOpd: toDecimalOrNull(priceOpd) }),
        ...(priceIpd !== undefined && { priceIpd: toDecimalOrNull(priceIpd) }),
        ...(isActive !== undefined && { isActive }),
        ...(updatedBy && { updatedBy: String(updatedBy) })
      },
      include: {
        category: {
          select: { id: true, name: true, categoryType: true }
        }
      }
    })

    return item
  },

  /**
   * Toggle active status
   */
  async toggleActive(id, userId) {
    if (!id) throw new Error('id จำเป็น')

    const existing = await prisma.medicalItem.findUnique({
      where: { id: String(id) },
      select: { isActive: true }
    })

    if (!existing) {
      throw new Error('ไม่พบรายการตรวจที่ระบุ')
    }

    const item = await prisma.medicalItem.update({
      where: { id: String(id) },
      data: {
        isActive: !existing.isActive,
        updatedBy: userId ? String(userId) : null
      }
    })

    return item
  },

  /**
   * ค้นหารายการตรวจสำหรับ dropdown (เฉพาะ SINGLE items)
   */
  async searchForDropdown(searchQuery, limit = 20) {
    const where = {
      isActive: true,
      examType: { not: 'PACKAGE' }
    }

    if (searchQuery && searchQuery.trim()) {
      where.OR = [
        { code: { contains: searchQuery.trim(), mode: 'insensitive' } },
        { name: { contains: searchQuery.trim(), mode: 'insensitive' } },
        { genericName: { contains: searchQuery.trim(), mode: 'insensitive' } }
      ]
    }

    const items = await prisma.medicalItem.findMany({
      where,
      select: {
        id: true,
        code: true,
        name: true,
        unit: true,
        priceOpd: true,
        priceIpd: true
      },
      orderBy: { code: 'asc' },
      take: limit
    })

    return items
  },

  /**
   * ค้นหารายการตรวจสำหรับ Visit (รวมทั้ง SINGLE items และ PACKAGE)
   * กรองรายการที่เพิ่มไปแล้วใน Visit ออก
   * @param {string} searchQuery - คำค้นหา
   * @param {number} limit - จำนวนสูงสุดที่ต้องการ
   * @param {string} visitId - Visit ID เพื่อกรองรายการที่เพิ่มไปแล้ว (optional)
   */
  async searchForVisit(searchQuery, limit = 20, visitId = null) {
    const where = {
      isActive: true
      // รวมทั้ง single items และ PACKAGE เพื่อให้สามารถเพิ่มเข้า Visit ได้
    }

    if (searchQuery && searchQuery.trim()) {
      where.OR = [
        { code: { contains: searchQuery.trim(), mode: 'insensitive' } },
        { name: { contains: searchQuery.trim(), mode: 'insensitive' } },
        { genericName: { contains: searchQuery.trim(), mode: 'insensitive' } }
      ]
    }

    // ดึงรายการตรวจทั้งหมดที่ตรงกับ search
    let items = await prisma.medicalItem.findMany({
      where,
      select: {
        id: true,
        code: true,
        name: true,
        examType: true,
        unit: true,
        priceOpd: true,
        priceIpd: true
      },
      orderBy: { code: 'asc' },
      take: limit * 2 // ดึงมากกว่าเพื่อกรองที่ backend
    })

    // ถ้ามี visitId ให้กรองรายการที่เพิ่มไปแล้วออก
    if (visitId) {
      // ดึงรายการตรวจที่เพิ่มไปแล้วใน Visit นี้
      const existingVisitItems = await prisma.visitItem.findMany({
        where: {
          visitId: String(visitId)
        },
        select: {
          medicalItemId: true
        }
      })

      const existingItemIds = new Set(existingVisitItems.map(item => item.medicalItemId))

      // หา PACKAGE ที่มี components
      const packageItems = items.filter(item => item.examType === 'PACKAGE')
      const packageIds = packageItems.map(item => item.id)

      // ดึง components ของ PACKAGE ทั้งหมดที่พบ
      let packagesWithComponents = []
      if (packageIds.length > 0) {
        const components = await prisma.medicalItemComponent.findMany({
          where: {
            parentItemId: { in: packageIds }
          },
          select: {
            parentItemId: true,
            childItemId: true
          }
        })

        // จัดกลุ่ม components ตาม parentItemId
        const componentsByPackage = {}
        components.forEach(comp => {
          if (!componentsByPackage[comp.parentItemId]) {
            componentsByPackage[comp.parentItemId] = []
          }
          componentsByPackage[comp.parentItemId].push(comp.childItemId)
        })

        packagesWithComponents = Object.entries(componentsByPackage).map(([parentId, childIds]) => ({
          packageId: parentId,
          componentIds: childIds
        }))
      }

      // กรองรายการที่เพิ่มไปแล้วออก
      items = items.filter(item => {
        // สำหรับ single items - ถ้าเพิ่มไปแล้วให้ซ่อน
        if (item.examType !== 'PACKAGE') {
          return !existingItemIds.has(item.id)
        }

        // สำหรับ PACKAGE - ตรวจสอบว่า components ทั้งหมดถูกเพิ่มไปแล้วหรือยัง
        const packageComponents = packagesWithComponents.find(p => p.packageId === item.id)
        if (!packageComponents || packageComponents.componentIds.length === 0) {
          // PACKAGE ที่ไม่มี components ให้แสดงไว้ก่อน (จะได้ error ตอนเพิ่ม)
          return true
        }

        // ตรวจสอบว่า components ทั้งหมดถูกเพิ่มไปแล้วหรือยัง
        const allComponentsAdded = packageComponents.componentIds.every(
          childId => existingItemIds.has(childId)
        )

        // ถ้า components ทั้งหมดถูกเพิ่มไปแล้วให้ซ่อน PACKAGE
        return !allComponentsAdded
      })
    }

    // ตัดให้เหลือตาม limit
    return items.slice(0, limit)
  },

  /**
   * ดึงรายการตรวจที่สามารถเพิ่มเข้าแพ็คเกจได้ (GENERAL, LAB, XRAY - ไม่ใช่ PACKAGE)
   */
  async getForPackage(params = {}) {
    const { search = '', limit = 100 } = params

    const where = {
      examType: { in: ['GENERAL', 'LAB', 'XRAY'] }, // ไม่รวม PACKAGE
      isActive: true
    }

    if (search && search.trim()) {
      where.OR = [
        { code: { contains: search.trim(), mode: 'insensitive' } },
        { name: { contains: search.trim(), mode: 'insensitive' } }
      ]
    }

    const items = await prisma.medicalItem.findMany({
      where,
      select: {
        id: true,
        code: true,
        name: true,
        examType: true,
        unit: true,
        priceOpd: true,
        priceIpd: true,
        category: {
          select: { id: true, name: true }
        }
      },
      orderBy: { code: 'asc' },
      take: Number(limit)
    })

    return items
  },

  /**
   * ดึงรายการย่อย (components) ของแพ็คเกจ
   */
  async getComponents(parentItemId) {
    const components = await prisma.medicalItemComponent.findMany({
      where: { parentItemId: String(parentItemId) },
      include: {
        childItem: {
          select: {
            id: true,
            code: true,
            name: true,
            examType: true,
            unit: true,
            priceOpd: true,
            priceIpd: true,
            category: {
              select: { id: true, name: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    return components
  },

  /**
   * เพิ่มรายการย่อยหลายรายการเข้าแพ็คเกจพร้อมกัน (bulk)
   * @param {string} parentItemId - ID ของแพ็คเกจ
   * @param {Array<{childItemId: string, quantity: number}>} items - Array ของรายการย่อย
   */
  async addComponents(parentItemId, items = []) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('กรุณาระบุรายการย่อยที่ต้องการเพิ่ม')
    }

    // ตรวจสอบว่า parentItem เป็น PACKAGE หรือไม่
    const parentItem = await prisma.medicalItem.findUnique({
      where: { id: String(parentItemId) }
    })

    if (!parentItem) {
      throw new Error('ไม่พบรายการตรวจหลัก (แพ็คเกจ)')
    }

    if (parentItem.examType !== 'PACKAGE') {
      throw new Error('รายการตรวจนี้ไม่ใช่แพ็คเกจ')
    }

    // ตรวจสอบความถูกต้องของ items
    for (const item of items) {
      if (!item.childItemId) {
        throw new Error('childItemId is required for all items')
      }

      // ตรวจสอบว่า childItem มีอยู่จริง
      const childItem = await prisma.medicalItem.findUnique({
        where: { id: String(item.childItemId) }
      })

      if (!childItem) {
        throw new Error(`ไม่พบรายการตรวจย่อย: ${item.childItemId}`)
      }

      // ตรวจสอบว่า childItem ไม่ใช่ PACKAGE
      if (childItem.examType === 'PACKAGE') {
        throw new Error(`ไม่สามารถเพิ่มแพ็คเกจเข้าแพ็คเกจได้: ${item.childItemId}`)
      }
    }

    // ตรวจสอบว่ามีรายการซ้ำใน items หรือไม่
    const childItemIds = items.map(item => String(item.childItemId))
    const uniqueChildItemIds = [...new Set(childItemIds)]
    if (childItemIds.length !== uniqueChildItemIds.length) {
      throw new Error('มีรายการย่อยซ้ำกันในรายการที่ต้องการเพิ่ม')
    }

    // ตรวจสอบว่ารายการใดบ้างที่เพิ่มไปแล้ว
    const existingComponents = await prisma.medicalItemComponent.findMany({
      where: {
        parentItemId: String(parentItemId),
        childItemId: { in: childItemIds }
      },
      select: {
        childItemId: true
      }
    })

    const existingChildItemIds = existingComponents.map(c => c.childItemId)
    const duplicateIds = childItemIds.filter(id => existingChildItemIds.includes(id))

    if (duplicateIds.length > 0) {
      throw new Error(`มีรายการย่อยที่เพิ่มไปแล้ว: ${duplicateIds.join(', ')}`)
    }

    // ดึงราคาของ childItems สำหรับเก็บ snapshot
    const childItems = await prisma.medicalItem.findMany({
      where: {
        id: { in: childItemIds }
      },
      select: {
        id: true,
        priceOpd: true,
        priceIpd: true
      }
    })

    const priceMap = {}
    childItems.forEach(item => {
      priceMap[item.id] = {
        priceOpd: item.priceOpd,
        priceIpd: item.priceIpd
      }
    })

    // สร้าง components ทั้งหมดพร้อมกัน
    const componentsToCreate = items.map(item => {
      const childItemId = String(item.childItemId)
      const prices = priceMap[childItemId] || {}
      
      // ใช้ราคาที่ส่งมาหรือราคาจาก childItem (snapshot)
      return {
        parentItemId: String(parentItemId),
        childItemId: childItemId,
        quantity: parseInt(item.quantity) || 1,
        priceOpd: item.priceOpd !== undefined ? toDecimalOrNull(item.priceOpd) : (prices.priceOpd ? toDecimalOrNull(prices.priceOpd) : null),
        priceIpd: item.priceIpd !== undefined ? toDecimalOrNull(item.priceIpd) : (prices.priceIpd ? toDecimalOrNull(prices.priceIpd) : null)
      }
    })

    // ใช้ transaction เพื่อบันทึกทั้งหมดพร้อมกัน
    const createdComponents = await prisma.$transaction(
      componentsToCreate.map(data =>
        prisma.medicalItemComponent.create({
          data,
          include: {
            childItem: {
              select: {
                id: true,
                code: true,
                name: true,
                examType: true,
                unit: true,
                priceOpd: true,
                priceIpd: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                    categoryType: true
                  }
                }
              }
            }
          }
        })
      )
    )

    return createdComponents
  },

  /**
   * ลบรายการย่อยหลายรายการออกจากแพ็คเกจพร้อมกัน (bulk)
   */
  async removeComponents(parentItemId, componentIds = []) {
    if (!Array.isArray(componentIds) || componentIds.length === 0) {
      return { success: true, deletedCount: 0 }
    }

    // ตรวจสอบว่า components ทั้งหมดเป็นของ parentItem นี้หรือไม่
    const components = await prisma.medicalItemComponent.findMany({
      where: {
        id: { in: componentIds.map(id => parseInt(id)) },
        parentItemId: String(parentItemId)
      }
    })

    if (components.length !== componentIds.length) {
      throw new Error('บางรายการไม่พบในแพ็คเกจนี้')
    }

    // ลบ components ทั้งหมดใน transaction
    const result = await prisma.medicalItemComponent.deleteMany({
      where: {
        id: { in: componentIds.map(id => parseInt(id)) },
        parentItemId: String(parentItemId)
      }
    })

    return { success: true, deletedCount: result.count }
  }
}

