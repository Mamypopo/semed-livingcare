import { visitItemService } from './visit-item.service.js'
import { logVisit } from '../Loggers/visitLogger.js'
import { prisma } from '../config/db.js'

export const visitItemController = {
  /**
   * ดึงรายการตรวจทั้งหมดของ Visit
   */
  async list(req, res, next) {
    try {
      const visitId = req.params.visitId
      const items = await visitItemService.list(visitId)
      res.json({ success: true, data: items })
    } catch (err) {
      next(err)
    }
  },

  /**
   * เพิ่มรายการตรวจ (ไม่ใช่ PACKAGE) เข้า Visit
   */
  async create(req, res, next) {
    try {
      const visitId = req.params.visitId
      const userId = req.user?.id
      
      const payload = {
        ...req.body,
        orderedBy: userId ? parseInt(userId) : null,
        branchId: req.user?.branchId || req.body.branchId || null
      }

      const result = await visitItemService.create(visitId, payload)
      
      // บันทึก log
      await logVisit(prisma, {
        visitId,
        action: 'ADD_VISIT_ITEM',
        details: {
          visitItemId: result.id,
          medicalItemId: result.medicalItemId,
          medicalItemCode: result.medicalItem?.code,
          medicalItemName: result.medicalItem?.name,
          quantity: result.quantity,
          price: result.price
        },
        userId: userId ? parseInt(userId) : null,
        branchId: req.user?.branchId || payload.branchId || null,
        hn: result.visit?.patient?.hn || null
      })

      res.status(201).json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  },

  /**
   * เพิ่มแพ็คเกจเข้า Visit (จะขยายเป็นรายการย่อยทั้งหมด)
   */
  async addPackage(req, res, next) {
    try {
      const visitId = req.params.visitId
      const userId = req.user?.id
      
      const payload = {
        ...req.body,
        orderedBy: userId ? parseInt(userId) : null,
        branchId: req.user?.branchId || req.body.branchId || null
      }

      const results = await visitItemService.addPackage(visitId, payload)
      
      // ดึง hn จาก result แรก (ทุก item ใน package มี visit เดียวกัน)
      const firstResult = results[0]
      const hn = firstResult?.visit?.patient?.hn || null
      
      // บันทึก log
      await logVisit(prisma, {
        visitId,
        action: 'ADD_VISIT_PACKAGE',
        details: {
          packageId: payload.medicalItemId,
          addedItemsCount: results.length,
          items: results.map(item => ({
            visitItemId: item.id,
            medicalItemId: item.medicalItemId,
            medicalItemCode: item.medicalItem?.code,
            medicalItemName: item.medicalItem?.name,
            quantity: item.quantity
          }))
        },
        userId: userId ? parseInt(userId) : null,
        branchId: req.user?.branchId || payload.branchId || null,
        hn
      })

      res.status(201).json({ success: true, data: results })
    } catch (err) {
      next(err)
    }
  },

  /**
   * แก้ไขรายการตรวจใน Visit
   */
  async update(req, res, next) {
    try {
      const visitItemId = req.params.id
      const userId = req.user?.id

      // ดึงข้อมูลเดิมก่อน update (เพื่อ log)
      const existingItem = await prisma.visitItem.findUnique({
        where: { id: visitItemId },
        include: {
          visit: {
            select: {
              id: true,
              patient: {
                select: { hn: true }
              }
            }
          },
          medicalItem: {
            select: { id: true, code: true, name: true }
          }
        }
      })

      if (!existingItem) {
        return res.status(404).json({ success: false, message: 'ไม่พบรายการตรวจ' })
      }

      const payload = {
        ...req.body,
        // ไม่ต้องอัปเดต orderedBy, branchId เพราะเป็นข้อมูล snapshot
      }

      const result = await visitItemService.update(visitItemId, payload)

      // บันทึก log
      await logVisit(prisma, {
        visitId: existingItem.visitId,
        action: 'UPDATE_VISIT_ITEM',
        details: {
          visitItemId: result.id,
          medicalItemId: result.medicalItemId,
          medicalItemCode: result.medicalItem?.code,
          medicalItemName: result.medicalItem?.name,
          before: {
            quantity: existingItem.quantity,
            price: existingItem.price,
            discount: existingItem.discount,
            discountType: existingItem.discountType
          },
          after: {
            quantity: result.quantity,
            price: result.price,
            discount: result.discount,
            discountType: result.discountType
          }
        },
        userId: userId ? parseInt(userId) : null,
        branchId: req.user?.branchId || existingItem.branchId || null,
        hn: existingItem.visit?.patient?.hn || null
      })

      res.json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  },

  /**
   * ลบรายการตรวจออกจาก Visit
   */
  async remove(req, res, next) {
    try {
      const visitItemId = req.params.id
      
      // ดึงข้อมูลก่อน delete (เพื่อ log)
      const existing = await prisma.visitItem.findUnique({
        where: { id: visitItemId },
        include: {
          visit: { 
            select: { 
              id: true,
              patient: { select: { hn: true } }
            } 
          },
          medicalItem: { select: { id: true, code: true, name: true } }
        }
      })

      const result = await visitItemService.remove(visitItemId)
      
      // บันทึก log
      if (existing) {
        await logVisit(prisma, {
          visitId: existing.visitId,
          action: 'REMOVE_VISIT_ITEM',
          details: {
            visitItemId: existing.id,
            medicalItemId: existing.medicalItemId,
            medicalItemCode: existing.medicalItem?.code,
            medicalItemName: existing.medicalItem?.name
          },
          userId: req.user?.id ? parseInt(req.user.id) : null,
          branchId: req.user?.branchId || existing.branchId || null,
          hn: existing.visit?.patient?.hn || null
        })
      }

      res.json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  }
}

