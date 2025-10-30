import express from 'express'
import { visitController } from './visit.controller.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.use(authenticateToken)

// Create visit
router.post('/', visitController.create)

// List visits by patient
router.get('/', visitController.list)

export default router


