<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/50 to-teal-50/50">
    <!-- Modern Mesh Gradient Background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Mesh gradient overlay -->
      <div class="absolute inset-0 opacity-30" style="background: 
        radial-gradient(at 0% 0%, rgba(52, 211, 153, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(45, 212, 191, 0.12) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(52, 211, 153, 0.1) 0px, transparent 50%),
        radial-gradient(at 0% 100%, rgba(45, 212, 191, 0.15) 0px, transparent 50%);
      "></div>
      
      <!-- Animated Blob Shapes (2024-2025 Trend) -->
      <div class="absolute top-0 left-0 w-full h-full">
        <div class="absolute top-10 left-10 w-96 h-96 bg-emerald-400/25 rounded-full blur-3xl animate-blob-morph"></div>
        <div class="absolute bottom-10 right-10 w-[500px] h-[500px] bg-teal-400/25 rounded-full blur-3xl animate-blob-morph-delay"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-300/20 rounded-full blur-3xl animate-blob-morph-slow"></div>
      </div>

      <!-- Animated Geometric Shapes -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-15">
        <!-- Floating circles -->
        <div class="absolute top-20 left-20 w-32 h-32 border-2 border-emerald-400/30 rounded-full animate-rotate-slow"></div>
        <div class="absolute bottom-32 right-24 w-24 h-24 border-2 border-teal-400/30 rounded-full animate-rotate-reverse"></div>
        <div class="absolute top-1/3 right-1/4 w-20 h-20 border-2 border-emerald-300/40 rounded-full animate-rotate-slow delay-rotate"></div>
        
        <!-- Hexagons -->
        <div class="absolute top-32 right-32 w-16 h-16 opacity-20 animate-rotate-slow hexagon" style="clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); background: rgba(52, 211, 153, 0.2);"></div>
        <div class="absolute bottom-40 left-1/4 w-12 h-12 opacity-15 animate-rotate-reverse hexagon" style="clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); background: rgba(45, 212, 191, 0.2);"></div>
      </div>

      <!-- Particle Grid (Modern dot pattern) -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute inset-0" style="
          background-image: 
            radial-gradient(circle, rgba(52, 211, 153, 0.3) 1px, transparent 1px),
            radial-gradient(circle, rgba(45, 212, 191, 0.2) 1px, transparent 1px);
          background-size: 60px 60px, 40px 40px;
          background-position: 0 0, 30px 30px;
        "></div>
      </div>

      <!-- Floating particles -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-24 left-32 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-float-particle delay-300"></div>
        <div class="absolute top-48 right-40 w-3 h-3 bg-teal-400 rounded-full animate-float-particle delay-500"></div>
        <div class="absolute bottom-32 left-48 w-2.5 h-2.5 bg-emerald-400/80 rounded-full animate-float-particle delay-700"></div>
        <div class="absolute bottom-56 right-32 w-3 h-3 bg-teal-400/80 rounded-full animate-float-particle delay-1000"></div>
        <div class="absolute top-1/2 right-1/3 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-float-particle delay-1200"></div>
        <div class="absolute top-2/3 left-1/3 w-3 h-3 bg-teal-300 rounded-full animate-float-particle delay-1500"></div>
        <div class="absolute top-1/4 right-1/5 w-2.5 h-2.5 bg-emerald-400/70 rounded-full animate-float-particle delay-800"></div>
        <div class="absolute bottom-1/4 left-1/5 w-3 h-3 bg-teal-400/70 rounded-full animate-float-particle delay-1100"></div>
      </div>

      <!-- Subtle noise texture (Premium feel) -->
      <div class="absolute inset-0 opacity-[0.03] mix-blend-overlay" style="
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjk5IiBudW1PY3RhdmVzPSI1IiBzZWVkPSIyIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=');
        background-size: 300px 300px;
      "></div>
    </div>

    <div class="w-full max-w-md relative z-10">
      <!-- Logo Section -->
      <div v-if="activeTab === 'login'" class="text-center mb-8 animate-fade-in">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl mb-4 shadow-lg shadow-emerald-400/20">
          <Heart class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-slate-800 mb-2">Semed Livingcare</h1>
        <p class="text-slate-600">ระบบจัดการคลินิก</p>
      </div>

      <!-- Auth Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8 border border-slate-200/50">
        <!-- Tab Navigation -->
        <div class="flex bg-slate-100 rounded-xl p-1 mb-6">
          <button
            @click="activeTab = 'login'"
            :class="[
              'flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200',
              activeTab === 'login'
                ? 'bg-white text-emerald-400 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            ]"
          >
            เข้าสู่ระบบ
          </button>
          <button
            @click="activeTab = 'register'"
            :class="[
              'flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200',
              activeTab === 'register'
                ? 'bg-white text-emerald-400 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            ]"
          >
            สมัครสมาชิก
          </button>
        </div>

        <!-- Login Form -->
        <transition name="fade" mode="out-in">
          <div v-if="activeTab === 'login'" key="login" class="space-y-5">
            <form @submit.prevent="handleLogin" class="space-y-4">
              <!-- Email Field -->
              <div class="space-y-1.5">
                <label class="block text-sm font-medium text-slate-700">อีเมล</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail class="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    v-model="loginForm.email"
                    type="email"
                    placeholder="กรอกอีเมลของคุณ"
                    class="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                    :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-500': errors.email }"
                    required
                  />
                </div>
                <p v-if="errors.email" class="text-sm text-red-600">{{ errors.email }}</p>
              </div>

              <!-- Password Field -->
              <div class="space-y-1.5">
                <label class="block text-sm font-medium text-slate-700">รหัสผ่าน</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock class="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    v-model="loginForm.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="กรอกรหัสผ่านของคุณ"
                    class="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                    :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-500': errors.password }"
                    required
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-0 top-0 h-full pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Eye v-if="!showPassword" class="w-5 h-5" />
                    <EyeOff v-else class="w-5 h-5" />
                  </button>
                </div>
                <p v-if="errors.password" class="text-sm text-red-600">{{ errors.password }}</p>
              </div>

              <!-- Remember & Forgot -->
              <div class="flex items-center justify-between">
                <label class="flex items-center cursor-pointer">
                  <input
                    v-model="loginForm.rememberMe"
                    type="checkbox"
                    class="w-4 h-4 text-emerald-400 bg-white border-slate-300 rounded focus:ring-emerald-300 focus:ring-2"
                  />
                  <span class="ml-2 text-sm text-slate-600">จดจำฉัน</span>
                </label>
                <a href="#" class="text-sm text-emerald-400 hover:text-emerald-500 font-medium transition-colors">
                  ลืมรหัสผ่าน?
                </a>
              </div>

              <!-- Login Button -->
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full bg-gradient-to-r from-emerald-400 to-teal-400 text-white font-semibold py-2.5 rounded-lg hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <svg
                  v-if="isLoading"
                  class="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}</span>
              </button>
            </form>

            <!-- Sign Up Link -->
            <div class="text-center pt-2">
              <p class="text-sm text-slate-600">
                ยังไม่มีบัญชี?
                <a
                  href="#"
                  @click.prevent="activeTab = 'register'"
                  class="text-emerald-400 hover:text-emerald-500 font-semibold transition-colors"
                >
                  สมัครสมาชิก
                </a>
              </p>
            </div>
          </div>

          <!-- Register Form -->
          <div v-else key="register" class="space-y-5">
            <div class="text-center mb-4">
              <h2 class="text-2xl font-bold text-slate-800 mb-1">สร้างบัญชีใหม่</h2>
              <p class="text-sm text-slate-600">กรอกข้อมูลเพื่อสมัครสมาชิก</p>
            </div>

            <form @submit.prevent="handleRegister" class="space-y-4">
              <!-- Registration Code -->
              <div class="space-y-1.5">
                <label class="block text-sm font-medium text-slate-700">รหัสสมัครสมาชิก</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound class="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    v-model="registerForm.registrationCode"
                    type="text"
                    placeholder="กรอกรหัสสมัครสมาชิก"
                    class="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                    :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-500': errors.registrationCode }"
                    required
                  />
                </div>
                <p v-if="errors.registrationCode" class="text-sm text-red-600">{{ errors.registrationCode }}</p>
              </div>

              <!-- Full Name -->
              <div class="space-y-1.5">
                <label class="block text-sm font-medium text-slate-700">ชื่อ-นามสกุล</label>
                <input
                  v-model="registerForm.name"
                  type="text"
                  placeholder="กรอกชื่อ-นามสกุลของคุณ"
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                  :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-500': errors.name }"
                  required
                />
                <p v-if="errors.name" class="text-sm text-red-600">{{ errors.name }}</p>
              </div>

              <!-- Email -->
              <div class="space-y-1.5">
                <label class="block text-sm font-medium text-slate-700">อีเมล</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail class="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    v-model="registerForm.email"
                    type="email"
                    placeholder="กรอกอีเมลของคุณ"
                    class="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                    :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-500': errors.email }"
                    required
                  />
                </div>
                <p v-if="errors.email" class="text-sm text-red-600">{{ errors.email }}</p>
              </div>

              <!-- Password -->
              <div class="space-y-1.5">
                <label class="block text-sm font-medium text-slate-700">รหัสผ่าน</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock class="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    v-model="registerForm.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="กรอกรหัสผ่านของคุณ"
                    class="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                    :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-500': errors.password }"
                    required
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-0 top-0 h-full pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Eye v-if="!showPassword" class="w-5 h-5" />
                    <EyeOff v-else class="w-5 h-5" />
                  </button>
                </div>
                <p v-if="errors.password" class="text-sm text-red-600">{{ errors.password }}</p>
              </div>

              <!-- Confirm Password -->
              <div class="space-y-1.5">
                <label class="block text-sm font-medium text-slate-700">ยืนยันรหัสผ่าน</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock class="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    v-model="registerForm.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="ยืนยันรหัสผ่านของคุณ"
                    class="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                    :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-500': errors.confirmPassword }"
                    required
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-0 top-0 h-full pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Eye v-if="!showConfirmPassword" class="w-5 h-5" />
                    <EyeOff v-else class="w-5 h-5" />
                  </button>
                </div>
                <p v-if="errors.confirmPassword" class="text-sm text-red-600">{{ errors.confirmPassword }}</p>
              </div>

              <!-- Register Button -->
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full bg-gradient-to-r from-emerald-400 to-teal-400 text-white font-semibold py-2.5 rounded-lg hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <svg
                  v-if="isLoading"
                  class="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isLoading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก' }}</span>
              </button>
            </form>

            <!-- Login Link -->
            <div class="text-center pt-2">
              <p class="text-sm text-slate-600">
                มีบัญชีอยู่แล้ว?
                <a
                  href="#"
                  @click.prevent="activeTab = 'login'"
                  class="text-emerald-400 hover:text-emerald-500 font-semibold transition-colors"
                >
                  เข้าสู่ระบบ
                </a>
              </p>
            </div>
          </div>
        </transition>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-3 bg-white text-slate-500">หรือ</span>
          </div>
        </div>

        <!-- Google Login Button -->
        <button
          @click="handleGoogleLogin"
          class="w-full py-2.5 rounded-lg font-semibold border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-3"
        >
          <svg class="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285f4" d="M533.5 278.4c0-17.4-1.6-34-4.7-50.2H272v95h147.2c-6.3 34.1-25.3 62.9-54 82.1v68.2h87.2c51-47 81.1-116.2 81.1-195.1z" />
            <path fill="#34a853" d="M272 544.3c73.4 0 134.9-24.3 179.8-66.2l-87.2-68.2c-24.1 16.2-55 25.7-92.6 25.7-71 0-131-47.9-152.4-112.3H29v70.6c44.8 88.5 136.2 150.4 243 150.4z" />
            <path fill="#fbbc04" d="M119.6 323.3c-10.8-32.1-10.8-66.5 0-98.6v-70.6H29c-39.6 77.7-39.6 162.1 0 239.9l90.6-70.7z" />
            <path fill="#ea4335" d="M272 107.7c39.8-.6 77.8 14.3 106.6 41.8l79.4-79.4C417.5 24.2 345.4-2.4 272 0 165.2 0 73.8 61.9 29 150.4l90.6 70.6C141 155.6 201 107.7 272 107.7z" />
          </svg>
          <span>เข้าสู่ระบบด้วย Google</span>
        </button>

        <!-- Error Message -->
        <transition name="fade">
          <div
            v-if="errorMessage"
            class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
          >
            <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm text-red-700">{{ errorMessage }}</span>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Heart, Mail, Lock, Eye, EyeOff, KeyRound } from 'lucide-vue-next'
import Swal from 'sweetalert2'

export default {
  name: 'AuthView',
  components: {
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

    validateRegisterForm() {
      Object.keys(this.errors).forEach(key => (this.errors[key] = ''))

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

    async handleLogin() {
      if (!this.validateLoginForm()) return

      this.isLoading = true
      this.errorMessage = ''

      try {
        await this.authStore.login(this.loginForm)

        await Swal.fire({
          icon: 'success',
          title: 'เข้าสู่ระบบสำเร็จ!',
          text: 'ยินดีต้อนรับสู่ระบบ SEMed Livingcare',
          timer: 1000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        })

        this.router.push('/lobby')
      } catch (error) {
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

    async handleRegister() {
      if (!this.validateRegisterForm()) return

      this.isLoading = true
      this.errorMessage = ''

      try {
        await this.authStore.register(this.registerForm)

        await Swal.fire({
          icon: 'success',
          title: 'สมัครสมาชิกสำเร็จ!',
          text: 'กรุณาเข้าสู่ระบบด้วยอีเมลและรหัสผ่านที่สมัครไว้',
          confirmButtonText: 'เข้าสู่ระบบ',
          showCancelButton: true,
          cancelButtonText: 'ปิด'
        }).then(result => {
          if (result.isConfirmed) {
            this.activeTab = 'login'
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

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Modern blob morphing animation (2024-2025 trend) */
@keyframes blob-morph {
  0%, 100% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    transform: translate(0, 0);
  }
  25% {
    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
    transform: translate(20px, -30px);
  }
  50% {
    border-radius: 70% 30% 50% 50% / 30% 50% 70% 50%;
    transform: translate(-20px, 20px);
  }
  75% {
    border-radius: 40% 60% 50% 70% / 60% 40% 60% 40%;
    transform: translate(10px, 30px);
  }
}

.animate-blob-morph {
  animation: blob-morph 20s ease-in-out infinite;
}

.animate-blob-morph-delay {
  animation: blob-morph 25s ease-in-out infinite;
  animation-delay: 3s;
}

.animate-blob-morph-slow {
  animation: blob-morph 30s ease-in-out infinite;
  animation-delay: 6s;
}

/* Rotating geometric shapes */
@keyframes rotate-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes rotate-reverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

.animate-rotate-slow {
  animation: rotate-slow 30s linear infinite;
}

.animate-rotate-reverse {
  animation: rotate-reverse 25s linear infinite;
}

.delay-rotate {
  animation-delay: 5s;
}

/* Floating particles */
@keyframes float-particle {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0.6;
  }
  25% {
    transform: translateY(-30px) translateX(15px);
    opacity: 1;
  }
  50% {
    transform: translateY(-60px) translateX(-10px);
    opacity: 0.8;
  }
  75% {
    transform: translateY(-30px) translateX(-20px);
    opacity: 0.9;
  }
}

.animate-float-particle {
  animation: float-particle 12s ease-in-out infinite;
}

.delay-1500 {
  animation-delay: 1.5s;
}

.delay-800 {
  animation-delay: 0.8s;
}

.delay-1100 {
  animation-delay: 1.1s;
}

/* Pulse delay */
.delay-300 {
  animation-delay: 0.3s;
}

.delay-500 {
  animation-delay: 0.5s;
}

.delay-700 {
  animation-delay: 0.7s;
}

.delay-1000 {
  animation-delay: 1s;
}

.delay-1200 {
  animation-delay: 1.2s;
}
</style>