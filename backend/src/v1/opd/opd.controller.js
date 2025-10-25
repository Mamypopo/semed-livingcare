import * as opdService from './opd.service.js'

/**
 * ดึงข้อมูลคิวสำหรับหน้า OPD Management
 * @route GET /api/v1/opd/queue/:queueId
 * @access Private
 */
export const getQueueForOPDManagementController = async (req, res) => {
  try {
    const { queueId } = req.params
    
    const data = await opdService.getQueueForOPDManagement(queueId)
    
    res.json({
      success: true,
      data: data
    })
  } catch (error) {
    console.error('❌ Get Queue for OPD Management Controller Error:', error.message)
    res.status(500).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลคิว'
    })
  }
}
