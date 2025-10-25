import { apiClient } from './api.js'

const departmentService = {
  // Get all departments
  async getAll(params = {}) {
    const queryParams = new URLSearchParams()

    if (params.search) queryParams.append('search', params.search)
    if (params.page) queryParams.append('page', params.page)
    if (params.pageSize) queryParams.append('pageSize', params.pageSize)
    if (params.sort) queryParams.append('sort', params.sort)
    if (params.order) queryParams.append('order', params.order)
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive)

    const response = await apiClient.get(`/departments?${queryParams.toString()}`)
    return response.data
  },

  // Get department by ID
  async getById(id) {
    const response = await apiClient.get(`/departments/${id}`)
    return response.data
  },

  // Create new department
  async create(data) {
    const response = await apiClient.post('/departments', data)
    return response.data
  },

  // Update department
  async update(id, data) {
    const response = await apiClient.put(`/departments/${id}`, data)
    return response.data
  },

  // Update department active status
  async updateActive(id, isActive) {
    const response = await apiClient.patch(`/departments/${id}/active`, { isActive })
    return response.data
  },

  // Get all departments for dropdown
  async getAllForDropdown(search = '', limit = 20) {
    const queryParams = new URLSearchParams()
    if (search) queryParams.append('search', search)
    if (limit) queryParams.append('limit', limit)

    const response = await apiClient.get(`/departments/dropdown?${queryParams.toString()}`)
    return response.data
  }
}

export default departmentService
