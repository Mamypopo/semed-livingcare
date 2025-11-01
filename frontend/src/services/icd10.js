import { apiClient } from './api'

export default {
  /**
   * ค้นหา ICD10 (สำหรับ dropdown/search)
   */
  search(params) {
    return apiClient.get('/icd10/search', params)
  },

  /**
   * ดึงรายการ ICD10 ทั้งหมด (พร้อม pagination และ filter)
   */
  list(params) {
    return apiClient.get('/icd10', params)
  },

  /**
   * ดึงรายการ ICD10 ตาม ID
   */
  getById(id) {
    return apiClient.get(`/icd10/${id}`)
  },

  /**
   * สร้างรายการ ICD10 ใหม่
   */
  create(data) {
    return apiClient.post('/icd10', data)
  },

  /**
   * อัพเดทรายการ ICD10
   */
  update(id, data) {
    return apiClient.put(`/icd10/${id}`, data)
  },

  /**
   * เปิด/ปิดใช้งานรายการ ICD10
   */
  toggleActive(id) {
    return apiClient.patch(`/icd10/${id}/toggle-active`)
  },

  /**
   * ลบรายการ ICD10
   */
  remove(id) {
    return apiClient.delete(`/icd10/${id}`)
  }
}


