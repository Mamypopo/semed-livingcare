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
    <div :class="[
      showSidebar 
        ? (sidebarCollapsed ? 'md:pl-16 lg:pl-16' : 'lg:pl-64') 
        : ''
    ]">
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
              <Menu class="w-5 h-5" />
            </button>

            <!-- Page Title -->
            <div class="flex-1 lg:flex-none">
              <h1 class="text-xl font-semibold text-gray-900">{{ $route.path === '/main/lobby' ? 'SEMed Livingcare' : pageTitle }}</h1>
            </div>

            <!-- Right side items -->
            <div class="flex items-center space-x-4">

              <!-- User Menu (Headless UI) -->
              <HMenu as="div" class="relative inline-block text-left" v-slot="{ open }">
                <div>
                  <MenuButton class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                    <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                      <span class="text-white text-sm font-semibold">{{ userInitial }}</span>
                    </div>
                    <div class="hidden sm:block text-left">
                      <p class="text-sm font-semibold text-gray-900">{{ authStore.userName }}</p>
                      <p class="text-xs text-emerald-600 font-medium">{{ authStore.userRole }}</p>
                    </div>
                    <ChevronDown :class="['w-4 h-4 text-gray-400 transition-transform duration-200', open ? 'rotate-180' : '']" />
                  </MenuButton>
                </div>

                <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                  <MenuItems class="absolute right-0 mt-3 z-50 p-2 shadow-xl bg-white rounded-xl border border-gray-100 w-56 focus:outline-none">
                    <div class="px-1 py-1">
                      <MenuItem v-slot="{ active }">
                        <a :class="[ 'flex text-gray-700 items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer', active ? 'bg-emerald-50' : '' ]">
                          <User class="w-4 h-4" />
                          <span>โปรไฟล์</span>
                        </a>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <a :class="[ 'flex text-gray-700 items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer', active ? 'bg-emerald-50' : '' ]">
                          <Settings class="w-4 h-4" />
                          <span>การตั้งค่า</span>
                        </a>
                      </MenuItem>
                      <div class="my-2 border-t border-gray-200"></div>
                      <MenuItem v-slot="{ active }">
                        <a @click="handleLogout" :class="[ 'flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 transition-colors cursor-pointer', active ? 'bg-red-50' : '' ]">
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
          <div class=" mx-auto px-4 sm:px-6 lg:px-8">
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
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import Swal from 'sweetalert2'
import { 
  Menu, ChevronDown, User, Settings, LogOut
} from 'lucide-vue-next'
import { Menu as HMenu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

export default {
  name: 'MainLayout',
  components: {
    Sidebar,
    Menu, ChevronDown, User, Settings, LogOut,
    HMenu, MenuButton, MenuItems, MenuItem
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
          userMenuOpen: false
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
        }
  },
  mounted() {
    // ตรวจสอบว่ามีสาขาที่เลือกแล้วหรือไม่
    this.checkSelectedBranch()
    
    // ฟังการเปลี่ยนแปลงขนาดหน้าจอ
    window.addEventListener('resize', this.checkScreenSize)
    
    // Click outside to close user menu
    this._onClickOutside = (e) => {
      const el = this.$refs.userMenu
      if (!el) return
      if (this.userMenuOpen && !el.contains(e.target)) {
        this.userMenuOpen = false
      }
    }
    window.addEventListener('click', this._onClickOutside)
  },
  beforeUnmount() {
    // ลบ event listener เมื่อ component ถูกทำลาย
    window.removeEventListener('resize', this.checkScreenSize)
    window.removeEventListener('click', this._onClickOutside)
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
        '$route'(to) {
          if (to.path === '/main/lobby' || this.authStore.needsBranchAssignment) {
            this.showSidebar = false
          } else {
            this.showSidebar = !!this.authStore.currentBranch
            // ตรวจสอบขนาดหน้าจอและย่อ sidebar อัตโนมัติ
            this.checkScreenSize()
          }
        }
      },
  
}
</script>
