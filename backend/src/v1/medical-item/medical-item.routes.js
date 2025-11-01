import express from 'express'
import { medicalItemController } from './medical-item.controller.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.use(authenticateToken)

// Search for dropdown (เฉพาะ SINGLE items)
router.get('/search', medicalItemController.searchForDropdown)

// Search for visit (รวมทั้ง SINGLE items และ PACKAGE)
router.get('/search-for-visit', medicalItemController.searchForVisit)

// Get items for package (GENERAL, LAB, XRAY - ไม่ใช่ PACKAGE)
router.get('/for-package', medicalItemController.getForPackage)

// Get components of a package
router.get('/:id/components', medicalItemController.getComponents)

// Add components to package (bulk)
router.post('/:id/components/bulk', medicalItemController.addComponents)

// Remove multiple components from package (bulk)
router.delete('/:id/components/bulk', medicalItemController.removeComponents)

// List medical items
router.get('/', medicalItemController.list)

// Get medical item by id
router.get('/:id', medicalItemController.getById)

// Create medical item
router.post('/', medicalItemController.create)

// Update medical item
router.put('/:id', medicalItemController.update)

// Toggle active status
router.patch('/:id/toggle-active', medicalItemController.toggleActive)

export default router

