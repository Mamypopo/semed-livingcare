<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative">
    <!-- Background Pattern Component -->
    <BackgroundPattern />
    <div class="w-full max-w-md relative z-10">
      <!-- Logo Section -->
      <div v-if="activeTab === 'login'" class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-xl mb-6">
          <Heart class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-slate-800 mb-2">Semed Livingcare</h1>
        <p class="text-slate-600">ระบบคลินิค</p>
      </div>

      <!-- Auth Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8 ">
        <!-- Tab Navigation -->
        <div class="flex bg-gray-100 rounded-xl p-1 mb-8">
          <button
            @click="activeTab = 'login'"
            :class="[
              'flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200',
              activeTab === 'login' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            เข้าสู่ระบบ
          </button>
          <button
            @click="activeTab = 'register'"
            :class="[
              'flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200',
              activeTab === 'register' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            สมัครสมาชิก
          </button>
        </div>

        <!-- Login Form -->
        <div v-if="activeTab === 'login'" class="space-y-6">
          <form @submit.prevent="handleLogin" class="space-y-5">
            <!-- Email Field -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-900">Email</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail class="w-4 h-4 text-gray-500" />
                </div>
                <input
                  v-model="loginForm.email"
                  type="email"
                  placeholder="Enter your Email"
                  class="w-full pl-10 pr-3 py-3 text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:shadow-lg transition-all duration-200 h-12 bg-white hover:border-emerald-300 focus:outline-none"
                  :class="{ 'border-red-500': errors.email }"
                  required
                />
              </div>
              <p v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</p>
            </div>

            <!-- Password Field -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-900">Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock class="w-4 h-4 text-gray-500" />
                </div>
                <input
                  v-model="loginForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your Password"
                  class="w-full pl-10 pr-12 py-3 text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:shadow-lg transition-all duration-200 h-12 bg-white hover:border-emerald-300 focus:outline-none"
                  :class="{ 'border-red-500': errors.password }"
                  required
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Eye v-if="!showPassword" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
              <p v-if="errors.password" class="text-sm text-red-500">{{ errors.password }}</p>
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between">
              <label class="flex items-center cursor-pointer">
                <input
                  v-model="loginForm.rememberMe"
                  type="checkbox"
                  class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <span class="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <a href="#" class="text-blue-600 hover:text-blue-800 text-sm font-medium">Forgot password?</a>
            </div>

            <!-- Login Button -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-gray-800 text-white font-semibold py-3 rounded-xl hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 h-12 flex items-center justify-center"
              :class="{ 'opacity-70 cursor-not-allowed': isLoading }"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-if="!isLoading">Sign In</span>
              <span v-else>กำลังเข้าสู่ระบบ...</span>
            </button>
          </form>
        </div>

        <!-- Register Form -->
        <div v-if="activeTab === 'register'" class="space-y-6">
          <!-- Register Header -->
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-slate-800">สร้างบัญชีใหม่</h2>
          </div>

          <form @submit.prevent="handleRegister" class="space-y-5">
            <!-- Registration Code Field -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-900">Registration Code</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound  class="w-4 h-4 text-gray-500" />
                </div>
              <input
                v-model="registerForm.registrationCode"
                type="text"
                placeholder="Enter registration code"
                class="w-full pl-10 pr-12 py-3 text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:shadow-lg transition-all duration-200 h-12 bg-white hover:border-emerald-300 focus:outline-none"
                :class="{ 'border-red-500': errors.registrationCode }"
                required
              />
              <p v-if="errors.registrationCode" class="text-sm text-red-500">{{ errors.registrationCode }}</p>
            </div>
          </div>

            <!-- Name Field -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-900">Full Name</label>
              <input
                v-model="registerForm.name"
                type="text"
                placeholder="Enter your full name"
                class="w-full px-3 py-3 text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:shadow-lg transition-all duration-200 h-12 bg-white hover:border-emerald-300 focus:outline-none"
                :class="{ 'border-red-500': errors.name }"
                required
              />
              <p v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</p>
            </div>

            <!-- Email Field -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-900">Email</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail class="w-4 h-4 text-gray-500" />
                </div>
                <input
                  v-model="registerForm.email"
                  type="email"
                  placeholder="Enter your Email"
                  class="w-full pl-10 pr-3 py-3 text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:shadow-lg transition-all duration-200 h-12 bg-white hover:border-emerald-300 focus:outline-none"
                  :class="{ 'border-red-500': errors.email }"
                  required
                />
              </div>
              <p v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</p>
            </div>

            <!-- Password Field -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-900">Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock class="w-4 h-4 text-gray-500" />
                </div>
                <input
                  v-model="registerForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your Password"
                  class="w-full pl-10 pr-12 py-3 text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:shadow-lg transition-all duration-200 h-12 bg-white hover:border-emerald-300 focus:outline-none"
                  :class="{ 'border-red-500': errors.password }"
                  required
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Eye v-if="!showPassword" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
              <p v-if="errors.password" class="text-sm text-red-500">{{ errors.password }}</p>
            </div>

            <!-- Confirm Password Field -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-900">Confirm Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock class="w-4 h-4 text-gray-500" />
                </div>
                <input
                  v-model="registerForm.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Confirm your Password"
                  class="w-full pl-10 pr-12 py-3 text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:shadow-lg transition-all duration-200 h-12 bg-white hover:border-emerald-300 focus:outline-none"
                  :class="{ 'border-red-500': errors.confirmPassword }"
                  required
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Eye v-if="!showConfirmPassword" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
              <p v-if="errors.confirmPassword" class="text-sm text-red-500">{{ errors.confirmPassword }}</p>
            </div>

            <!-- Register Button -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-gray-800 text-white font-semibold py-3 rounded-xl hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 h-12 flex items-center justify-center"
              :class="{ 'opacity-70 cursor-not-allowed': isLoading }"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-if="!isLoading">Sign Up</span>
              <span v-else>กำลังสมัครสมาชิก...</span>
            </button>
          </form>
        </div>

        <!-- Account Creation Link -->
        <div v-if="activeTab === 'login'" class="text-center mt-6">
          <p class="text-gray-600">
            Don't have an account? 
            <a href="#" @click="activeTab = 'register'" class="text-blue-600 hover:text-blue-800 font-medium">Sign Up</a>
          </p>
        </div>

        <!-- Divider -->
        <div class="relative my-8">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or With</span>
          </div>
        </div>

        <!-- Google Login Button -->
        <button
          @click="handleGoogleLogin"
          class="w-full h-12 rounded-xl font-semibold transition-all duration-200 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-md flex items-center justify-center"
        >
          <!-- Google Icon (ของจริง) -->
          <svg class="w-5 h-5 mr-3" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#4285f4"
              d="M533.5 278.4c0-17.4-1.6-34-4.7-50.2H272v95h147.2c-6.3 34.1-25.3 62.9-54 82.1v68.2h87.2c51-47 81.1-116.2 81.1-195.1z"
            />
            <path
              fill="#34a853"
              d="M272 544.3c73.4 0 134.9-24.3 179.8-66.2l-87.2-68.2c-24.1 16.2-55 25.7-92.6 25.7-71 0-131-47.9-152.4-112.3H29v70.6c44.8 88.5 136.2 150.4 243 150.4z"
            />
            <path
              fill="#fbbc04"
              d="M119.6 323.3c-10.8-32.1-10.8-66.5 0-98.6v-70.6H29c-39.6 77.7-39.6 162.1 0 239.9l90.6-70.7z"
            />
            <path
              fill="#ea4335"
              d="M272 107.7c39.8-.6 77.8 14.3 106.6 41.8l79.4-79.4C417.5 24.2 345.4-2.4 272 0 165.2 0 73.8 61.9 29 150.4l90.6 70.6C141 155.6 201 107.7 272 107.7z"
            />
          </svg>
          Google
        </button>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <svg class="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-red-700">{{ errorMessage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BackgroundPattern from '@/components/BackgroundPattern.vue'
import { Heart, Mail, Lock, Eye, EyeOff,KeyRound } from 'lucide-vue-next'
import Swal from 'sweetalert2'

export default {
  name: 'Auth',
  components: {
    BackgroundPattern,
    Heart,
    Mail,
    Lock,
    Eye,
    EyeOff,
    KeyRound 
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    return {
      router,
      authStore
    }
  },
  data() {
    return {
      activeTab: 'login',
      loginForm: {
        email: '',
        password: '',
        rememberMe: false
      },
      registerForm: {
        registrationCode: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      showPassword: false,
      showConfirmPassword: false,
      isLoading: false,
      errorMessage: '',
      errors: {
        email: '',
        password: '',
        registrationCode: '',
        name: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    // Login validation
    validateLoginForm() {
      this.errors.email = ''
      this.errors.password = ''
      
      if (!this.loginForm.email) {
        this.errors.email = 'กรุณากรอกอีเมล'
        return false
      }
      
      if (!this.loginForm.password) {
        this.errors.password = 'กรุณากรอกรหัสผ่าน'
        return false
      }
      
      return true
    },

    // Register validation
    validateRegisterForm() {
      Object.keys(this.errors).forEach(key => this.errors[key] = '')
      
      if (!this.registerForm.registrationCode) {
        this.errors.registrationCode = 'กรุณากรอกรหัสสมัครสมาชิก'
        return false
      }
      
      if (!this.registerForm.name) {
        this.errors.name = 'กรุณากรอกชื่อ-นามสกุล'
        return false
      }
      
      if (!this.registerForm.email) {
        this.errors.email = 'กรุณากรอกอีเมล'
        return false
      }
      
      if (!this.registerForm.password) {
        this.errors.password = 'กรุณากรอกรหัสผ่าน'
        return false
      }
      
      if (this.registerForm.password.length < 6) {
        this.errors.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
        return false
      }
      
      if (!this.registerForm.confirmPassword) {
        this.errors.confirmPassword = 'กรุณายืนยันรหัสผ่าน'
        return false
      }
      
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        this.errors.confirmPassword = 'รหัสผ่านไม่ตรงกัน'
        return false
      }
      
      return true
    },

    // Handle login
    async handleLogin() {
      if (!this.validateLoginForm()) return
      
      this.isLoading = true
      this.errorMessage = ''
      
      try {
        await this.authStore.login(this.loginForm)
        
        // Success alert
        await Swal.fire({
          icon: 'success',
          title: 'เข้าสู่ระบบสำเร็จ!',
          text: 'ยินดีต้อนรับสู่ระบบ SEMed Livingcare',
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        })
        
        this.router.push('/lobby')
      } catch (error) {
        // Error alert
        await Swal.fire({
          icon: 'error',
          title: 'เข้าสู่ระบบไม่สำเร็จ',
          text: error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ',
          confirmButtonText: 'ลองใหม่'
        })
      } finally {
        this.isLoading = false
      }
    },

    // Handle register
    async handleRegister() {
      if (!this.validateRegisterForm()) return
      
      this.isLoading = true
      this.errorMessage = ''
      
      try {
        await this.authStore.register(this.registerForm)
        
        // Success alert
        await Swal.fire({
          icon: 'success',
          title: 'สมัครสมาชิกสำเร็จ!',
          text: 'กรุณาเข้าสู่ระบบด้วยอีเมลและรหัสผ่านที่สมัครไว้',
          confirmButtonText: 'เข้าสู่ระบบ',
          showCancelButton: true,
          cancelButtonText: 'ปิด'
        }).then((result) => {
          if (result.isConfirmed) {
            this.activeTab = 'login'
            // Clear register form
            this.registerForm = {
              registrationCode: '',
              name: '',
              email: '',
              password: '',
              confirmPassword: ''
            }
          }
        })
        
      } catch (error) {
        // Error alert
        await Swal.fire({
          icon: 'error',
          title: 'สมัครสมาชิกไม่สำเร็จ',
          text: error.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก',
          confirmButtonText: 'ลองใหม่'
        })
      } finally {
        this.isLoading = false
      }
    },

    // Handle Google login (mock)
    async handleGoogleLogin() {
      await Swal.fire({
        icon: 'info',
        title: 'Google Login',
        text: 'ฟีเจอร์นี้กำลังพัฒนา กรุณาใช้การเข้าสู่ระบบปกติ',
        confirmButtonText: 'เข้าใจแล้ว'
      })
    }
  }
}
</script>

