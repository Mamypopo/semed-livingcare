import express from 'express'
import * as registrationController from './registration.controller.js'
import { createRegistrationWithQueueController } from './registrationWithQueue.controller.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

// ใช้ middleware สำหรับทุก routes
router.use(authenticateToken)

/**
 * @route POST /api/v1/registrations
 * @desc สร้างการลงทะเบียนใหม่
 * @access Private
 */
router.post('/', registrationController.createRegistrationController)

/**
 * @route POST /api/v1/registrations/with-queue
 * @desc สร้างการลงทะเบียนพร้อมคิวในครั้งเดียว
 * @access Private
 */
router.post('/with-queue', createRegistrationWithQueueController)

/**
 * @route GET /api/v1/registrations
 * @desc ดึงข้อมูลการลงทะเบียนทั้งหมด
 * @access Private
 * @query page, limit, search, status, branchId, departmentId, doctorId, dateFrom, dateTo, sort, order
 */
router.get('/', registrationController.getAllRegistrationsController)

/**
 * @route GET /api/v1/registrations/:id
 * @desc ดึงข้อมูลการลงทะเบียนตาม ID
 * @access Private
 */
router.get('/:id', registrationController.getRegistrationByIdController)

/**
 * @route PATCH /api/v1/registrations/:id/cancel
 * @desc ยกเลิกการลงทะเบียน
 * @access Private
 */
router.patch('/:id/cancel', registrationController.cancelRegistrationController)

export default router
