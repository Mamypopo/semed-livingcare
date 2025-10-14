<template>
  <aside 
        :class="[
          'fixed inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-all duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          // Mobile: แสดงแบบเต็มเสมอ, Tablet+: ใช้ isCollapsed
          'w-64',
          isCollapsed ? 'md:w-16 lg:w-16' : 'md:w-64 lg:w-64',
          'md:translate-x-0' // แสดงบน tablet ขึ้นไป
        ]"
  >
    <!-- Sidebar Header -->
    <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
          <Heart class="w-5 h-5 text-white" />
        </div>
        <span v-if="!isCollapsed" class="text-lg font-semibold text-gray-900 transition-opacity duration-300">SEMed</span>
      </div>
      
      <!-- Collapse Button (Tablet and Desktop - when expanded) -->
      <button 
        v-if="!isCollapsed"
        @click="$emit('toggle-collapse')"
        class="hidden md:block p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        v-tooltip.right="'ย่อเมนู'"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>
      
      <!-- Close Button (Mobile only) -->
      <button 
        @click="$emit('toggle-sidebar')"
        class="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Expand Button (Tablet and Desktop - when collapsed) -->
    <div v-if="isCollapsed" class="flex justify-center py-2 ">
      <button 
        @click="$emit('toggle-collapse')"
        class="hidden md:block p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        v-tooltip.right="'ขยายเมนู'"
      >
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>

    <!-- Sidebar Navigation -->
    <nav class="mt-6 px-3">
      <div class="space-y-1">
        <template v-for="(item, index) in navigation" :key="item.name">
          <!-- Menu Item with Submenu -->
          <div v-if="item.submenu" class="space-y-1">
            <!-- Main Menu Item -->
            <button
              @click="toggleSubmenu(index)"
              :class="[
                'group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-all duration-200',
                'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                // Mobile: แสดงแบบเต็มเสมอ, Tablet+: ใช้ isCollapsed
                'md:justify-center lg:justify-start',
                isCollapsed ? 'md:justify-center lg:justify-center' : 'md:justify-start lg:justify-start'
              ]"
              v-tooltip:right="isCollapsed ? item.name : ''"
            >
              <component :is="item.icon" :class="['h-5 w-5', isCollapsed ? 'md:mr-0 lg:mr-0' : 'mr-3']" />
              <span v-if="!isCollapsed" class="transition-opacity duration-300 flex-1 text-left">{{ item.name }}</span>
              <ChevronDown 
                v-if="!isCollapsed" 
                :class="[
                  'w-4 h-4 transition-transform duration-200',
                  openSubmenu === index ? 'rotate-180' : ''
                ]" 
              />
            </button>
            
            <!-- Submenu -->
            <div v-if="!isCollapsed && openSubmenu === index" class="ml-4 pl-3 border-l border-gray-200 space-y-1">
              <router-link
                v-for="subItem in item.submenu"
                :key="subItem.name"
                :to="subItem.href"
                :class="[
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200',
                  $route.path === subItem.href
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                ]"
              >
                <span>{{ subItem.name }}</span>
              </router-link>
            </div>
          </div>
          
          <!-- Menu Item without Submenu -->
          <router-link
            v-else
            :to="item.href"
            :class="[
              'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200',
              $route.path === item.href
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              // Mobile: แสดงแบบเต็มเสมอ, Tablet+: ใช้ isCollapsed
              'md:justify-center lg:justify-start',
              isCollapsed ? 'md:justify-center lg:justify-center' : 'md:justify-start lg:justify-start'
            ]"
            v-tooltip:right="isCollapsed ? item.name : ''"
          >
            <component :is="item.icon" :class="['h-5 w-5', isCollapsed ? 'md:mr-0 lg:mr-0' : 'mr-3']" />
            <span v-if="!isCollapsed" class="transition-opacity duration-300">{{ item.name }}</span>
          </router-link>
        </template>
      </div>

      <!-- Branch Info - Mobile: แสดงแบบเต็มเสมอ -->
      <div class="mt-8 px-3">
        <!-- Full Branch Info (Mobile) -->
        <div class="md:hidden bg-gray-50 rounded-lg p-4">
          <h3 class="text-sm font-medium text-gray-900 mb-2">สาขาปัจจุบัน</h3>
          <div class="flex items-center space-x-2">
            <Building2 class="w-4 h-4 text-emerald-600" />
            <span class="text-sm text-gray-700">{{ currentBranch?.name || 'ยังไม่ได้เลือกสาขา' }}</span>
          </div>
          <div class="mt-2 text-xs text-gray-500">
            {{ currentBranch?.code || '' }}
          </div>
        </div>
        
        <!-- Collapsed Branch Info (Tablet+) -->
        <!-- <div v-if="isCollapsed" class="hidden md:block bg-gray-50 rounded-lg p-3 flex justify-center">
          <Building2 class="w-5 h-5 text-emerald-600" v-tooltip="currentBranch?.name || 'ยังไม่ได้เลือกสาขา'" />
        </div> -->
        
        <!-- Full Branch Info (Tablet+ when expanded) -->
        <!-- <div v-else class="hidden md:block bg-gray-50 rounded-lg p-4">
          <h3 class="text-sm font-medium text-gray-900 mb-2">สาขาปัจจุบัน</h3>
          <div class="flex items-center space-x-2">
            <Building2 class="w-4 h-4 text-emerald-600" />
            <span class="text-sm text-gray-700">{{ currentBranch?.name || 'ยังไม่ได้เลือกสาขา' }}</span>
          </div>
          <div class="mt-2 text-xs text-gray-500">
            {{ currentBranch?.code || '' }}
          </div>
        </div> -->
      </div>
    </nav>
  </aside>
</template>

<script>
import { Heart, X, Building2, Building, ChevronLeft, ChevronRight, ChevronDown, Home, BarChart3, Users,Settings } from 'lucide-vue-next'

export default {
  name: 'Sidebar',
  components: {
    Heart, X, ChevronLeft, ChevronRight, ChevronDown, Home, BarChart3, Users, Building2, Building,Settings
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
            { name: 'รายชื่อลูกค้า', href: '/main/customers' },
          ]
        },
        { 
          name: 'สาขา', 
          icon: 'Building',
          submenu: [
            { name: 'รายชื่อสาขา', href: '/main/branches' },
          ]
        },
        { 
          name: 'จัดการ', 
          icon: 'Settings',
          submenu: [
            { name: 'ผู้ใช้งาน', href: '/main/users' },
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
      const idx = this.navigation.findIndex(item =>
        Array.isArray(item.submenu) && item.submenu.some(sub => sub.href === path)
      )
      if (idx !== -1) {
        this.openSubmenu = idx
      }
    }
  }
  ,
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
