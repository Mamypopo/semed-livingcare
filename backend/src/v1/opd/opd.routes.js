import express from 'express'
import * as opdController from './opd.controller.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

// ใช้ middleware สำหรับทุก routes
router.use(authenticateToken)

/**
 * @route GET /api/v1/opd/queue/:queueId
 * @desc ดึงข้อมูลคิวพร้อมข้อมูลผู้ป่วยสำหรับหน้า OPD Management
 * @access Private
 */
router.get('/queue/:queueId', opdController.getQueueForOPDManagementController)

export default router
