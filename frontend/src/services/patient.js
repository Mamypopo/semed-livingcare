import { apiClient } from './api.js'

const patientService = {
  // ดึงข้อมูลผู้ป่วยทั้งหมด
  async getAllPatients(params = {}) {
    // สร้าง query string โดยตรง
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.search) queryParams.append('search', params.search)
    if (params.status) queryParams.append('status', params.status)
    if (params.branchId) queryParams.append('branchId', params.branchId)
    if (params.patientGroupId) queryParams.append('patientGroupId', params.patientGroupId)
    if (params.insuranceTypeId) queryParams.append('insuranceTypeId', params.insuranceTypeId)
    if (params.tagIds && params.tagIds.length > 0) queryParams.append('tagIds', params.tagIds.join(','))
    
    const response = await apiClient.get(`/patients?${queryParams.toString()}`)
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
  },

  // ค้นหาผู้ป่วยสำหรับ dropdown
  async searchForDropdown(searchQuery, branchId, limit = 10) {
    const queryParams = new URLSearchParams()
    if (searchQuery) queryParams.append('search', searchQuery)
    if (branchId) queryParams.append('branchId', branchId)
    if (limit) queryParams.append('limit', limit)
    
    const response = await apiClient.get(`/patients/search/dropdown?${queryParams.toString()}`)
    return response.data
  }
}

export default patientService
