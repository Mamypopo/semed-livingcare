import * as queueService from './queue.service.js'
import { createQueueLog } from '../utils/queueLogger.js'

/**
 * สร้างคิวใหม่
 */
export const createQueueController = async (req, res) => {
  try {
    const queue = await queueService.createQueue(req.body, req.user?.id)
    
    // บันทึก log การสร้างคิว
    await createQueueLog({
      queueId: queue.id,
      action: 'CREATE',
      details: {
        queueNumber: queue.queueNumber,
        queueType: queue.queueType,
        status: queue.status,
        patientName: `${queue.registration.patient.first_name} ${queue.registration.patient.last_name}`,
        patientHN: queue.registration.patient.hn,
        doctorName: queue.registration.doctor.name,
        departmentName: queue.registration.department.name
      },
      userId: req.user?.id,
      branchId: queue.branchId,
      queueNumber: queue.queueNumber,
      hn: queue.registration.patient.hn
    })
    
    res.status(201).json({
      success: true,
      message: 'สร้างคิวสำเร็จ',
      data: queue
    })
  } catch (error) {
    console.error('❌ Create Queue Controller Error:', error.message)
    res.status(400).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการสร้างคิว'
    })
  }
}

/**
 * ดึงข้อมูลคิวทั้งหมด
 */
export const getAllQueuesController = async (req, res) => {
  try {
    const params = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      search: req.query.search || '',
      status: req.query.status || 'all',
      queueType: req.query.queueType || 'all',
      branchId: req.query.branchId || null,
      departmentId: req.query.departmentId || null,
      doctorId: req.query.doctorId || null,
      dateFrom: req.query.dateFrom || null,
      dateTo: req.query.dateTo || null,
      sort: req.query.sort || 'createdAt',
      order: req.query.order || 'desc'
    }

    const result = await queueService.getAllQueues(params)
    
    res.json({
      success: true,
      data: result.queues,
      pagination: result.pagination
    })
  } catch (error) {
    console.error('❌ Get All Queues Controller Error:', error.message)
    res.status(500).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลคิว'
    })
  }
}

/**
 * ดึงข้อมูลคิวตาม ID
 */
export const getQueueByIdController = async (req, res) => {
  try {
    const { id } = req.params
    const queue = await queueService.getQueueById(id)
    
    res.json({
      success: true,
      data: queue
    })
  } catch (error) {
    console.error('❌ Get Queue By ID Controller Error:', error.message)
    res.status(404).json({
      success: false,
      message: error.message || 'ไม่พบข้อมูลคิว'
    })
  }
}

/**
 * ยกเลิกคิว
 */
export const cancelQueueController = async (req, res) => {
  try {
    const { id } = req.params
    const { reason } = req.body
    
    // ดึงข้อมูลคิวเดิมก่อนยกเลิก
    const oldQueue = await queueService.getQueueById(id)
    
    const queue = await queueService.cancelQueue(id, req.user?.id, reason)
    
    // บันทึก log การยกเลิกคิว
    await createQueueLog({
      queueId: queue.id,
      action: 'CANCEL',
      details: {
        queueNumber: queue.queueNumber,
        queueType: queue.queueType,
        changes: {
          before: { status: oldQueue.status },
          after: { status: queue.status }
        },
        patientName: `${queue.registration.patient.first_name} ${queue.registration.patient.last_name}`,
        patientHN: queue.registration.patient.hn,
        doctorName: queue.registration.doctor.name,
        departmentName: queue.registration.department.name
      },
      reason: reason,
      userId: req.user?.id,
      branchId: queue.branchId,
      queueNumber: queue.queueNumber,
      hn: queue.registration.patient.hn
    })
    
    res.json({
      success: true,
      message: 'ยกเลิกคิวสำเร็จ',
      data: queue
    })
  } catch (error) {
    console.error('❌ Cancel Queue Controller Error:', error.message)
    res.status(400).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการยกเลิกคิว'
    })
  }
}

