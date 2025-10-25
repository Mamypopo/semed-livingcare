import { apiClient } from './api.js'

const opdService = {
  /**
   * ดึงข้อมูลคิวพร้อมข้อมูลผู้ป่วยสำหรับหน้า OPD Management
   * @param {string} queueId - ID ของคิว
   * @returns {Promise<object>} ข้อมูลคิวพร้อมข้อมูลผู้ป่วย
   */
  async getQueueForOPDManagement(queueId) {
    try {
      const response = await apiClient.get(`/opd/queue/${queueId}`)
      return response.data
    } catch (error) {
      console.error('Error getting queue for OPD management:', error)
      throw error
    }
  }
}

export default opdService
