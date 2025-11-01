import express from 'express'
import { itemCategoryController } from './item-category.controller.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.use(authenticateToken)

// Get for dropdown (เฉพาะที่ active)
router.get('/dropdown', itemCategoryController.getForDropdown)

// List item categories
router.get('/', itemCategoryController.list)

// Get item category by id
router.get('/:id', itemCategoryController.getById)

// Create item category
router.post('/', itemCategoryController.create)

// Update item category
router.put('/:id', itemCategoryController.update)

// Toggle active status
router.patch('/:id/toggle-active', itemCategoryController.toggleActive)

// Delete item category
router.delete('/:id', itemCategoryController.delete)

export default router

