import { defineStore } from 'pinia'
import { authService } from '@/services/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    selectedBranch: JSON.parse(localStorage.getItem('selectedBranch')) || null,
    isLoading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role || 'GUEST',
    userName: (state) => state.user?.name || '',
    userEmail: (state) => state.user?.email || '',
    currentBranch: (state) => state.selectedBranch,
    hasBranch: (state) => !!state.user?.branchId,
    needsBranchAssignment: (state) => state.user?.role === 'GUEST' && !state.user?.branchId
  },

  actions: {
    // Login
    async login(credentials) {
      this.isLoading = true
      this.error = null

      try {
        const response = await authService.login(credentials)
        
        if (response.success) {
          this.token = response.data.token
          this.user = response.data.user
          
          // Store token in localStorage
          localStorage.setItem('token', this.token)
          
          // Store remember me
          if (credentials.rememberMe) {
            localStorage.setItem('rememberMe', 'true')
          }
        } else {
          throw new Error(response.message || 'เข้าสู่ระบบไม่สำเร็จ')
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Register
    async register(userData) {
      this.isLoading = true
      this.error = null

      try {
        const response = await authService.register(userData)
        
        if (!response.success) {
          throw new Error(response.message || 'สมัครสมาชิกไม่สำเร็จ')
        }
        
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Get user profile
    async getProfile() {
      if (!this.token) return

      this.isLoading = true
      this.error = null

      try {
        const response = await authService.getProfile()
        
        if (response.success) {
          this.user = response.data.user
        } else {
          throw new Error(response.message || 'ไม่สามารถดึงข้อมูลผู้ใช้ได้')
        }
      } catch (error) {
        this.error = error.message
        // If token is invalid, logout
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          this.logout()
        }
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Set selected branch
    setSelectedBranch(branch) {
      this.selectedBranch = branch
      localStorage.setItem('selectedBranch', JSON.stringify(branch))
    },

    // Logout
    logout() {
      this.user = null
      this.token = null
      this.selectedBranch = null
      this.error = null
      
      // Clear localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('rememberMe')
      localStorage.removeItem('selectedBranch')
    },

    // Check if user is remembered
    isRemembered() {
      return localStorage.getItem('rememberMe') === 'true'
    },

    // Initialize auth state
    async initializeAuth() {
      if (this.token) {
        try {
          await this.getProfile()
        } catch (error) {
          console.error('Failed to initialize auth:', error)
          this.logout()
        }
      }
    }
  }
})
