import { api } from './api'

export const authService = {
  // Login user
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
    }
  },

  // Register user
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก')
    }
  },

  // Get user profile
  async getProfile() {
    try {
      const response = await api.get('/auth/me')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ไม่สามารถดึงข้อมูลผู้ใช้ได้')
    }
  },
}
