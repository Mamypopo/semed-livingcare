<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <p class="text-md text-slate-600">จัดการข้อมูลแผนกทั้งหมดในระบบ</p>
      </div>
      <div class="flex items-center gap-2">
        <div class="relative">
          <SearchIcon
            class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400"
          />
          <input
            v-model.trim="query"
            @input="onFilterInput"
            type="text"
            placeholder="ค้นหาชื่อแผนก..."
            class="w-56 px-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm pl-10 pr-4 bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
          />
        </div>
        <!-- Status dropdown -->
        <Listbox v-model="statusOption" as="div" class="relative">
          <div>
            <ListboxButton
              class="px-3 py-2 text-sm bg-white hover:bg-slate-50 text-slate-700 border border-gray-200 rounded-md min-w-40 flex items-center justify-between w-full"
            >
              <span>{{ statusOption.label }}</span>
              <ChevronDown class="w-4 h-4 opacity-60" />
            </ListboxButton>
          </div>
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <ListboxOptions
              class="absolute right-0 mt-2 z-50 p-2 shadow-xl bg-white rounded-xl border border-gray-200/50 w-48 focus:outline-none"
            >
              <ListboxOption
                v-for="opt in statusOptions"
                :key="String(opt.value)"
                :value="opt"
                v-slot="{ active, selected }"
              >
                <li
                  :class="[
                    'px-3 py-2 text-sm rounded-lg cursor-pointer flex items-center justify-between transition-colors',
                    active ? 'bg-emerald-50 text-slate-800' : 'text-slate-700 hover:bg-slate-50',
                  ]"
                >
                  <span>{{ opt.label }}</span>
                  <span v-if="selected" class="text-emerald-500 text-xs">เลือก</span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </Listbox>

        <!-- Page size -->
        <Listbox v-model="pageSizeOption" as="div" class="relative">
          <div>
            <ListboxButton
              class="px-4 py-2 text-sm bg-white border hover:bg-slate-50 text-slate-700 border-gray-200 rounded-md flex items-center gap-2"
            >
              <span>{{ pageSizeOption.label }}</span>
              <ChevronDown class="w-3.5 h-3.5 opacity-60" />
            </ListboxButton>
          </div>
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <ListboxOptions
              class="absolute right-0 mt-2 z-50 p-1.5 shadow-xl bg-white rounded-lg border border-gray-200/50 w-32 focus:outline-none"
            >
              <ListboxOption
                v-for="opt in pageSizeOptions"
                :key="opt.value"
                :value="opt"
                v-slot="{ active, selected }"
              >
                <li
                  :class="[
                    'px-2 py-1.5 text-sm rounded cursor-pointer flex items-center justify-between transition-colors',
                    active ? 'bg-emerald-50 text-slate-800' : 'text-slate-700 hover:bg-slate-50',
                  ]"
                >
                  <span>{{ opt.label }}</span>
                  <span v-if="selected" class="text-emerald-500 text-xs">เลือก</span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </Listbox>

        <!-- Add button -->
        <button
          @click="openCreateModal"
          class="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-emerald-400 to-teal-400 text-white hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          เพิ่มแผนก
        </button>
      </div>
    </div>


    <!-- Table Card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200/50 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                ชื่อแผนก
              </th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600">สถานะ</th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600">วันที่สร้าง</th>
              <th class="px-4 py-2 text-right text-xs font-semibold text-slate-600">จัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="loading" class="animate-pulse">
              <td colspan="4" class="px-4 py-3 text-center text-slate-500">
                <div class="flex items-center justify-center">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
                  <span class="ml-2">กำลังโหลด...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="departments.length === 0">
              <td colspan="4" class="px-4 py-10 text-center text-slate-500 text-sm">
                <div class="flex flex-col items-center">
                  <Building class="w-12 h-12 text-slate-300 mb-4" />
                  <p class="text-lg font-medium text-slate-800 mb-2">ไม่มีข้อมูลแผนก</p>
                  <p class="text-sm text-slate-600">เริ่มต้นด้วยการเพิ่มแผนกใหม่</p>
                </div>
              </td>
            </tr>
            <tr v-else v-for="department in departments" :key="department.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-4 py-2 text-sm text-slate-800 font-medium">
                <div class="flex items-center">
                  <div class="p-2 bg-emerald-50 rounded-lg mr-3 border border-emerald-100">
                    <Building class="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div class="text-sm font-medium text-slate-800">{{ department.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-2 text-sm">
                <span
                  :class="
                    department.isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-gray-100 text-gray-600'
                  "
                  class="px-2 py-1 rounded-md text-xs font-medium"
                >
                  {{ department.isActive ? 'ใช้งาน' : 'ปิดใช้งาน' }}
                </span>
              </td>
              <td class="px-4 py-2 text-sm text-slate-700 whitespace-nowrap">
                {{ formatDate(department.createdAt) }}
              </td>
              <td class="px-4 py-2 text-sm text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="openEditModal(department)"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-md bg-white transition-colors border-sky-200 text-sky-700 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    title="แก้ไข"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                    แก้ไข
                  </button>
                  <button
                    @click="toggleActive(department)"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-md ml-2 transition-colors"
                    :class="
                      department.isActive
                        ? 'border-orange-200 bg-white text-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500'
                        : 'border-green-200 bg-white text-green-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500'
                    "
                    :title="department.isActive ? 'ปิดใช้งาน' : 'เปิดใช้งาน'"
                  >
                    <ToggleRight v-if="department.isActive" class="w-3.5 h-3.5" />
                    <ToggleLeft v-else class="w-3.5 h-3.5" />
                    {{ department.isActive ? 'ปิดใช้งาน' : 'เปิดใช้งาน' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Footer: pagination -->
    <div
      v-if="!loading && departments.length > 0"
      class="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-gray-100 text-sm"
    >
      <div class="text-slate-600">
        แสดง
        <span class="mx-1 text-slate-800 font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span>
        -
        <span class="mx-1 text-slate-800 font-medium">{{ Math.min(currentPage * pageSize, total) }}</span>
        จากทั้งหมด
        <span class="mx-1 text-slate-800 font-medium">{{ total }}</span>
        รายการ
      </div>
      <div class="flex items-center gap-2">
        <button
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded-md bg-white text-slate-700 hover:bg-slate-50 hover:border-gray-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage <= 1 || loading"
          @click="goToPage(currentPage - 1)"
        >
          <ChevronLeft class="w-3.5 h-3.5" />
          ก่อนหน้า
        </button>
        <span
          class="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-md text-slate-700"
        >
          หน้า <span class="text-slate-800 font-medium">{{ currentPage }}</span> / {{ totalPages }}
        </span>
        <button
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded-md bg-white text-slate-700 hover:bg-slate-50 hover:border-gray-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage >= totalPages || loading"
          @click="goToPage(currentPage + 1)"
        >
          ถัดไป
          <ChevronRight class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Department Modal -->
    <DepartmentModal
      v-model="modalOpen"
      :initialData="editingDepartment"
      :loading="modalLoading"
      @save="handleSave"
      @update:modelValue="onModalClose"
    />
  </div>
</template>

<script>
import { 
  Search, 
  Pencil, 
  Building,
  ToggleRight,
  ToggleLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import DepartmentModal from './components/modals/DepartmentModal.vue'
import departmentService from '@/services/department.js'
import Swal from 'sweetalert2'

export default {
  name: 'DepartmentsPage',
  components: {
    SearchIcon: Search,
    Pencil,
    Building,
    ToggleRight,
    ToggleLeft,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    DepartmentModal
  },
  data() {
    return {
      query: '',
      searchQuery: '', // สำหรับ debounce
      loading: false,
      modalOpen: false,
      modalLoading: false,
      editingDepartment: null,
      departments: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      searchTimer: null,
      
      // Filter options
      statusOption: { label: 'ทั้งหมด', value: '' },
      statusOptions: [
        { label: 'ทั้งหมด', value: '' },
        { label: 'ใช้งาน', value: true },
        { label: 'ปิดใช้งาน', value: false }
      ],

      // Pagination options
      pageSizeOption: { label: '10 ต่อหน้า', value: 10 },
      pageSizeOptions: [
        { label: '10 ต่อหน้า', value: 10 },
        { label: '20 ต่อหน้า', value: 20 },
        { label: '50 ต่อหน้า', value: 50 },
        { label: '100 ต่อหน้า', value: 100 }
      ]
    }
  },
  computed: {
    totalPages() {
      return Math.max(1, Math.ceil(this.total / this.pageSize))
    },
    visiblePages() {
      const pages = []
      const start = Math.max(1, this.currentPage - 2)
      const end = Math.min(this.totalPages, this.currentPage + 2)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    },
    departmentParams() {
      return {
        search: this.searchQuery || undefined,
        isActive: this.statusOption.value === '' ? undefined : this.statusOption.value,
        page: this.currentPage,
        pageSize: this.pageSizeOption.value
      }
    }
  },
  methods: {
    onFilterInput() {
      // Debounce search
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.searchQuery = this.query
        this.currentPage = 1
      }, 500)
    },
    async loadDepartments() {
      try {
        this.loading = true
        const params = this.departmentParams
        
        const response = await departmentService.getAll(params)
        
        this.departments = response.data
        this.total = response.meta.total
        this.currentPage = response.meta.page
        this.pageSize = response.meta.pageSize
      } catch (error) {
        console.error('Error loading departments:', error)
        this.departments = []
        this.total = 0
        
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถโหลดข้อมูลแผนกได้'
        })
      } finally {
        this.loading = false
      }
    },
    openCreateModal() {
      this.editingDepartment = null
      this.modalOpen = true
    },
    openEditModal(department) {
      this.editingDepartment = { ...department }
      this.modalOpen = true
    },
    onModalClose(isOpen) {
      if (!isOpen) {
        // Modal ปิด - reset editingDepartment
        this.editingDepartment = null
        this.modalLoading = false
      }
    },
    async handleSave(data) {
      // Confirm before action
      const isEdit = !!data.id
      const confirm = await Swal.fire({
        title: isEdit ? 'ยืนยันการแก้ไขแผนก?' : 'ยืนยันการสร้างแผนกใหม่?',
        text: isEdit
          ? `ต้องการบันทึกการเปลี่ยนแปลงของ "${data.name}" หรือไม่`
          : `ต้องการสร้างแผนก "${data.name}" หรือไม่`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'บันทึก',
        cancelButtonText: 'ยกเลิก',
        reverseButtons: true,
      })
      if (!confirm.isConfirmed) return

      this.modalLoading = true
      try {
        if (isEdit) {
          await departmentService.update(data.id, data)
          this.modalOpen = false
          this.modalLoading = false
          Swal.fire({
            icon: 'success',
            title: 'แก้ไขแผนกสำเร็จ',
            timer: 1600,
            showConfirmButton: false,
            toast: true,
            position: 'top-end',
          })
          await this.loadDepartments()
        } else {
          await departmentService.create(data)
          this.modalOpen = false
          this.modalLoading = false
          Swal.fire({
            icon: 'success',
            title: 'สร้างแผนกสำเร็จ',
            timer: 1600,
            showConfirmButton: false,
            toast: true,
            position: 'top-end',
          })
          await this.loadDepartments()
        }
      } catch (e) {
        this.modalLoading = false
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: e?.response?.data?.message || e.message || 'ไม่สามารถบันทึกข้อมูลได้',
        })
      }
    },
    async toggleActive(department) {
      const desired = !department.isActive
      const res = await Swal.fire({
        title: desired ? 'เปิดใช้งานแผนก?' : 'ปิดใช้งานแผนก?',
        text: `${desired ? 'เปิดให้ใช้งาน' : 'ปิดการใช้งาน'} "${department.name}" หรือไม่`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: desired ? 'เปิดใช้งาน' : 'ปิดใช้งาน',
        cancelButtonText: 'ยกเลิก',
        reverseButtons: true
      })
      if (!res.isConfirmed) return

      try {
        await departmentService.updateActive(department.id, desired)
        Swal.fire({
          icon: 'success',
          title: desired ? 'เปิดใช้งานแล้ว' : 'ปิดใช้งานแล้ว',
          timer: 1200,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        })
        await this.loadDepartments()
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'อัปเดตสถานะไม่สำเร็จ',
          text: error?.response?.data?.message || error.message || 'กรุณาลองใหม่อีกครั้ง'
        })
      }
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    },
    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  },
  watch: {
    departmentParams: {
      handler(newParams, oldParams) {
        if (JSON.stringify(newParams) !== JSON.stringify(oldParams)) {
          this.loadDepartments()
        }
      },
      deep: true,
      immediate: false
    },
    searchQuery(newQuery, oldQuery) {
      if (newQuery !== oldQuery) {
        // This will trigger departmentParams watcher automatically
      }
    }
  },
  mounted() {
    this.loadDepartments()
  },
  beforeUnmount() {
    // Cleanup search timer
    if (this.searchTimer) {
      clearTimeout(this.searchTimer)
    }
  }
}
</script>