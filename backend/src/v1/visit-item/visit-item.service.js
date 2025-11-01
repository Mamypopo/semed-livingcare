import { prisma } from '../config/db.js'
import { medicalItemService } from '../medical-item/medical-item.service.js'

function toDecimalOrNull(v) {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  return Number.isNaN(n) ? null : n
}

function emptyToNull(v) {
  return v === '' || v === undefined || v === null ? null : v
}

export const visitItemService = {
  /**
   * ดึงรายการตรวจทั้งหมดของ Visit
   */
  async list(visitId) {
    const items = await prisma.visitItem.findMany({
      where: { visitId: String(visitId) },
      include: {
        medicalItem: {
          select: {
            id: true,
            code: true,
            name: true,
            examType: true,
            unit: true,
            category: {
              select: {
                id: true,
                name: true,
                categoryType: true
              }
            }
          }
        },
        orderedByUser: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { orderedAt: 'desc' }
    })

    return items
  },

  /**
   * เพิ่มรายการตรวจ (ไม่ใช่ PACKAGE) เข้า Visit
   */
  async create(visitId, payload) {
    const {
      medicalItemId,
      quantity = 1,
      price,
      discount = 0,
      discountType = 'AMOUNT',
      orderedBy,
      branchId
    } = payload

    // ตรวจสอบว่า Visit มีอยู่จริง
    const visit = await prisma.visit.findUnique({
      where: { id: String(visitId) }
    })

    if (!visit) {
      throw new Error('ไม่พบ Visit')
    }

    // ตรวจสอบว่า MedicalItem มีอยู่จริง
    const medicalItem = await prisma.medicalItem.findUnique({
      where: { id: String(medicalItemId) },
      select: {
        id: true,
        code: true,
        name: true,
        examType: true,
        priceOpd: true,
        priceIpd: true,
        isActive: true
      }
    })

    if (!medicalItem) {
      throw new Error('ไม่พบรายการตรวจ')
    }

    if (!medicalItem.isActive) {
      throw new Error('รายการตรวจถูกปิดใช้งาน')
    }

    // ตรวจสอบว่าไม่ใช่ PACKAGE (PACKAGE ต้องใช้ addPackage)
    if (medicalItem.examType === 'PACKAGE') {
      throw new Error('กรุณาใช้ addPackage สำหรับแพ็คเกจ')
    }

    // ตรวจสอบว่ามีการสั่งซ้ำใน visit เดียวกันหรือไม่
    const existing = await prisma.visitItem.findUnique({
      where: {
        visitId_medicalItemId: {
          visitId: String(visitId),
          medicalItemId: String(medicalItemId)
        }
      }
    })

    if (existing) {
      throw new Error('รายการนี้ถูกสั่งไปแล้วใน Visit นี้')
    }

    // กำหนดราคา (ใช้ราคาจาก medicalItem หรือจาก payload)
    const finalPrice = price !== undefined && price !== null 
      ? toDecimalOrNull(price)
      : toDecimalOrNull(medicalItem.priceOpd || medicalItem.priceIpd)

    // สร้าง VisitItem
    const visitItem = await prisma.visitItem.create({
      data: {
        visitId: String(visitId),
        medicalItemId: String(medicalItemId),
        quantity: parseInt(quantity) || 1,
        price: finalPrice,
        discount: toDecimalOrNull(discount) ?? 0,
        discountType: discountType === 'PERCENTAGE' ? 'PERCENTAGE' : 'AMOUNT',
        orderedBy: orderedBy ? parseInt(orderedBy) : null,
        branchId: branchId ? parseInt(branchId) : null,
        orderedAt: new Date()
      },
      include: {
        visit: {
          select: {
            id: true,
            patient: {
              select: {
                hn: true
              }
            }
          }
        },
        medicalItem: {
          select: {
            id: true,
            code: true,
            name: true,
            examType: true,
            unit: true,
            category: {
              select: {
                id: true,
                name: true,
                categoryType: true
              }
            }
          }
        },
        orderedByUser: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return visitItem
  },

  /**
   * เพิ่มแพ็คเกจเข้า Visit (จะขยายเป็นรายการย่อยทั้งหมด)
   */
  async addPackage(visitId, payload) {
    const {
      medicalItemId,
      quantity = 1,
      discount = 0,
      discountType = 'AMOUNT',
      orderedBy,
      branchId
    } = payload

    // ตรวจสอบว่า Visit มีอยู่จริง
    const visit = await prisma.visit.findUnique({
      where: { id: String(visitId) }
    })

    if (!visit) {
      throw new Error('ไม่พบ Visit')
    }

    // ตรวจสอบว่า MedicalItem มีอยู่จริงและเป็น PACKAGE
    const packageItem = await prisma.medicalItem.findUnique({
      where: { id: String(medicalItemId) },
      select: {
        id: true,
        code: true,
        name: true,
        examType: true,
        isActive: true
      }
    })

    if (!packageItem) {
      throw new Error('ไม่พบรายการตรวจ')
    }

    if (packageItem.examType !== 'PACKAGE') {
      throw new Error('รายการนี้ไม่ใช่แพ็คเกจ')
    }

    if (!packageItem.isActive) {
      throw new Error('รายการตรวจถูกปิดใช้งาน')
    }

    // ดึงรายการย่อยทั้งหมดของแพ็คเกจ
    const components = await medicalItemService.getComponents(String(medicalItemId))

    if (!components || components.length === 0) {
      throw new Error('แพ็คเกจนี้ไม่มีรายการย่อย')
    }

    // ตรวจสอบว่ารายการย่อยใดบ้างที่ถูกสั่งไปแล้ว
    const existingItems = await prisma.visitItem.findMany({
      where: {
        visitId: String(visitId),
        medicalItemId: {
          in: components.map(c => c.childItemId)
        }
      },
      select: {
        medicalItemId: true
      }
    })

    const existingItemIds = existingItems.map(item => item.medicalItemId)
    const newItems = components.filter(c => !existingItemIds.includes(c.childItemId))

    if (newItems.length === 0) {
      throw new Error('รายการย่อยทั้งหมดถูกสั่งไปแล้ว')
    }

    // สร้าง VisitItem สำหรับแต่ละรายการย่อย
    // ใช้ราคา snapshot จาก component ก่อน ถ้าไม่มีค่อยใช้ราคาจาก childItem
    const visitItems = await prisma.$transaction(
      newItems.map(component => {
        const childItemId = component.childItemId
        // ใช้ราคา snapshot จาก component (เก็บไว้ตอนเพิ่มเข้าแพ็คเกจ)
        // ถ้าไม่มีค่อยใช้ราคาจาก childItem
        const componentPriceOpd = component.priceOpd !== null && component.priceOpd !== undefined 
          ? toDecimalOrNull(component.priceOpd) 
          : null
        const componentPriceIpd = component.priceIpd !== null && component.priceIpd !== undefined 
          ? toDecimalOrNull(component.priceIpd) 
          : null
        
        // สำหรับ OPD ใช้ priceOpd เป็นหลัก
        const price = componentPriceOpd || componentPriceIpd || 
          (component.childItem?.priceOpd ? toDecimalOrNull(component.childItem.priceOpd) : null) ||
          (component.childItem?.priceIpd ? toDecimalOrNull(component.childItem.priceIpd) : null)
        
        const itemDiscount = toDecimalOrNull(discount) ?? 0

        return prisma.visitItem.create({
          data: {
            visitId: String(visitId),
            medicalItemId: childItemId,
            quantity: parseInt(quantity) || 1,
            price: price ? toDecimalOrNull(price) : null,
            discount: itemDiscount,
            discountType: discountType === 'PERCENTAGE' ? 'PERCENTAGE' : 'AMOUNT',
            orderedBy: orderedBy ? parseInt(orderedBy) : null,
            branchId: branchId ? parseInt(branchId) : null,
            orderedAt: new Date()
          },
          include: {
            visit: {
              select: {
                id: true,
                patient: {
                  select: {
                    hn: true
                  }
                }
              }
            },
            medicalItem: {
              select: {
                id: true,
                code: true,
                name: true,
                examType: true,
                unit: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                    categoryType: true
                  }
                }
              }
            },
            orderedByUser: {
              select: {
                id: true,
                name: true
              }
            }
          }
        })
      })
    )

    return visitItems
  },

  /**
   * แก้ไขรายการตรวจใน Visit
   */
  async update(visitItemId, payload) {
    const {
      quantity,
      price,
      discount,
      discountType
    } = payload

    // ตรวจสอบว่า VisitItem มีอยู่จริง
    const visitItem = await prisma.visitItem.findUnique({
      where: { id: String(visitItemId) },
      include: {
        visit: {
          select: {
            id: true,
            patient: {
              select: {
                hn: true
              }
            }
          }
        },
        medicalItem: {
          select: {
            id: true,
            code: true,
            name: true
          }
        }
      }
    })

    if (!visitItem) {
      throw new Error('ไม่พบรายการตรวจ')
    }

    // อัปเดต VisitItem
    const updated = await prisma.visitItem.update({
      where: { id: String(visitItemId) },
      data: {
        quantity: quantity !== undefined ? parseInt(quantity) : undefined,
        price: price !== undefined ? toDecimalOrNull(price) : undefined,
        discount: discount !== undefined ? toDecimalOrNull(discount) ?? 0 : undefined,
        discountType: discountType !== undefined ? (discountType === 'PERCENTAGE' ? 'PERCENTAGE' : 'AMOUNT') : undefined
      },
      include: {
        medicalItem: {
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
        },
        orderedByUser: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return updated
  },

  /**
   * ลบรายการตรวจออกจาก Visit
   */
  async remove(visitItemId) {
    const visitItem = await prisma.visitItem.findUnique({
      where: { id: String(visitItemId) }
    })

    if (!visitItem) {
      throw new Error('ไม่พบรายการตรวจ')
    }

    await prisma.visitItem.delete({
      where: { id: String(visitItemId) }
    })

    return { success: true }
  }
}

