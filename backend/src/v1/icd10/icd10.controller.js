import { icd10Service } from './icd10.service.js'

export const icd10Controller = {
  async search(req, res, next) {
    try {
      const { query = '', limit = '20', offset = '0' } = req.query
      const data = await icd10Service.search({ query, limit, offset })
      res.json({ success: true, data })
    } catch (err) {
      next(err)
    }
  }
}


