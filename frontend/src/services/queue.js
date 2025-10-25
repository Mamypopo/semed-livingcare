import { apiClient } from './api.js'

const queueService = {
  // ดึงข้อมูลคิวทั้งหมด
  async getAllQueues(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      // Add parameters to query string
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          queryParams.append(key, params[key])
        }
      })
      
      const response = await apiClient.get(`/queues?${queryParams.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error getting all queues:', error)
      throw error
    }
  },

  // ดึงข้อมูลคิวตาม ID
  async getQueueById(id) {
    try {
      const response = await apiClient.get(`/queues/${id}`)
      return response.data
    } catch (error) {
      console.error('Error getting queue by ID:', error)
      throw error
    }
  },

  // ยกเลิกคิว
  async cancelQueue(id, reason) {
    try {
      const response = await apiClient.patch(`/queues/${id}/cancel`, { reason })
      return response.data
    } catch (error) {
      console.error('Error cancelling queue:', error)
      throw error
    }
  }
}

export default queueService
