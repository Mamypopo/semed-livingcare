import express from 'express'
import * as patientController from './patient.controller.js'
import { authenticateToken} from '../middlewares/auth.middleware.js'

const router = express.Router()

// ใช้ auth middleware สำหรับทุก route
router.use(authenticateToken)

// GET /api/v1/patients - ดึงข้อมูลผู้ป่วยทั้งหมด
router.get('/', patientController.getAllPatientsController)

// GET /api/v1/patients/stats - ดึงสถิติผู้ป่วย
router.get('/stats', patientController.getPatientStatsController)

// GET /api/v1/patients/:id - ดึงข้อมูลผู้ป่วยตาม ID
router.get('/:id', patientController.getPatientByIdController)

// POST /api/v1/patients - สร้างผู้ป่วยใหม่
router.post('/', patientController.createPatientController)

// PUT /api/v1/patients/:id - อัปเดตข้อมูลผู้ป่วย
router.put('/:id', patientController.updatePatientController)

// PATCH /api/v1/patients/:id/active - อัปเดตสถานะการใช้งาน
router.patch('/:id/active', patientController.updatePatientActiveController)

export default router
