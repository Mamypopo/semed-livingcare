<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar
      v-if="showSidebar"
      :sidebar-open="sidebarOpen"
      :is-collapsed="sidebarCollapsed"
      :current-branch="authStore.currentBranch"
      @toggle-sidebar="toggleSidebar"
      @toggle-collapse="toggleSidebarCollapse"
    />

    <!-- Main Content -->
    <div :class="[showSidebar ? (sidebarCollapsed ? 'md:pl-16 lg:pl-16' : 'lg:pl-64') : '']">
      <!-- Top Navigation -->
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div class="px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Mobile menu button -->
            <button
              v-if="showSidebar"
              @click="toggleSidebar"
              class="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <MenuIcon class="w-5 h-5" />
            </button>

            <!-- Page Title -->
            <div class="flex-1 lg:flex-none">
              <h1 class="text-xl font-semibold text-gray-900">
                {{ $route.path === '/main/lobby' ? 'SEMed Livingcare' : (authStore.currentBranch?.name || pageTitle) }}
              </h1>
            </div>

            <!-- Right side items -->
            <div class="flex items-center space-x-2 sm:space-x-4">
              <!-- Global Search -->
              <div v-if="$route.path !== '/main/lobby'" class="relative hidden sm:block">
                <div class="relative">
                  <input
                    ref="searchInput"
                    v-model="searchQuery"
                    @keydown="handleSearchKeydown"
                    @focus="showSearchResults = true"
                    @blur="hideSearchResults"
                    type="text"
                    placeholder="ค้นหา..."
                    class="w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                  />
                  <SearchIcon
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  />
                </div>

                <!-- Search Results Dropdown -->
                <div
                  v-if="showSearchResults && (searchQuery || searchResults.length > 0)"
                  class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
                >
                  <div
                    v-if="searchResults.length === 0 && searchQuery"
                    class="p-4 text-center text-gray-500"
                  >
                    ไม่พบผลลัพธ์
                  </div>
                  <div v-else>
                    <div v-for="(result, index) in searchResults" :key="index">
                      <button
                        @click="selectSearchResult(result)"
                        :class="[
                          'w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors',
                          selectedSearchIndex === index ? 'bg-emerald-50' : ''
                        ]"
                      >
                        <div class="flex items-center space-x-3">
                          <component :is="result.icon" class="w-4 h-4 text-gray-500" />
                          <div>
                            <div class="font-medium text-gray-900">{{ result.title }}</div>
                            <div class="text-sm text-gray-500">{{ result.description }}</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Search Button for Mobile -->
              <button
                v-if="$route.path !== '/main/lobby'"
                @click="toggleMobileSearch"
                class="sm:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
                v-tooltip="'ค้นหา'"
              >
                <SearchIcon class="w-5 h-5" />
              </button>

              <!-- User Menu (Headless UI) -->
              <HMenu as="div" class="relative inline-block text-left" v-slot="{ open }">
                <div>
                  <MenuButton
                    class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                  >
                    <div
                      class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md"
                    >
                      <span class="text-white text-sm font-semibold">{{ userInitial }}</span>
                    </div>
                    <div class="hidden sm:block text-left">
                      <p class="text-sm font-semibold text-gray-900">{{ authStore.userName }}</p>
                      <p class="text-xs text-emerald-600 font-medium">{{ authStore.userRole }}</p>
                    </div>
                    <ChevronDown
                      :class="[
                        'w-4 h-4 text-gray-400 transition-transform duration-200',
                        open ? 'rotate-180' : ''
                      ]"
                    />
                  </MenuButton>
                </div>

                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <MenuItems
                    class="absolute right-0 mt-3 z-50 p-2 shadow-xl bg-white rounded-xl border border-gray-100 w-56 focus:outline-none"
                  >
                    <div class="px-1 py-1">
                      <MenuItem v-slot="{ active }">
                        <a
                          :class="[
                            'flex text-gray-700 items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer',
                            active ? 'bg-emerald-50' : ''
                          ]"
                        >
                          <User class="w-4 h-4" />
                          <span>โปรไฟล์</span>
                        </a>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <a
                          :class="[
                            'flex text-gray-700 items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer',
                            active ? 'bg-yellow-50' : ''
                          ]"
                        >
                          <Settings class="w-4 h-4" />
                          <span>การตั้งค่า</span>
                        </a>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <a
                          @click="goLobby"
                          :class="[
                            'flex text-gray-700 items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer',
                            active ? 'bg-sky-50' : ''
                          ]"
                        >
                          <Building2 class="w-4 h-4" />
                          <span>เลือกสาขา</span>
                        </a>
                      </MenuItem>
                      <div class="my-2 border-t border-gray-200"></div>
                      <MenuItem v-slot="{ active }">
                        <a
                          @click="handleLogout"
                          :class="[
                            'flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 transition-colors cursor-pointer',
                            active ? 'bg-red-50' : ''
                          ]"
                        >
                          <LogOut class="w-4 h-4" />
                          <span>ออกจากระบบ</span>
                        </a>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </transition>
              </HMenu>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1">
        <div class="py-6">
          <div class="mx-auto px-4 sm:px-6 lg:px-8">
            <router-view />
          </div>
        </div>
      </main>
    </div>

    <!-- Mobile sidebar overlay -->
    <div
      v-if="sidebarOpen"
      @click="toggleSidebar"
      class="fixed inset-0 z-40 bg-black bg-opacity-25 md:hidden"
    ></div>

    <!-- Mobile Search Modal -->
    <div
      v-if="mobileSearchOpen"
      class="fixed inset-0 z-50 bg-black bg-opacity-25 sm:hidden"
      @click="closeMobileSearch"
    >
      <div class="flex items-start justify-center pt-16 px-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md" @click.stop>
          <div class="p-4">
            <div class="flex items-center space-x-3 mb-4">
              <SearchIcon class="w-5 h-5 text-gray-400" />
              <input
                ref="mobileSearchInput"
                v-model="searchQuery"
                @keydown="handleSearchKeydown"
                @focus="showSearchResults = true"
                @blur="hideSearchResults"
                type="text"
                placeholder="ค้นหา... (Ctrl+K)"
                class="flex-1 text-sm border-0 focus:ring-0 focus:outline-none"
                autofocus
              />
              <button
                @click="closeMobileSearch"
                class="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Search Results -->
            <div
              v-if="showSearchResults && (searchQuery || searchResults.length > 0)"
              class="max-h-80 overflow-y-auto"
            >
              <div
                v-if="searchResults.length === 0 && searchQuery"
                class="p-4 text-center text-gray-500"
              >
                ไม่พบผลลัพธ์
              </div>
              <div v-else>
                <div v-for="(result, index) in searchResults" :key="index">
                  <button
                    @click="selectSearchResult(result)"
                    :class="[
                      'w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors',
                      selectedSearchIndex === index ? 'bg-emerald-50' : ''
                    ]"
                  >
                    <div class="flex items-center space-x-3">
                      <component :is="result.icon" class="w-4 h-4 text-gray-500" />
                      <div>
                        <div class="font-medium text-gray-900">{{ result.title }}</div>
                        <div class="text-sm text-gray-500">{{ result.description }}</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import Swal from 'sweetalert2'
import {
  Menu as MenuIcon,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Building2,
  Search as SearchIcon,
  Home,
  Users,
  Building,
  Tag,
  Shield,
  Plus,
  X
} from 'lucide-vue-next'
import { Menu as HMenu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

export default {
  name: 'MainLayout',
  components: {
    Sidebar,
    MenuIcon,
    ChevronDown,
    User,
    Settings,
    LogOut,
    Building2,
    SearchIcon,
    Home,
    Users,
    Building,
    Tag,
    Shield,
    Plus,
    X,
    HMenu,
    MenuButton,
    MenuItems,
    MenuItem
  },
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    return { authStore, router }
  },
  data() {
    return {
      sidebarOpen: false,
      sidebarCollapsed: false, // สำหรับย่อขยาย sidebar บนเดสก์ท็อป
      showSidebar: false, // ซ่อน sidebar จนกว่าจะเลือกสาขา
      userMenuOpen: false,
      // Search
      searchQuery: '',
      showSearchResults: false,
      selectedSearchIndex: -1,
      mobileSearchOpen: false,
      searchData: [
        // Navigation
        {
          type: 'page',
          title: 'ภาพรวม',
          description: 'หน้าหลักของระบบ',
          path: '/main/overview',
          icon: 'Home'
        },
        {
          type: 'page',
          title: 'รายชื่อสาขา',
          description: 'จัดการข้อมูลสาขา',
          path: '/main/branches',
          icon: 'Building'
        },
        {
          type: 'page',
          title: 'กลุ่มลูกค้า',
          description: 'จัดการกลุ่มลูกค้า',
          path: '/main/customers/patient-groups',
          icon: 'Users'
        },
        {
          type: 'page',
          title: 'แท็ก',
          description: 'จัดการแท็กลูกค้า',
          path: '/main/customers/tags',
          icon: 'Tag'
        },
        {
          type: 'page',
          title: 'ประเภทประกัน',
          description: 'จัดการประเภทประกัน',
          path: '/main/customers/insurance-types',
          icon: 'Shield'
        },
        {
          type: 'page',
          title: 'ผู้ใช้งาน',
          description: 'จัดการผู้ใช้งานระบบ',
          path: '/main/users',
          icon: 'Users'
        }
      ]
    }
  },
  computed: {
    userInitial() {
      return this.authStore.userName ? this.authStore.userName.charAt(0).toUpperCase() : 'U'
    },
    pageTitle() {
      const metaTitle = this.$route.meta && this.$route.meta.title
      const routeName = this.$route.name
      return metaTitle || routeName || 'SEMed Livingcare'
    },
    searchResults() {
      if (!this.searchQuery.trim()) return []

      const query = this.searchQuery.toLowerCase()
      return this.searchData.filter(
        item =>
          item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
      )
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    toggleSidebarCollapse() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    async handleLogout() {
      const result = await Swal.fire({
        title: 'ออกจากระบบ',
        text: 'คุณต้องการออกจากระบบหรือไม่?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ออกจากระบบ',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        reverseButtons: true
      })

      if (result.isConfirmed) {
        this.authStore.logout()
        this.router.push('/auth')

        // แสดงข้อความสำเร็จ
        Swal.fire({
          title: 'ออกจากระบบสำเร็จ',
          text: 'ขอบคุณที่ใช้งานระบบ',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        })
      }
    },
    goLobby() {
      this.router.push('/main/lobby')
    },
    checkSelectedBranch() {
      // ถ้าอยู่ในหน้า lobby หรือผู้ใช้ไม่มีสาขา ให้ซ่อน sidebar เสมอ
      if (this.$route.path === '/main/lobby' || this.authStore.needsBranchAssignment) {
        this.showSidebar = false
      } else {
        this.showSidebar = !!this.authStore.currentBranch
        // ตรวจสอบขนาดหน้าจอและย่อ sidebar อัตโนมัติ
        this.checkScreenSize()
      }
    },
    checkScreenSize() {
      // Mobile (sm-) - ไม่ย่อ sidebar แต่ยังแสดงได้
      if (window.innerWidth < 768) {
        this.sidebarCollapsed = false
      }
      // Tablet (md) - แสดงแต่ย่อ
      else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        this.sidebarCollapsed = true
      }
      // Desktop (lg+) - แสดงแบบเต็ม
      else {
        this.sidebarCollapsed = false
      }
    },
    // Search Methods
    handleSearchKeydown(event) {
      if (event.key === 'Escape') {
        this.hideSearchResults()
        this.$refs.searchInput.blur()
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        this.selectedSearchIndex = Math.min(
          this.selectedSearchIndex + 1,
          this.searchResults.length - 1
        )
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        this.selectedSearchIndex = Math.max(this.selectedSearchIndex - 1, -1)
      } else if (event.key === 'Enter') {
        event.preventDefault()
        if (this.selectedSearchIndex >= 0 && this.searchResults[this.selectedSearchIndex]) {
          this.selectSearchResult(this.searchResults[this.selectedSearchIndex])
        }
      }
    },
    hideSearchResults() {
      // ใช้ setTimeout เพื่อให้ click event ทำงานก่อน
      setTimeout(() => {
        this.showSearchResults = false
        this.selectedSearchIndex = -1
      }, 150)
    },
    selectSearchResult(result) {
      this.closeMobileSearch()

      if (result.type === 'page') {
        this.router.push(result.path)
      }
    },
    toggleMobileSearch() {
      this.mobileSearchOpen = !this.mobileSearchOpen
      if (this.mobileSearchOpen) {
        this.$nextTick(() => {
          this.$refs.mobileSearchInput?.focus()
        })
      } else {
        this.closeMobileSearch()
      }
    },
    closeMobileSearch() {
      this.mobileSearchOpen = false
      // ล้างค่าค้นหาเมื่อปิด modal
      this.searchQuery = ''
      this.showSearchResults = false
      this.selectedSearchIndex = -1
    }
  },
  mounted() {
    // ตรวจสอบว่ามีสาขาที่เลือกแล้วหรือไม่
    this.checkSelectedBranch()

    // ฟังการเปลี่ยนแปลงขนาดหน้าจอ
    window.addEventListener('resize', this.checkScreenSize)

    // Click outside to close user menu
    this._onClickOutside = e => {
      const el = this.$refs.userMenu
      if (!el) return
      if (this.userMenuOpen && !el.contains(e.target)) {
        this.userMenuOpen = false
      }
    }
    window.addEventListener('click', this._onClickOutside)

    // Keyboard shortcut for search (Ctrl+K or Cmd+K)
    this._onKeydown = e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        // เปิด search เฉพาะเมื่อไม่อยู่ในหน้า lobby
        if (this.$route.path !== '/main/lobby') {
          this.$refs.searchInput?.focus()
        }
      }
    }
    window.addEventListener('keydown', this._onKeydown)
  },
  beforeUnmount() {
    // ลบ event listener เมื่อ component ถูกทำลาย
    window.removeEventListener('resize', this.checkScreenSize)
    window.removeEventListener('click', this._onClickOutside)
    window.removeEventListener('keydown', this._onKeydown)
  },
  watch: {
    // ดูการเปลี่ยนแปลงของสาขาที่เลือก
    'authStore.currentBranch'(newBranch) {
      if (this.$route.path === '/main/lobby' || this.authStore.needsBranchAssignment) {
        this.showSidebar = false
      } else {
        this.showSidebar = !!newBranch
        // ตรวจสอบขนาดหน้าจอและย่อ sidebar อัตโนมัติ
        this.checkScreenSize()
      }
    },
    // ดูการเปลี่ยนแปลงของ route
    $route(to) {
      if (to.path === '/main/lobby' || this.authStore.needsBranchAssignment) {
        this.showSidebar = false
      } else {
        this.showSidebar = !!this.authStore.currentBranch
        // ตรวจสอบขนาดหน้าจอและย่อ sidebar อัตโนมัติ
        this.checkScreenSize()
      }
    }
  }
}
</script>
