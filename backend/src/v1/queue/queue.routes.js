import express from 'express'
import * as queueController from './queue.controller.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

// ใช้ middleware สำหรับทุก routes
router.use(authenticateToken)

/**
 * @route POST /api/v1/queues
 * @desc สร้างคิวใหม่
 * @access Private
 */
router.post('/', queueController.createQueueController)

/**
 * @route GET /api/v1/queues
 * @desc ดึงข้อมูลคิวทั้งหมด
 * @access Private
 * @query page, limit, search, status, queueType, branchId, departmentId, doctorId, dateFrom, dateTo, sort, order
 */
router.get('/', queueController.getAllQueuesController)

/**
 * @route GET /api/v1/queues/:id
 * @desc ดึงข้อมูลคิวตาม ID
 * @access Private
 */
router.get('/:id', queueController.getQueueByIdController)

/**
 * @route PATCH /api/v1/queues/:id/cancel
 * @desc ยกเลิกคิว
 * @access Private
 */
router.patch('/:id/cancel', queueController.cancelQueueController)

export default router
