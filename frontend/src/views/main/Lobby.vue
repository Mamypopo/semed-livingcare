<template>
  <div class="space-y-6 w-full max-w-7xl mx-auto">
    <!-- Navigation Tabs -->
    <div class="mb-8">
      <nav class="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          v-for="tab in navigationTabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
            activeTab === tab.id
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-800 hover:bg-white/50',
          ]"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          <span>{{ tab.name }}</span>
        </button>
      </nav>
    </div>

    <!-- Page Header -->
    <div class="flex items-center space-x-4">
      <div class="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
        <component :is="currentTab.icon" class="w-6 h-6 text-white" />
      </div>
      <div>
        <h2 class="text-2xl font-bold text-slate-800">{{ currentTab.name }}</h2>
        <p class="text-slate-600">{{ currentTab.description }}</p>
      </div>
    </div>

    <!-- Branches Grid -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-slate-800 mb-4">สาขาของคุณ</h3>

      <div v-if="branches.length === 0" class="text-center py-12">
        <Building2 class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">ยังไม่มีสาขา</h3>
        <p class="text-gray-600">กรุณาติดต่อผู้ดูแลระบบเพื่อเข้าสาขา</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="branch in branches"
          :key="branch.id"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:border-emerald-300 hover:-translate-y-1"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Building2 class="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h4 class="font-semibold text-slate-800">{{ branch.name }}</h4>
              </div>
            </div>
            <div
              v-if="branch.isMain"
              class="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium"
            >
              สาขาหลัก
            </div>
          </div>

          <div class="space-y-3 mb-6">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">รหัสสาขา:</span>
              <span class="font-medium text-gray-900">{{ branch.code }}</span>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <button
              @click="enterMainSystem(branch)"
              class="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md group"
            >
              เข้าใช้งานระบบ
              <ArrowRight
                class="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { branchService } from '@/services/branch'
import {
  Building2,
  MessageSquare,
  Plus,
  Settings,
  ArrowRight,
  BarChart3,
  Mail,
  FileText,
  Users,
  Calendar,
  Shield,
} from 'lucide-vue-next'

export default {
  name: 'Lobby',
  components: {
    Building2,
    MessageSquare,
    Plus,
    Settings,
    ArrowRight,
    BarChart3,
    Mail,
    FileText,
    Users,
    Calendar,
    Shield,
  },
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    return { authStore, router }
  },
  data() {
    return {
      activeTab: 'branches',
      notifications: 3,
      navigationTabs: [
        {
          id: 'overview',
          name: 'ภาพรวม',
          icon: 'BarChart3',
          description: 'ภาพรวมระบบและสถิติ',
        },
        {
          id: 'branches',
          name: 'สาขา',
          icon: 'Building2',
          description: 'จัดการสาขาและแพ็กเกจ',
        },
      ],
      branches: [],
      maxBranches: 1,
    }
  },
  computed: {
    currentTab() {
      return this.navigationTabs.find((tab) => tab.id === this.activeTab) || this.navigationTabs[0]
    },
  },
  async mounted() {
    await this.loadBranches()
  },
  methods: {
    // Enter main system
    enterMainSystem(branch) {
      // Store selected branch in auth store
      this.authStore.setSelectedBranch(branch)

      // Navigate to overview
      this.router.push('/main/overview')
    },

    async loadBranches() {
      try {
        // เรียก API จริงเพื่อดึงสาขาตามสิทธิ์ผู้ใช้
        this.branches = await branchService.getUserBranches()

        // ตรวจสอบว่าผู้ใช้มีสาขาหรือไม่
        if (this.branches.length === 0) {
          this.maxBranches = 0
        } else {
          this.maxBranches = this.branches.length
        }
      } catch (error) {
        console.error('Error loading branches:', error)

        // Fallback to empty array if API fails
        this.branches = []
        this.maxBranches = 0

        // Show error message to user
        this.$swal({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถโหลดข้อมูลสาขาได้ กรุณาลองใหม่อีกครั้ง',
          confirmButtonText: 'ตกลง',
        })
      }
    },
  },
}
</script>
