import { itemCategoryService } from './item-category.service.js'
import { createSystemLog } from '../utils/logger.js'

export const itemCategoryController = {
  async list(req, res, next) {
    try {
      const params = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        search: req.query.search || '',
        categoryType: req.query.categoryType || null,
        isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : null,
        sort: req.query.sort || 'createdAt',
        order: req.query.order || 'desc'
      }

      const result = await itemCategoryService.list(params)
      res.json({
        success: true,
        data: result.items,
        pagination: result.pagination
      })
    } catch (err) {
      next(err)
    }
  },

  async getForDropdown(req, res, next) {
    try {
      const params = {
        search: req.query.search || '',
        limit: parseInt(req.query.limit) || 50,
        categoryType: req.query.categoryType || null
      }
      const items = await itemCategoryService.getForDropdown(params)
      res.json({ success: true, data: items })
    } catch (err) {
      next(err)
    }
  },

  async getById(req, res, next) {
    try {
      const item = await itemCategoryService.getById(req.params.id)
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

      const result = await itemCategoryService.create(payload)
      
      // บันทึก log
      await createSystemLog(req, 'CREATE_ITEM_CATEGORY', {
        categoryId: result.id,
        name: result.name,
        categoryType: result.categoryType
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
      const existing = await itemCategoryService.getById(req.params.id)
      
      const payload = {
        ...req.body,
        updatedBy: userId ? String(userId) : undefined
      }

      const result = await itemCategoryService.update(req.params.id, payload)
      
      // บันทึก log (before/after)
      await createSystemLog(req, 'UPDATE_ITEM_CATEGORY', {
        categoryId: result.id,
        name: result.name,
        before: {
          name: existing.name,
          categoryType: existing.categoryType,
          isActive: existing.isActive
        },
        after: {
          name: result.name,
          categoryType: result.categoryType,
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
      const existing = await itemCategoryService.getById(req.params.id)
      
      const result = await itemCategoryService.toggleActive(req.params.id, userId)
      
      // บันทึก log
      await createSystemLog(req, 'TOGGLE_ITEM_CATEGORY_ACTIVE', {
        categoryId: result.id,
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
      const existing = await itemCategoryService.getById(req.params.id)
      
      const result = await itemCategoryService.delete(req.params.id)
      
      // บันทึก log
      await createSystemLog(req, 'DELETE_ITEM_CATEGORY', {
        categoryId: existing.id,
        name: existing.name,
        categoryType: existing.categoryType
      })

      res.json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  }
}

