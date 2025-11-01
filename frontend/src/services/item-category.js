import { apiClient } from '@/services/api'

export default {
  async list(params = {}) {
    const { data } = await apiClient.get('/item-categories', params)
    return { data: data?.data || [], pagination: data?.pagination || {} }
  },
  async getForDropdown(params = {}) {
    const { data } = await apiClient.get('/item-categories/dropdown', params)
    return data?.data || []
  },
  async getById(id) {
    const { data } = await apiClient.get(`/item-categories/${id}`)
    return data?.data
  },
  async create(payload) {
    const { data } = await apiClient.post('/item-categories', payload)
    return data?.data
  },
  async update(id, payload) {
    const { data } = await apiClient.put(`/item-categories/${id}`, payload)
    return data?.data
  },
  async toggleActive(id) {
    const { data } = await apiClient.patch(`/item-categories/${id}/toggle-active`)
    return data?.data
  },
  async remove(id) {
    const { data } = await apiClient.delete(`/item-categories/${id}`)
    return data?.data
  }
}

