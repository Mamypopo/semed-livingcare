import { apiClient } from './api'

export const authService = {
  // Login
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials)
    
    if (response.data.success && response.data.data) {
      // Store token and user data
      localStorage.setItem('token', response.data.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.data.user))
    }
    
    return response.data.data
  },

  // Register
  async register(userData) {
    const response = await apiClient.post('/auth/register', userData)
    return response.data.data
  },

  // Get current user profile
  async getProfile() {
    const response = await apiClient.get('/auth/me')
    return response.data.data
  },

  // Logout
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token')
  },

  // Get stored user data
  getStoredUser() {
    const userData = localStorage.getItem('user')
    return userData ? JSON.parse(userData) : null
  },

  // Get stored token
  getToken() {
    return localStorage.getItem('token')
  }
}

