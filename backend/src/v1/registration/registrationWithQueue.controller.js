import { createRegistrationWithQueue } from './registrationWithQueue.service.js'

/**
 * สร้าง Registration พร้อม Queue ในครั้งเดียว
 */
export const createRegistrationWithQueueController = async (req, res) => {
  try {
    const result = await createRegistrationWithQueue(req.body, req.user?.id)
    
    res.status(201).json({
      success: true,
      message: 'สร้างการลงทะเบียนและคิวสำเร็จ',
      data: {
        registration: result.registration,
        queue: result.queue
      }
    })
  } catch (error) {
    console.error('Create registration with queue error:', error)
    res.status(400).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการสร้างการลงทะเบียนและคิว'
    })
  }
}
