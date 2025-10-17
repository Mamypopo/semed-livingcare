import { apiClient } from './api'

export const userService = {
  // Get all users
  async getAll(filters = {}) {
    const response = await apiClient.get('/users', filters)
    return { data: response.data.data, meta: response.data.meta }
  },

  // Get user by ID
  async getById(id) {
    const response = await apiClient.get(`/users/${id}`)
    return response.data.data
  },

  // Create user
  async create(userData) {
    const response = await apiClient.post('/users', userData)
    return response.data.data
  },

  // Update user
  async update(id, userData) {
    const response = await apiClient.put(`/users/${id}`, userData)
    return response.data.data
  },

  // Update only active flag
  async updateActive(id, isActive) {
    const response = await apiClient.patch(`/users/${id}/active`, { isActive })
    return response.data.data
  },

  // Update user password
  async updatePassword(id, password) {
    const response = await apiClient.patch(`/users/${id}/password`, { password })
    return response.data.data
  },

  // Get user statistics
  async getStats() {
    const response = await apiClient.get('/users/stats')
    return response.data.data
  },
}
