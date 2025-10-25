import { apiClient } from './api.js'

/**
 * สร้างการลงทะเบียนพร้อมคิวในครั้งเดียว
 * @param {object} data - ข้อมูลการลงทะเบียนและคิว
 * @returns {Promise<object>} ข้อมูล Registration และ Queue ที่สร้างขึ้น
 */
export const createRegistrationWithQueue = async (data) => {
  try {
    const response = await apiClient.post('/registrations/with-queue', data)
    return response.data
  } catch (error) {
    console.error('Error creating registration with queue:', error)
    throw error
  }
}
