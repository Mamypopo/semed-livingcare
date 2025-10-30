import { visitService } from './visit.service.js'

export const visitController = {
  async create(req, res, next) {
    try {
      const userId = req.user?.id
      const payload = {
        ...req.body,
        createdBy: userId ? String(userId) : undefined,
        updatedBy: userId ? String(userId) : undefined
      }
      const result = await visitService.create(payload)
      res.status(201).json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  },
  async list(req, res, next) {
    try {
      const { patientId } = req.query
      if (!patientId) {
        return res.status(400).json({ success: false, message: 'patientId จำเป็น' })
      }
      const items = await visitService.listByPatient(patientId)
      res.json({ success: true, data: { items } })
    } catch (err) {
      next(err)
    }
  }
  ,
  async getById(req, res, next) {
    try {
      const item = await visitService.getById(req.params.id)
      res.json({ success: true, data: item })
    } catch (err) {
      next(err)
    }
  },
  async update(req, res, next) {
    try {
      const userId = req.user?.id
      const payload = { ...req.body, updatedBy: userId ? String(userId) : undefined }
      const result = await visitService.update(req.params.id, payload)
      res.json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  }
}

