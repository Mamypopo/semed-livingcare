import * as registrationService from './registration.service.js'

/**
 * สร้างการลงทะเบียนใหม่
 */
export const createRegistrationController = async (req, res) => {
  try {
    const registration = await registrationService.createRegistration(req.body, req.user?.id)
    
    res.status(201).json({
      success: true,
      message: 'สร้างการลงทะเบียนสำเร็จ',
      data: registration
    })
  } catch (error) {
    console.error('❌ Create Registration Controller Error:', error.message)
    res.status(400).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการสร้างการลงทะเบียน'
    })
  }
}

/**
 * ดึงข้อมูลการลงทะเบียนทั้งหมด
 */
export const getAllRegistrationsController = async (req, res) => {
  try {
    const params = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      search: req.query.search || '',
      status: req.query.status || 'all',
      branchId: req.query.branchId || null,
      departmentId: req.query.departmentId || null,
      doctorId: req.query.doctorId || null,
      dateFrom: req.query.dateFrom || null,
      dateTo: req.query.dateTo || null,
      sort: req.query.sort || 'createdAt',
      order: req.query.order || 'desc'
    }

    const result = await registrationService.getAllRegistrations(params)
    
    res.json({
      success: true,
      data: result.registrations,
      pagination: result.pagination
    })
  } catch (error) {
    console.error('❌ Get All Registrations Controller Error:', error.message)
    res.status(500).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลการลงทะเบียน'
    })
  }
}

/**
 * ดึงข้อมูลการลงทะเบียนตาม ID
 */
export const getRegistrationByIdController = async (req, res) => {
  try {
    const { id } = req.params
    const registration = await registrationService.getRegistrationById(id)
    
    res.json({
      success: true,
      data: registration
    })
  } catch (error) {
    console.error('❌ Get Registration By ID Controller Error:', error.message)
    res.status(404).json({
      success: false,
      message: error.message || 'ไม่พบข้อมูลการลงทะเบียน'
    })
  }
}

/**
 * ยกเลิกการลงทะเบียน
 */
export const cancelRegistrationController = async (req, res) => {
  try {
    const { id } = req.params
    const { reason } = req.body
    const registration = await registrationService.cancelRegistration(id, req.user?.id, reason)
    
    res.json({
      success: true,
      message: 'ยกเลิกการลงทะเบียนสำเร็จ',
      data: registration
    })
  } catch (error) {
    console.error('❌ Cancel Registration Controller Error:', error.message)
    res.status(400).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการยกเลิกการลงทะเบียน'
    })
  }
}

