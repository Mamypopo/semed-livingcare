import { apiClient } from '@/services/api'

export default {
  /**
   * ดึงรายการตรวจทั้งหมดของ Visit
   */
  async list(visitId) {
    const { data } = await apiClient.get(`/visit-items/${visitId}/items`)
    return data?.data || []
  },

  /**
   * เพิ่มรายการตรวจ (ไม่ใช่ PACKAGE) เข้า Visit
   */
  async create(visitId, payload) {
    const { data } = await apiClient.post(`/visit-items/${visitId}/items`, payload)
    return data?.data
  },

  /**
   * เพิ่มแพ็คเกจเข้า Visit (จะขยายเป็นรายการย่อยทั้งหมด)
   */
  async addPackage(visitId, payload) {
    const { data } = await apiClient.post(`/visit-items/${visitId}/items/package`, payload)
    return data?.data || []
  },

  /**
   * แก้ไขรายการตรวจใน Visit
   */
  async update(visitItemId, payload) {
    const { data } = await apiClient.put(`/visit-items/${visitItemId}`, payload)
    return data?.data
  },

  /**
   * ลบรายการตรวจออกจาก Visit
   */
  async remove(visitItemId) {
    const { data } = await apiClient.delete(`/visit-items/${visitItemId}`)
    return data?.data || data
  }
}

