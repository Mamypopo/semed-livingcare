import { apiClient } from './api'

export const branchService = {
  // Get all branches
  async getAll(filters = {}) {
    const response = await apiClient.get('/branches', filters)
    return { data: response.data.data, meta: response.data.meta }
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

  // Update only active flag
  async updateActive(id, isActive) {
    const response = await apiClient.patch(`/branches/${id}/active`, { isActive })
    return response.data.data
  },

  // Get branch statistics
  async getStats() {
    const response = await apiClient.get('/branches/stats')
    return response.data.data
  },

  // Get latest branch code
  async getLatestCode() {
    const response = await apiClient.get('/branches/latest-code')
    return response.data.data.code
  },

  // Get branches accessible by user
  async getUserBranches() {
    const response = await apiClient.get('/branches/user-branches')
    return response.data.data
  },

  // Get all branches for dropdown 
  async getAllForDropdown(search = '', limit = 20) {
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (limit) params.append('limit', limit)
    
    const response = await apiClient.get(`/branches/dropdown?${params.toString()}`)
    return response.data.data
  }
}

