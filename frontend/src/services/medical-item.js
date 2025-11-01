import { apiClient } from '@/services/api'

export default {
  async list(params = {}) {
    const { data } = await apiClient.get('/medical-items', params)
    return { data: data?.data || [], pagination: data?.pagination || {} }
  },
  async getById(id) {
    const { data } = await apiClient.get(`/medical-items/${id}`)
    return data?.data
  },
  async create(payload) {
    const { data } = await apiClient.post('/medical-items', payload)
    return data?.data
  },
  async update(id, payload) {
    const { data } = await apiClient.put(`/medical-items/${id}`, payload)
    return data?.data
  },
  async toggleActive(id) {
    const { data } = await apiClient.patch(`/medical-items/${id}/toggle-active`)
    return data?.data
  },

  async searchSingleItems(search = '', limit = 20) {
    const { data } = await apiClient.get('/medical-items/search', { search, limit })
    return data?.data || []
  },
  /**
   * ค้นหารายการตรวจสำหรับ Visit (รวมทั้ง SINGLE items และ PACKAGE)
   */
  async searchForVisit(search = '', limit = 20) {
    const { data } = await apiClient.get('/medical-items/search-for-visit', { search, limit })
    return data?.data || []
  },
  /**
   * ดึงรายการตรวจที่สามารถเพิ่มเข้าแพ็คเกจได้ (GENERAL, LAB, XRAY - ไม่ใช่ PACKAGE)
   */
  async getForPackage(params = {}) {
    const { data } = await apiClient.get('/medical-items/for-package', params)
    return data?.data || []
  },
  /**
   * ดึงรายการย่อย (components) ของแพ็คเกจ
   */
  async getComponents(parentItemId) {
    const { data } = await apiClient.get(`/medical-items/${parentItemId}/components`)
    return data?.data || []
  },
  /**
   * เพิ่มรายการย่อยหลายรายการเข้าแพ็คเกจพร้อมกัน (bulk)
   */
  async addComponents(parentItemId, items = []) {
    const { data } = await apiClient.post(`/medical-items/${parentItemId}/components/bulk`, {
      items
    })
    return data?.data || []
  },
  /**
   * ลบรายการย่อยหลายรายการออกจากแพ็คเกจพร้อมกัน (bulk)
   */
  async removeComponents(parentItemId, componentIds = []) {
    const { data } = await apiClient.delete(`/medical-items/${parentItemId}/components/bulk`, {
      data: { componentIds }
    })
    return data?.data || data
  }
}


