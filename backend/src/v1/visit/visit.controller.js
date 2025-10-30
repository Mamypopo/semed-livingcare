import { visitService } from './visit.service.js'

export const visitController = {
  async create(req, res, next) {
    try {
      const result = await visitService.create(req.body)
      res.status(201).json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  }
}


