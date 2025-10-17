<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">ภาพรวมระบบ</h1>
        <p class="text-gray-600">สถิติและข้อมูลสำคัญของระบบ</p>
      </div>
      <div class="flex items-center space-x-3">
        <div class="text-sm text-gray-500">อัปเดตล่าสุด: {{ lastUpdated }}</div>
        <button
          class="inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
        >
          <RefreshCw class="w-4 h-4 mr-2" />
          รีเฟรช
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Users class="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">ผู้ใช้งานทั้งหมด</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.totalUsers }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 class="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">สาขาทั้งหมด</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.totalBranches }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Calendar class="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">นัดหมายวันนี้</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.todayAppointments }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <Bell class="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">การแจ้งเตือน</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.notifications }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts and Tables -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Activity -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">กิจกรรมล่าสุด</h3>
        <div class="space-y-4">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="flex items-start space-x-3"
          >
            <div class="flex-shrink-0">
              <div
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  activity.type === 'success'
                    ? 'bg-green-100'
                    : activity.type === 'warning'
                      ? 'bg-yellow-100'
                      : 'bg-blue-100'
                ]"
              >
                <component
                  :is="activity.icon"
                  :class="[
                    'w-4 h-4',
                    activity.type === 'success'
                      ? 'text-green-600'
                      : activity.type === 'warning'
                        ? 'text-yellow-600'
                        : 'text-blue-600'
                  ]"
                />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900">{{ activity.message }}</p>
              <p class="text-xs text-gray-500">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">การดำเนินการด่วน</h3>
        <div class="grid grid-cols-2 gap-4">
          <button
            class="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <Plus class="w-5 h-5 text-emerald-600" />
              <div>
                <p class="text-sm font-medium text-gray-900">เพิ่มผู้ใช้</p>
                <p class="text-xs text-gray-500">สร้างบัญชีใหม่</p>
              </div>
            </div>
          </button>

          <button
            class="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <Calendar class="w-5 h-5 text-blue-600" />
              <div>
                <p class="text-sm font-medium text-gray-900">นัดหมายใหม่</p>
                <p class="text-xs text-gray-500">สร้างนัดหมาย</p>
              </div>
            </div>
          </button>

          <button
            class="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <FileText class="w-5 h-5 text-yellow-600" />
              <div>
                <p class="text-sm font-medium text-gray-900">รายงาน</p>
                <p class="text-xs text-gray-500">ดูรายงาน</p>
              </div>
            </div>
          </button>

          <button
            class="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <Settings class="w-5 h-5 text-gray-600" />
              <div>
                <p class="text-sm font-medium text-gray-900">การตั้งค่า</p>
                <p class="text-xs text-gray-500">จัดการระบบ</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Users,
  Building2,
  Calendar,
  Bell,
  RefreshCw,
  Plus,
  FileText,
  Settings,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-vue-next'

export default {
  name: 'Overview',
  components: {
    Users,
    Building2,
    Calendar,
    Bell,
    RefreshCw,
    Plus,
    FileText,
    Settings,
    CheckCircle,
    AlertTriangle,
    Info
  },
  data() {
    return {
      lastUpdated: '10:30 น.',
      stats: {
        totalUsers: 156,
        totalBranches: 3,
        todayAppointments: 12,
        notifications: 5
      },
      recentActivities: [
        {
          id: 1,
          type: 'success',
          icon: 'CheckCircle',
          message: 'ผู้ใช้ใหม่สมัครสมาชิกสำเร็จ',
          time: '5 นาทีที่แล้ว'
        },
        {
          id: 2,
          type: 'warning',
          icon: 'AlertTriangle',
          message: 'แพ็กเกจจะหมดอายุใน 3 วัน',
          time: '15 นาทีที่แล้ว'
        },
        {
          id: 3,
          type: 'info',
          icon: 'Info',
          message: 'มีการอัปเดตระบบใหม่',
          time: '1 ชั่วโมงที่แล้ว'
        },
        {
          id: 4,
          type: 'success',
          icon: 'CheckCircle',
          message: 'นัดหมายใหม่ถูกสร้าง',
          time: '2 ชั่วโมงที่แล้ว'
        }
      ]
    }
  }
}
</script>
