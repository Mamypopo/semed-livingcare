import express from 'express'
import { visitController } from './visit.controller.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.use(authenticateToken)

// Create visit
router.post('/', visitController.create)

export default router


