import { apiClient } from './api'

export const branchService = {
  // Get all branches
  async getAll(filters = {}) {
    const response = await apiClient.get('/branches', filters)
    return response.data.data
  },

  // Get branch by ID
  async getById(id) {
    const response = await apiClient.get(`/branches/${id}`)
    return response.data.data
  },

  // Create branch
  async create(branchData) {
    const response = await apiClient.post('/branches', branchData)
    return response.data.data
  },

  // Update branch
  async update(id, branchData) {
    const response = await apiClient.put(`/branches/${id}`, branchData)
    return response.data.data
  },

  // Delete branch
  async delete(id) {
    const response = await apiClient.delete(`/branches/${id}`)
    return response.data.data
  },

  // Get branch statistics
  async getStats() {
    const response = await apiClient.get('/branches/stats')
    return response.data.data
  }
}

