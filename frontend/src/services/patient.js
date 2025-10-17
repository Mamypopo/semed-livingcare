import { apiClient } from './api.js'

const patientService = {
  // ดึงข้อมูลผู้ป่วยทั้งหมด
  async getAllPatients(params = {}) {
    const response = await apiClient.get('/patients', { params })
    return response.data
  },

  // ดึงข้อมูลผู้ป่วยตาม ID
  async getPatientById(id) {
    const response = await apiClient.get(`/patients/${id}`)
    return response.data
  },

  // สร้างผู้ป่วยใหม่
  async createPatient(data) {
    const response = await apiClient.post('/patients', data)
    return response.data
  },

  // อัปเดตข้อมูลผู้ป่วย
  async updatePatient(id, data) {
    const response = await apiClient.put(`/patients/${id}`, data)
    return response.data
  },

  // อัปเดตสถานะการใช้งาน
  async updatePatientActive(id, isActive) {
    const response = await apiClient.patch(`/patients/${id}/active`, { isActive })
    return response.data
  },

  // ดึงสถิติผู้ป่วย
  async getPatientStats() {
    const response = await apiClient.get('/patients/stats')
    return response.data
  }
}

export default patientService
