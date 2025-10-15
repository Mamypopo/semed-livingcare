import { apiClient } from './api.js'

export default {
  // Get all insurance types with pagination and filters
  async getAll(params = {}) {
    const queryParams = new URLSearchParams()
    
    // Add pagination
    if (params.page) queryParams.append('page', params.page)
    if (params.pageSize) queryParams.append('pageSize', params.pageSize)
    
    // Add filters
    if (params.search) queryParams.append('search', params.search)
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive)
    
    // Add sorting
    if (params.sort) queryParams.append('sort', params.sort)
    if (params.order) queryParams.append('order', params.order)
    
    const response = await apiClient.get(`/insurance-types?${queryParams.toString()}`)
    return response.data
  },

  // Get insurance type by ID
  async getById(id) {
    const response = await apiClient.get(`/insurance-types/${id}`)
    return response.data
  },

  // Create new insurance type
  async create(data) {
    const response = await apiClient.post('/insurance-types', data)
    return response.data
  },

  // Update insurance type
  async update(id, data) {
    const response = await apiClient.put(`/insurance-types/${id}`, data)
    return response.data
  },

  // Update insurance type active status
  async updateActive(id, isActive) {
    const response = await apiClient.patch(`/insurance-types/${id}/active`, { isActive })
    return response.data
  },

  // Get insurance type statistics
  async getStats() {
    const response = await apiClient.get('/insurance-types/stats')
    return response.data
  }
}