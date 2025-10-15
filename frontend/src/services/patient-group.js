import { apiClient } from './api.js'

const patientGroupService = {
  // Get all patient groups
  async getAll(params = {}) {
    const queryParams = new URLSearchParams()
    
    if (params.search) queryParams.append('search', params.search)
    if (params.page) queryParams.append('page', params.page)
    if (params.pageSize) queryParams.append('pageSize', params.pageSize)
    if (params.sort) queryParams.append('sort', params.sort)
    if (params.order) queryParams.append('order', params.order)
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive)
    
    const response = await apiClient.get(`/patient-groups?${queryParams.toString()}`)
    return response.data
  },

  // Get patient group by ID
  async getById(id) {
    const response = await apiClient.get(`/patient-groups/${id}`)
    return response.data
  },

  // Create new patient group
  async create(data) {
    const response = await apiClient.post('/patient-groups', data)
    return response.data
  },

  // Update patient group
  async update(id, data) {
    const response = await apiClient.put(`/patient-groups/${id}`, data)
    return response.data
  },

  // Update patient group active status
  async updateActive(id, isActive) {
    const response = await apiClient.patch(`/patient-groups/${id}/active`, { isActive })
    return response.data
  },

  // Get patient group statistics
  async getStats() {
    const response = await apiClient.get('/patient-groups/stats')
    return response.data
  }
}

export default patientGroupService
