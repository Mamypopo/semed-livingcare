<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <p class="text-md text-slate-600">จัดการข้อมูลกลุ่มลูกค้าทั้งหมดในระบบ</p>
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
            placeholder="ค้นหา ชื่อ/หมายเหตุ..."
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

        <button
          class="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-emerald-400 to-teal-400 text-white hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
          @click="openCreate"
        >
          เพิ่มกลุ่มลูกค้า
        </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200/50 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-slate-50">
            <tr>
              <th
                @click="toggleSort('name')"
                class="px-4 py-2 text-left text-xs font-semibold cursor-pointer select-none text-slate-600"
              >
                <span class="inline-flex items-center"
                  >ชื่อ
                  <ChevronUp
                    v-if="sort === 'name' && order === 'asc'"
                    class="w-3.5 h-3.5 ml-1 text-emerald-400"
                  />
                  <ChevronDown v-else class="w-3.5 h-3.5 ml-1 text-emerald-400" />
                </span>
              </th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600">สี</th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600">ส่วนลด</th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600">สถานะ</th>
              <th
                @click="toggleSort('createdAt')"
                class="px-4 py-2 text-left text-xs font-semibold cursor-pointer select-none text-slate-600"
              >
                <span class="inline-flex items-center"
                  >วันที่สร้าง
                  <ChevronUp
                    v-if="sort === 'createdAt' && order === 'asc'"
                    class="w-3.5 h-3.5 ml-1 text-emerald-400"
                  />
                  <ChevronDown v-else class="w-3.5 h-3.5 ml-1 text-emerald-400" />
                </span>
              </th>
              <th class="px-4 py-2 text-right text-xs font-semibold text-slate-600">จัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <!-- Loading skeleton -->
            <template v-if="loading">
              <tr v-for="n in 6" :key="'skeleton-' + n">
                <td class="px-4 py-3">
                  <div class="h-4 w-32 bg-gray-100 animate-pulse rounded"></div>
                </td>
                <td class="px-4 py-3">
                  <div class="h-4 w-8 bg-gray-100 animate-pulse rounded"></div>
                </td>
                <td class="px-4 py-3">
                  <div class="h-4 w-20 bg-gray-100 animate-pulse rounded"></div>
                </td>
                <td class="px-4 py-3">
                  <div class="h-5 w-20 bg-gray-100 animate-pulse rounded-full"></div>
                </td>
                <td class="px-4 py-3">
                  <div class="h-4 w-24 bg-gray-100 animate-pulse rounded"></div>
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="h-8 w-24 bg-gray-100 animate-pulse rounded ml-auto"></div>
                </td>
              </tr>
            </template>

            <!-- Rows -->
            <template v-if="!loading">
              <tr v-for="group in patientGroups" :key="group.id" class="hover:bg-slate-50 transition-colors">
                <td class="px-4 py-2 text-sm text-slate-800 font-medium">
                  <div class="flex items-center">
                    <div
                      v-if="group.color"
                      class="w-4 h-4 rounded-full mr-3"
                      :style="{ backgroundColor: group.color }"
                    ></div>
                    <div>
                      <div>{{ group.name }}</div>
                      <div v-if="group.note" class="text-xs text-slate-500">{{ group.note }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-2 text-sm text-slate-700">
                  <div
                    v-if="group.color"
                    class="w-6 h-6 rounded-full border border-gray-300"
                    :style="{ backgroundColor: group.color }"
                  ></div>
                  <span v-else class="text-slate-400">-</span>
                </td>
                <td class="px-4 py-2 text-sm text-slate-700">
                  <div v-if="group.discount_type && group.discount_amount">
                    <span v-if="group.discount_type === 'percent'"
                      >{{ group.discount_amount }}%</span
                    >
                    <span v-else>{{ group.discount_amount }} บาท</span>
                  </div>
                  <span v-else class="text-slate-400">-</span>
                </td>
                <td class="px-4 py-2 text-sm">
                  <span
                    :class="
                      group.isActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                    "
                    class="px-2 py-1 rounded-md text-xs font-medium"
                  >
                    {{ group.isActive ? 'ใช้งาน' : 'ปิดใช้งาน' }}
                  </span>
                </td>
                <td class="px-4 py-2 text-sm text-slate-700 whitespace-nowrap">
                  {{ formatDate(group.createdAt) }}
                </td>
                <td class="px-4 py-2 text-sm text-right whitespace-nowrap">
                  <button
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-md bg-white transition-colors border-sky-200 text-sky-700 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    @click="openEdit(group)"
                    v-tooltip:top="'แก้ไข'"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                    แก้ไข
                  </button>
                  <button
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-md ml-2 transition-colors"
                    :class="
                      group.isActive
                        ? 'border-orange-200 bg-white text-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500'
                        : 'border-green-200 bg-white text-green-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500'
                    "
                    @click="toggleActive(group)"
                    v-tooltip:top="group.isActive ? 'ปิดใช้งาน' : 'เปิดใช้งาน'"
                  >
                    <ToggleRight v-if="group.isActive" class="w-3.5 h-3.5" />
                    <ToggleLeft v-else class="w-3.5 h-3.5" />
                    {{ group.isActive ? 'ปิดใช้งาน' : 'เปิดใช้งาน' }}
                  </button>
                </td>
              </tr>
            </template>

            <!-- Empty state -->
            <tr v-if="!loading && patientGroups.length === 0">
              <td colspan="7" class="px-4 py-10 text-center text-slate-500 text-sm">ไม่พบข้อมูล</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer: pagination -->
      <div
        class="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-gray-100 text-sm"
      >
        <div class="text-slate-600">
          แสดง
          <span class="mx-1 text-slate-800 font-medium">{{ from }}</span>
          -
          <span class="mx-1 text-slate-800 font-medium">{{ to }}</span>
          จากทั้งหมด
          <span class="mx-1 text-slate-800 font-medium">{{ meta.total }}</span>
          รายการ
        </div>
        <div class="flex items-center gap-2">
          <button
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded-md bg-white text-slate-700 hover:bg-slate-50 hover:border-gray-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="meta.page <= 1 || loading"
            @click="go(meta.page - 1)"
          >
            <ChevronLeft class="w-3.5 h-3.5" />
            ก่อนหน้า
          </button>
          <span
            class="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-md text-slate-700"
          >
            หน้า <span class="text-slate-800 font-medium">{{ meta.page }}</span> / {{ totalPages }}
          </span>
          <button
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded-md bg-white text-slate-700 hover:bg-slate-50 hover:border-gray-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="meta.page >= totalPages || loading"
            @click="go(meta.page + 1)"
          >
            ถัดไป
            <ChevronRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Reusable Create/Edit Modal -->
    <PatientGroupModal
      v-model="modalOpen"
      :initialData="editingPatientGroup"
      :loading="modalLoading"
      @save="handleSave"
      @update:modelValue="onModalClose"
    />
  </div>
</template>

<script>
import patientGroupService from '@/services/patient-group.js'
import PatientGroupModal from './components/modals/PatientGroupModal.vue'
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Pencil,
  ToggleLeft,
  ToggleRight,
  SearchIcon
} from 'lucide-vue-next'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import Swal from 'sweetalert2'

export default {
  name: 'PatientGroups',
  components: {
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    Pencil,
    ToggleLeft,
    ToggleRight,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    PatientGroupModal,
    SearchIcon
  },
  data() {
    return {
      loading: false,
      query: '',
      searchQuery: '', // สำหรับ debounce
      // Status options
      statusOptions: [
        { label: 'สถานะทั้งหมด', value: '' },
        { label: 'ใช้งาน', value: true },
        { label: 'ปิดใช้งาน', value: false },
      ],
      statusOption: { label: 'สถานะทั้งหมด', value: '' },
      // Page size options
      pageSizeOptions: [
        { label: '10 ต่อหน้า', value: 10 },
        { label: '20 ต่อหน้า', value: 20 },
        { label: '50 ต่อหน้า', value: 50 },
      ],
      pageSizeOption: { label: '10 ต่อหน้า', value: 10 },
      meta: { page: 1, totalPages: 1, total: 0 },
      patientGroups: [],
      typingTimer: null,
      sort: 'createdAt',
      order: 'desc',
      modalOpen: false,
      modalLoading: false,
      editingPatientGroup: null,
    }
  },
  computed: {
    from() {
      if (this.meta.total === 0) return 0
      return (this.meta.page - 1) * this.pageSizeOption.value + 1
    },
    to() {
      return Math.min(this.meta.page * this.pageSizeOption.value, this.meta.total)
    },
    totalPages() {
      if (this.pageSizeOption.value <= 0) return 1
      return Math.max(1, Math.ceil(this.meta.total / this.pageSizeOption.value))
    },
    isActive() {
      return this.statusOption.value
    },
    // Best Practice: Centralized parameters for API calls
    patientGroupParams() {
      return {
        page: this.meta.page,
        pageSize: this.pageSizeOption.value,
        search: this.searchQuery || undefined,
        isActive: this.isActive === '' ? undefined : this.isActive,
        sort: this.sort,
        order: this.order
      }
    }
  },
  methods: {
    async reload() {
      this.loading = true
      try {
        // Best Practice: Use computed property
        const params = this.patientGroupParams
        
        const { data, meta } = await patientGroupService.getAll(params)
        this.patientGroups = data
        this.meta = meta
      } finally {
        this.loading = false
      }
    },
    toggleSort(field) {
      if (this.sort === field) {
        this.order = this.order === 'asc' ? 'desc' : 'asc'
      } else {
        this.sort = field
        this.order = 'asc'
      }
      this.meta.page = 1
    },
    formatDate(iso) {
      if (!iso) return '-'
      const d = new Date(iso)
      return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: '2-digit' })
    },
    onFilterInput() {
      clearTimeout(this.typingTimer)
      this.typingTimer = setTimeout(() => {
        this.searchQuery = this.query
        this.meta.page = 1
      }, 500)
    },
    go(p) {
      if (p < 1 || p > this.totalPages) return
      this.meta.page = p
    },
    async openCreate() {
      this.editingPatientGroup = null
      this.modalOpen = true
    },
    openEdit(group) {
      this.editingPatientGroup = { ...group }
      this.modalOpen = true
    },
    onModalClose(isOpen) {
      if (!isOpen) {
        // Modal ปิด - reset editingPatientGroup
        this.editingPatientGroup = null
        this.modalLoading = false
      }
    },
    async handleSave(data) {
      // Confirm before action
      const isEdit = !!data.id
      const confirm = await Swal.fire({
        title: isEdit ? 'ยืนยันการแก้ไขกลุ่มลูกค้า?' : 'ยืนยันการสร้างกลุ่มลูกค้าใหม่?',
        text: isEdit
          ? `ต้องการบันทึกการเปลี่ยนแปลงของ "${data.name}" หรือไม่`
          : `ต้องการสร้างกลุ่มลูกค้า "${data.name}" หรือไม่`,
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
          const res = await patientGroupService.update(data.id, data)
          this.modalOpen = false
          this.modalLoading = false
          Swal.fire({
            icon: 'success',
            title: 'แก้ไขกลุ่มลูกค้าสำเร็จ',
            timer: 1600,
            showConfirmButton: false,
            toast: true,
            position: 'top-end',
          })
          await this.reload()
        } else {
          const res = await patientGroupService.create(data)
          this.modalOpen = false
          this.modalLoading = false
          Swal.fire({
            icon: 'success',
            title: 'สร้างกลุ่มลูกค้าสำเร็จ',
            timer: 1600,
            showConfirmButton: false,
            toast: true,
            position: 'top-end',
          })
          await this.reload()
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
    async toggleActive(group) {
      const desired = !group.isActive
      const res = await Swal.fire({
        title: desired ? 'เปิดใช้งานกลุ่มลูกค้า?' : 'ปิดใช้งานกลุ่มลูกค้า?',
        text: `${desired ? 'เปิดให้ใช้งาน' : 'ปิดการใช้งาน'} "${group.name}" หรือไม่`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: desired ? 'เปิดใช้งาน' : 'ปิดใช้งาน',
        cancelButtonText: 'ยกเลิก',
        reverseButtons: true,
      })
      if (!res.isConfirmed) return

      try {
        await patientGroupService.updateActive(group.id, desired)
        Swal.fire({
          icon: 'success',
          title: desired ? 'เปิดใช้งานแล้ว' : 'ปิดใช้งานแล้ว',
          timer: 1200,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        })
        await this.reload()
      } catch (e) {
        Swal.fire({
          icon: 'error',
          title: 'อัปเดตสถานะไม่สำเร็จ',
          text: e?.response?.data?.message || e.message || 'กรุณาลองใหม่อีกครั้ง',
        })
      }
    },
  },
  mounted() {
    this.reload()
  },
  beforeUnmount() {
    // Cleanup timers
    if (this.typingTimer) {
      clearTimeout(this.typingTimer)
    }
  },
  watch: {
    patientGroupParams: {
      handler(newParams, oldParams) {
        if (JSON.stringify(newParams) !== JSON.stringify(oldParams)) {
          this.reload()
        }
      },
      deep: true,
      immediate: false
    },
    searchQuery(newQuery, oldQuery) {
      if (newQuery !== oldQuery) {
        // This will trigger patientGroupParams watcher automatically
      }
    }
  }
}
</script>
