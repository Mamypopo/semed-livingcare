import express from 'express'
import { icd10Controller } from './icd10.controller.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'
const router = express.Router()

router.use(authenticateToken)
// GET /api/v1/icd10?query=...&limit=20&offset=0
router.get('/', icd10Controller.search)

export default router


