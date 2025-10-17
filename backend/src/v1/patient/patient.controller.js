import * as patientService from './patient.service.js'
// ดึงข้อมูลผู้ป่วยทั้งหมด
export const getAllPatientsController = async (req, res) => {
    try {
      const params = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        search: req.query.search || '',
        status: req.query.status || 'all',
        branchId: req.query.branchId || null,
        patientGroupId: req.query.patientGroupId || null,
        insuranceTypeId: req.query.insuranceTypeId || null,
        tagIds: req.query.tagIds ? req.query.tagIds.split(',').filter(id => id) : []
      }

      const result = await patientService.getAllPatients(params)
      
      res.json({
        success: true,
        data: result.patients,
        pagination: result.pagination
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ป่วย'
      })
    }
}

// ดึงข้อมูลผู้ป่วยตาม ID
export const getPatientByIdController = async (req, res) => {
    try {
      const { id } = req.params
      const patient = await patientService.getPatientById(id)
      
      res.json({
        success: true,
        data: patient
      })
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message || 'ไม่พบข้อมูลผู้ป่วย'
      })
    }
}

// สร้างผู้ป่วยใหม่
export const createPatientController = async (req, res) => {
    try {
      console.log('📥 Controller รับข้อมูลจาก Frontend:')
      console.log('Request body:', req.body)
      console.log('User ID:', req.user?.id)
      
      const patient = await patientService.createPatient(req.body, req.user?.id)
      
      console.log('✅ สร้าง Patient สำเร็จ:', patient.hn)
      
      res.status(201).json({
        success: true,
        message: 'สร้างข้อมูลผู้ป่วยสำเร็จ',
        data: patient
      })
    } catch (error) {
      console.error('❌ Controller Error:', error.message)
      res.status(400).json({
        success: false,
        message: error.message || 'เกิดข้อผิดพลาดในการสร้างข้อมูลผู้ป่วย'
      })
    }
}

// อัปเดตข้อมูลผู้ป่วย
export const updatePatientController = async (req, res) => {
    try {
      const { id } = req.params
      const patient = await patientService.updatePatient(id, req.body, req.user?.id)
      
      res.json({
        success: true,
        message: 'อัปเดตข้อมูลผู้ป่วยสำเร็จ',
        data: patient
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ป่วย'
      })
    }
}

// อัปเดตสถานะการใช้งาน
export const updatePatientActiveController = async (req, res) => {
    try {
      const { id } = req.params
      const { isActive } = req.body
      
      const patient = await patientService.updatePatientActive(id, isActive, req.user?.id)
      
      res.json({
        success: true,
        message: `อัปเดตสถานะการใช้งาน${isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}สำเร็จ`,
        data: patient
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'เกิดข้อผิดพลาดในการอัปเดตสถานะการใช้งาน'
      })
    }
}

// ดึงสถิติผู้ป่วย
export const getPatientStatsController = async (req, res) => {
    try {
      const stats = await patientService.getPatientStats()
      
      res.json({
        success: true,
        data: stats
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'เกิดข้อผิดพลาดในการดึงสถิติผู้ป่วย'
      })
    }
}
