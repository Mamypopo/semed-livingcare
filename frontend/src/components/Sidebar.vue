<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200/50 shadow-lg transform transition-all duration-300 ease-in-out flex flex-col',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      // Mobile: แสดงแบบเต็มเสมอ, Tablet+: ใช้ isCollapsed
      'w-64',
      isCollapsed ? 'md:w-16 lg:w-16' : 'md:w-64 lg:w-64',
      'md:translate-x-0' // แสดงบน tablet ขึ้นไป
    ]"
  >
    <!-- Sidebar Header -->
    <div
      class="flex items-center justify-between h-16 px-4 border-b border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-white"
    >
      <div class="flex items-center space-x-3 flex-1 min-w-0">
        <div class="w-10 h-10 flex items-center justify-center flex-shrink-0">
          <img
            src="/src/assets/image/Logosemed.png"
            alt="SEMed Logo"
            class="w-8 h-8 object-contain"
          />
        </div>
        <div v-if="!isCollapsed" class="flex flex-col transition-opacity duration-300 min-w-0">
          <span class="text-lg font-bold text-slate-800 truncate">SEMed</span>
          <span class="text-xs text-slate-500 font-medium">Livingcare</span>
        </div>
      </div>

      <!-- Collapse Button (Tablet and Desktop - when expanded) -->
      <button
        v-if="!isCollapsed"
        @click="$emit('toggle-collapse')"
        class="hidden md:flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200 flex-shrink-0"
        v-tooltip.right="'ย่อเมนู'"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>

      <!-- Close Button (Mobile only) -->
      <button
        @click="$emit('toggle-sidebar')"
        class="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200 flex-shrink-0"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Expand Button (Tablet and Desktop - when collapsed) -->
    <div v-if="isCollapsed" class="flex justify-center py-3 border-b border-slate-200/50">
      <button
        @click="$emit('toggle-collapse')"
        class="hidden md:flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200"
        v-tooltip.right="'ขยายเมนู'"
      >
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>

    <!-- Sidebar Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Sidebar Navigation -->
      <nav class="flex-1 overflow-y-auto px-3 py-4">
        <div class="space-y-1.5">
          <template v-for="(item, index) in navigation" :key="item.name">
            <!-- Menu Item with Submenu -->
            <div v-if="item.submenu" class="space-y-1">
              <!-- Main Menu Item -->
              <button
                @click="toggleSubmenu(index)"
                :class="[
                  'group relative flex items-center w-full px-3 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200',
                  // Active state with accent bar
                  isAnySubmenuActive(index)
                    ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-400',
                  // Mobile: แสดงแบบเต็มเสมอ, Tablet+: ใช้ isCollapsed
                  isCollapsed ? 'md:justify-center lg:justify-center' : 'md:justify-start lg:justify-start'
                ]"
                v-tooltip:right="isCollapsed ? item.name : ''"
              >
                <!-- Active indicator bar -->
                <div
                  v-if="isAnySubmenuActive(index)"
                  class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-r-full"
                ></div>
                
                <component
                  :is="item.icon"
                  :class="[
                    'h-5 w-5 transition-colors duration-200 flex-shrink-0',
                    isAnySubmenuActive(index) ? 'text-emerald-700' : 'text-slate-500 group-hover:text-emerald-400',
                    isCollapsed ? 'md:mr-0 lg:mr-0' : 'mr-3'
                  ]"
                />
                <span v-if="!isCollapsed" class="transition-opacity duration-300 flex-1 text-left">{{
                  item.name
                }}</span>
                <ChevronDown
                  v-if="!isCollapsed"
                  :class="[
                    'w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0',
                    openSubmenu === index ? 'rotate-180' : ''
                  ]"
                />
              </button>

              <!-- Submenu with slide animation -->
              <transition
                enter-active-class="transition-all duration-200 ease-out"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-96"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 max-h-96"
                leave-to-class="opacity-0 max-h-0"
              >
                <div
                  v-if="!isCollapsed && openSubmenu === index"
                  class="ml-8 pl-4 border-l-2 border-emerald-200/50 space-y-1 overflow-hidden"
                >
                  <router-link
                    v-for="subItem in item.submenu"
                    :key="subItem.name"
                    :to="subItem.href"
                    :class="[
                      'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                      $route.path === subItem.href
                        ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 font-semibold shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50  hover:text-emerald-400'
                    ]"
                  >
                    <span>{{ subItem.name }}</span>
                  </router-link>
                </div>
              </transition>
            </div>

            <!-- Menu Item without Submenu -->
            <router-link
              v-else
              :to="item.href"
              :class="[
                'group relative flex items-center px-3 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200',
                $route.path === item.href
                  ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50  hover:text-emerald-400',
                // Mobile: แสดงแบบเต็มเสมอ, Tablet+: ใช้ isCollapsed
                isCollapsed ? 'md:justify-center lg:justify-center' : 'md:justify-start lg:justify-start'
              ]"
              v-tooltip:right="isCollapsed ? item.name : ''"
            >
              <!-- Active indicator bar -->
              <div
                v-if="$route.path === item.href"
                class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-r-full"
              ></div>
              
              <component
                :is="item.icon"
                :class="[
                  'h-5 w-5 transition-colors duration-200 flex-shrink-0',
                  $route.path === item.href ? 'text-emerald-700' : 'text-slate-500 group-hover:text-emerald-400',
                  isCollapsed ? 'md:mr-0 lg:mr-0' : 'mr-3'
                ]"
              />
              <span v-if="!isCollapsed" class="transition-opacity duration-300">{{ item.name }}</span>
            </router-link>
          </template>
        </div>
      </nav>

      <!-- Branch Info Section -->
      <div class="px-3 pb-4 pt-4 border-t border-slate-200/50 bg-slate-50/30">
        <!-- Full Branch Info -->
        <div
          v-if="!isCollapsed"
          class="bg-white rounded-xl p-4 border border-slate-200/50 shadow-sm"
        >
          <h3 class="text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">สาขาปัจจุบัน</h3>
          <div class="flex items-center space-x-2 mb-1">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-400/20 flex-shrink-0">
              <Building2 class="w-4 h-4 text-white" />
            </div>
            <span class="text-sm font-semibold text-slate-800 truncate flex-1">{{
              currentBranch?.name || 'ยังไม่ได้เลือกสาขา'
            }}</span>
          </div>
          <div v-if="currentBranch?.code" class="mt-2 text-xs text-slate-500 font-medium">
            {{ currentBranch.code }}
          </div>
        </div>
        
        <!-- Collapsed Branch Info (Tablet+ when collapsed) -->
        <div
          v-else
          class="hidden md:flex items-center justify-center"
        >
          <div
            class="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-400/20"
            v-tooltip.right="currentBranch?.name || 'ยังไม่ได้เลือกสาขา'"
          >
            <Building2 class="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import {
  X,
  Building2,
  Building,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Home,
  BarChart3,
  Users,
  Settings
} from 'lucide-vue-next'

export default {
  name: 'AppSidebar',
  components: {
    X,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Home,
    BarChart3,
    Users,
    Building2,
    Building,
    Settings
  },
  props: {
    sidebarOpen: {
      type: Boolean,
      default: false
    },
    isCollapsed: {
      type: Boolean,
      default: false
    },
    currentBranch: {
      type: Object,
      default: null
    }
  },
  emits: ['toggle-sidebar', 'toggle-collapse'],
  data() {
    return {
      openSubmenu: null,
      navigation: [
        { name: 'ภาพรวม', href: '/main/overview', icon: 'Home' },
        {
          name: 'ลูกค้า',
          icon: 'Users',
          submenu: [
            { name: 'ลูกค้า', href: '/main/customers/patients' },
            { name: 'กลุ่มลูกค้า', href: '/main/customers/patient-groups' },
            { name: 'แท็ก', href: '/main/customers/tags' },
            { name: 'ประเภทประกัน', href: '/main/customers/insurance-types' }
          ]
        },
        {
          name: 'คิวการตรวจ',
          icon: 'BarChart3',
          submenu: [{ name: 'คิวตรวจ OPD', href: '/main/queue/opd' }]
        },
        {
          name: 'สาขา',
          icon: 'Building',
          submenu: [{ name: 'รายชื่อสาขา', href: '/main/branches' }]
        },
        {
          name: 'จัดการ',
          icon: 'Settings',
          submenu: [
            { name: 'ผู้ใช้งาน', href: '/main/users' },
            { name: 'แผนก', href: '/main/departments' }
          ]
        }
      ]
    }
  },
  methods: {
    toggleSubmenu(index) {
      // ถ้า submenu นี้เปิดอยู่ ให้ปิด
      if (this.openSubmenu === index) {
        this.openSubmenu = null
      } else {
        // เปิด submenu นี้ และปิดอันอื่น
        this.openSubmenu = index
      }
    },
    ensureOpenSubmenuForRoute() {
      // หาก route ปัจจุบันอยู่ใน submenu ใด ให้เปิดเมนูนั้นไว้
      const path = this.$route.path
      const idx = this.navigation.findIndex(
        item => Array.isArray(item.submenu) && item.submenu.some(sub => sub.href === path)
      )
      if (idx !== -1) {
        this.openSubmenu = idx
      }
    },
    isAnySubmenuActive(index) {
      // ตรวจสอบว่าเมนูหลักนี้มี submenu ที่ active อยู่หรือไม่
      const item = this.navigation[index]
      if (!item.submenu) return false

      const currentPath = this.$route.path
      return item.submenu.some(sub => sub.href === currentPath)
    }
  },
  mounted() {
    this.ensureOpenSubmenuForRoute()
  },
  watch: {
    '$route.path'() {
      this.ensureOpenSubmenuForRoute()
    }
  }
}
</script>
