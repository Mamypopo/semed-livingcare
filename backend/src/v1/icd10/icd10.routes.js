import express from 'express'
import { icd10Controller } from './icd10.controller.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'
const router = express.Router()

router.use(authenticateToken)

// GET /api/v1/icd10/search?query=...&limit=20&offset=0 (สำหรับ dropdown/search)
// ต้องมาก่อน /:id เพื่อไม่ให้ conflict
router.get('/search', icd10Controller.search)

// GET /api/v1/icd10/:id (ต้องมาก่อน / เพื่อไม่ให้ conflict)
router.get('/:id', icd10Controller.getById)

// GET /api/v1/icd10?page=1&limit=10&search=... (สำหรับ CRUD list)
router.get('/', icd10Controller.list)

// POST /api/v1/icd10
router.post('/', icd10Controller.create)

// PUT /api/v1/icd10/:id
router.put('/:id', icd10Controller.update)

// PATCH /api/v1/icd10/:id/toggle-active
router.patch('/:id/toggle-active', icd10Controller.toggleActive)

// DELETE /api/v1/icd10/:id
router.delete('/:id', icd10Controller.delete)

export default router


