import express from 'express'
import { visitItemController } from './visit-item.controller.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.use(authenticateToken)
// List items for a visit
router.get('/:visitId/items', visitItemController.list)

// Add single item (not PACKAGE)
router.post('/:visitId/items',  visitItemController.create)

// Add package (will expand to components)
router.post('/:visitId/items/package',  visitItemController.addPackage)

// Update item
router.put('/:id', visitItemController.update)

// Remove item
router.delete('/:id',  visitItemController.remove)

export default router

