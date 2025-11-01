import { medicalItemService } from './medical-item.service.js'
import { createSystemLog } from '../utils/logger.js'

export const medicalItemController = {
  async list(req, res, next) {
    try {
      const params = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        search: req.query.search || '',
        categoryId: req.query.categoryId || null,
        examType: req.query.examType || null,
        isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : null,
        sort: req.query.sort || 'createdAt',
        order: req.query.order || 'desc'
      }

      const result = await medicalItemService.list(params)
      res.json({
        success: true,
        data: result.items,
        pagination: result.pagination
      })
    } catch (err) {
      next(err)
    }
  },

  async getById(req, res, next) {
    try {
      const item = await medicalItemService.getById(req.params.id)
      res.json({ success: true, data: item })
    } catch (err) {
      next(err)
    }
  },

  async create(req, res, next) {
    try {
      const userId = req.user?.id
      const payload = {
        ...req.body,
        createdBy: userId ? String(userId) : undefined,
        updatedBy: userId ? String(userId) : undefined
      }

      const result = await medicalItemService.create(payload)
      
      // บันทึก log
      await createSystemLog(req, 'CREATE_MEDICAL_ITEM', {
        itemId: result.id,
        code: result.code,
        name: result.name,
        examType: result.examType,
        categoryId: result.categoryId,
        categoryName: result.category?.name
      })

      res.status(201).json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  },

  async update(req, res, next) {
    try {
      const userId = req.user?.id
      
      // ดึงข้อมูลเดิมก่อน update
      const existing = await medicalItemService.getById(req.params.id)
      
      const payload = {
        ...req.body,
        updatedBy: userId ? String(userId) : undefined
      }

      const result = await medicalItemService.update(req.params.id, payload)
      
      // บันทึก log (before/after)
      await createSystemLog(req, 'UPDATE_MEDICAL_ITEM', {
        itemId: result.id,
        code: result.code,
        name: result.name,
        before: {
          name: existing.name,
          examType: existing.examType,
          categoryId: existing.categoryId,
          priceOpd: existing.priceOpd,
          priceIpd: existing.priceIpd,
          isActive: existing.isActive
        },
        after: {
          name: result.name,
          examType: result.examType,
          categoryId: result.categoryId,
          priceOpd: result.priceOpd,
          priceIpd: result.priceIpd,
          isActive: result.isActive
        }
      })

      res.json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  },

  async toggleActive(req, res, next) {
    try {
      const userId = req.user?.id
      
      // ดึงข้อมูลเดิมก่อน toggle
      const existing = await medicalItemService.getById(req.params.id)
      
      const result = await medicalItemService.toggleActive(req.params.id, userId)
      
      // บันทึก log
      await createSystemLog(req, 'TOGGLE_MEDICAL_ITEM_ACTIVE', {
        itemId: result.id,
        code: result.code,
        name: result.name,
        before: { isActive: existing.isActive },
        after: { isActive: result.isActive }
      })

      res.json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  },

  async delete(req, res, next) {
    try {
      // ดึงข้อมูลก่อน delete (เพื่อ log)
      const existing = await medicalItemService.getById(req.params.id)
      
      const result = await medicalItemService.delete(req.params.id)
      
      // บันทึก log
      await createSystemLog(req, 'DELETE_MEDICAL_ITEM', {
        itemId: existing.id,
        code: existing.code,
        name: existing.name,
        examType: existing.examType
      })

      res.json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  },

  async searchForDropdown(req, res, next) {
    try {
      const searchQuery = req.query.search || ''
      const limit = parseInt(req.query.limit) || 20
      const items = await medicalItemService.searchForDropdown(searchQuery, limit)
      res.json({ success: true, data: items })
    } catch (err) {
      next(err)
    }
  },

  /**
   * ดึงรายการตรวจที่สามารถเพิ่มเข้าแพ็คเกจได้
   */
  async getForPackage(req, res, next) {
    try {
      const params = {
        search: req.query.search || '',
        limit: parseInt(req.query.limit) || 100
      }
      const items = await medicalItemService.getForPackage(params)
      res.json({ success: true, data: items })
    } catch (err) {
      next(err)
    }
  },

  /**
   * ดึงรายการย่อย (components) ของแพ็คเกจ
   */
  async getComponents(req, res, next) {
    try {
      const components = await medicalItemService.getComponents(req.params.id)
      res.json({ success: true, data: components })
    } catch (err) {
      next(err)
    }
  },

  /**
   * เพิ่มรายการย่อยหลายรายการเข้าแพ็คเกจพร้อมกัน (bulk)
   */
  async addComponents(req, res, next) {
    try {
      const { items } = req.body
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: 'items array is required' })
      }
      const components = await medicalItemService.addComponents(req.params.id, items)
      res.json({ success: true, data: components })
    } catch (err) {
      next(err)
    }
  },

  /**
   * ลบรายการย่อยหลายรายการออกจากแพ็คเกจพร้อมกัน (bulk)
   */
  async removeComponents(req, res, next) {
    try {
      const { componentIds } = req.body
      if (!Array.isArray(componentIds) || componentIds.length === 0) {
        return res.status(400).json({ success: false, message: 'componentIds array is required' })
      }
      const result = await medicalItemService.removeComponents(req.params.id, componentIds)
      res.json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  }
}

