import express from 'express'
import { visitController } from './visit.controller.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.use(authenticateToken)

// Create visit
router.post('/', visitController.create)

// List visits by patient
router.get('/', visitController.list)

// Get visit by id
router.get('/:id', visitController.getById)

// Update visit
router.put('/:id', visitController.update)

export default router


