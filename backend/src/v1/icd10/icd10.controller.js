import { icd10Service } from './icd10.service.js'
import { createSystemLog } from '../utils/logger.js'

export const icd10Controller = {
  /**
   * ค้นหา ICD10 (สำหรับ dropdown/search)
   */
  async search(req, res, next) {
    try {
      const { query = '', limit = '20', offset = '0' } = req.query
      const data = await icd10Service.search({ query, limit, offset })
      res.json({ success: true, data })
    } catch (err) {
      next(err)
    }
  },

  /**
   * ดึงรายการ ICD10 ทั้งหมด (พร้อม pagination และ filter)
   */
  async list(req, res, next) {
    try {
      const {
        page = '1',
        limit = '10',
        search = '',
        groupCode = '',
        isActive = '',
        sort = 'createdAt',
        order = 'desc'
      } = req.query

      const params = {
        page: parseInt(page),
        limit: parseInt(limit),
        search: search || undefined,
        groupCode: groupCode || undefined,
        isActive: isActive === '' ? undefined : isActive === 'true',
        sort,
        order
      }

      const result = await icd10Service.list(params)
      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      })
    } catch (err) {
      next(err)
    }
  },

  /**
   * ดึงรายการ ICD10 ตาม ID
   */
  async getById(req, res, next) {
    try {
      const item = await icd10Service.getById(req.params.id)
      res.json({ success: true, data: item })
    } catch (err) {
      next(err)
    }
  },

  /**
   * สร้างรายการ ICD10 ใหม่
   */
  async create(req, res, next) {
    try {
      const result = await icd10Service.create(req.body)

      // บันทึก log
      await createSystemLog(req, 'CREATE_ICD10', {
        icd10Id: result.id,
        code: result.code,
        nameTh: result.nameTh,
        groupCode: result.groupCode
      })

      res.status(201).json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  },

  /**
   * อัพเดทรายการ ICD10
   */
  async update(req, res, next) {
    try {
      // ดึงข้อมูลเดิมก่อน update
      const existing = await icd10Service.getById(req.params.id)

      const result = await icd10Service.update(req.params.id, req.body)

      // บันทึก log (before/after)
      await createSystemLog(req, 'UPDATE_ICD10', {
        icd10Id: result.id,
        code: result.code,
        before: {
          code: existing.code,
          nameTh: existing.nameTh,
          nameEn: existing.nameEn,
          groupCode: existing.groupCode,
          groupNameTh: existing.groupNameTh,
          groupNameEn: existing.groupNameEn,
          isActive: existing.isActive
        },
        after: {
          code: result.code,
          nameTh: result.nameTh,
          nameEn: result.nameEn,
          groupCode: result.groupCode,
          groupNameTh: result.groupNameTh,
          groupNameEn: result.groupNameEn,
          isActive: result.isActive
        }
      })

      res.json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  },

  /**
   * เปิด/ปิดใช้งานรายการ ICD10
   */
  async toggleActive(req, res, next) {
    try {
      // ดึงข้อมูลเดิมก่อน toggle
      const existing = await icd10Service.getById(req.params.id)

      const result = await icd10Service.toggleActive(req.params.id)

      // บันทึก log
      await createSystemLog(req, 'TOGGLE_ICD10_ACTIVE', {
        icd10Id: result.id,
        code: result.code,
        nameTh: result.nameTh,
        before: { isActive: existing.isActive },
        after: { isActive: result.isActive }
      })

      res.json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  },

  /**
   * ลบรายการ ICD10
   */
  async delete(req, res, next) {
    try {
      // ดึงข้อมูลก่อน delete (เพื่อ log)
      const existing = await icd10Service.getById(req.params.id)

      const result = await icd10Service.delete(req.params.id)

      // บันทึก log
      await createSystemLog(req, 'DELETE_ICD10', {
        icd10Id: existing.id,
        code: existing.code,
        nameTh: existing.nameTh
      })

      res.json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  }
}


