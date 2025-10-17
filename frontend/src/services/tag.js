import { apiClient } from './api.js'

export default {
  // Get all tags with pagination and filters
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

    const response = await apiClient.get(`/tags?${queryParams.toString()}`)
    return response.data
  },

  // Get tag by ID
  async getById(id) {
    const response = await apiClient.get(`/tags/${id}`)
    return response.data
  },

  // Create new tag
  async create(data) {
    const response = await apiClient.post('/tags', data)
    return response.data
  },

  // Update tag
  async update(id, data) {
    const response = await apiClient.put(`/tags/${id}`, data)
    return response.data
  },

  // Update tag active status
  async updateActive(id, isActive) {
    const response = await apiClient.patch(`/tags/${id}/active`, { isActive })
    return response.data
  },

  // Get tag statistics
  async getStats() {
    const response = await apiClient.get('/tags/stats')
    return response.data
  },

  // Get all tags for dropdown
  async getAllForDropdown(search = '', limit = 20) {
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (limit) params.append('limit', limit)

    const response = await apiClient.get(`/tags/dropdown?${params.toString()}`)
    return response.data.data
  },
}
