<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">รายชื่อลูกค้า</h1>
        <p class="text-md text-gray-500">จัดการข้อมูลลูกค้าทั้งหมดในระบบ</p>
      </div>
      <div class="flex items-center gap-2">
        <div class="relative">
          <SearchIcon
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  />
        <input
          v-model.trim="query"
          @input="onFilterInput"
          type="text"
          placeholder="ค้นหา HN, ชื่อ, เบอร์โทร, อีเมล..."
          class="w-64 px-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm pl-10 pr-4 
       bg-white text-gray-700 placeholder-gray-400 
       focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80
       focus:outline-none transition-colors duration-200 hover:border-emerald-400"
        />
      </div>
        <!-- Status dropdown -->
        <Listbox v-model="statusOption" as="div" class="relative">
          <div>
            <ListboxButton
              class="px-3 py-2 text-sm bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-md min-w-40 flex items-center justify-between w-full"
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
              class="absolute right-0 mt-2 z-50 p-2 shadow-xl bg-white rounded-xl border border-gray-100 w-48 focus:outline-none"
            >
              <ListboxOption
                v-for="opt in statusOptions"
                :key="String(opt.value)"
                :value="opt"
                v-slot="{ active, selected }"
              >
                <li
                  :class="[
                    'px-3 py-2 text-sm rounded-lg cursor-pointer flex items-center justify-between',
                    active ? 'bg-emerald-50 text-gray-900' : 'text-gray-700'
                  ]"
                >
                  <span>{{ opt.label }}</span>
                  <span v-if="selected" class="text-emerald-600 text-xs">เลือก</span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </Listbox>

        <!-- Page size -->
        <Listbox v-model="pageSizeOption" as="div" class="relative">
          <div>
            <ListboxButton
              class="px-4 py-2 text-sm bg-white border hover:bg-gray-50 text-gray-700 border-gray-200 rounded-md flex items-center gap-2"
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
              class="absolute right-0 mt-2 z-50 p-1.5 shadow-xl bg-white rounded-lg border border-gray-100 w-32 focus:outline-none"
            >
              <ListboxOption
                v-for="opt in pageSizeOptions"
                :key="opt.value"
                :value="opt"
                v-slot="{ active, selected }"
              >
                <li
                  :class="[
                    'px-2 py-1.5 text-sm rounded cursor-pointer flex items-center justify-between',
                    active ? 'bg-emerald-50 text-gray-900' : 'text-gray-700'
                  ]"
                >
                  <span>{{ opt.label }}</span>
                  <span v-if="selected" class="text-emerald-600 text-xs">เลือก</span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </Listbox>

        <button
          class="px-4 py-2 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          @click="openCreate"
        >
          <Plus class="w-4 h-4 inline mr-1" />
          เพิ่มลูกค้า
        </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                @click="toggleSort('hn')"
                class="px-4 py-2 text-left text-xs font-semibold cursor-pointer select-none text-gray-600"
              >
                <span class="inline-flex items-center"
                  >HN
                  <ChevronUp
                    v-if="sort === 'hn' && order === 'asc'"
                    class="w-3.5 h-3.5 ml-1 text-emerald-600"
                  />
                  <ChevronDown v-else class="w-3.5 h-3.5 ml-1 text-emerald-600" />
                </span>
              </th>
              <th
                @click="toggleSort('first_name')"
                class="px-4 py-2 text-left text-xs font-semibold cursor-pointer select-none text-gray-600"
              >
                <span class="inline-flex items-center"
                  >ชื่อ-นามสกุล
                  <ChevronUp
                    v-if="sort === 'first_name' && order === 'asc'"
                    class="w-3.5 h-3.5 ml-1 text-emerald-600"
                  />
                  <ChevronDown v-else class="w-3.5 h-3.5 ml-1 text-emerald-600" />
                </span>
              </th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">เพศ</th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">สาขา</th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">กลุ่มลูกค้า</th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">สถานะ</th>
              <th
                @click="toggleSort('createdAt')"
                class="px-4 py-2 text-left text-xs font-semibold cursor-pointer select-none text-gray-600"
              >
                <span class="inline-flex items-center"
                  >วันที่สร้าง
                  <ChevronUp
                    v-if="sort === 'createdAt' && order === 'asc'"
                    class="w-3.5 h-3.5 ml-1 text-emerald-600"
                  />
                  <ChevronDown v-else class="w-3.5 h-3.5 ml-1 text-emerald-600" />
                </span>
              </th>
              <th class="px-4 py-2 text-right text-xs font-semibold text-gray-600">จัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <!-- Loading skeleton -->
            <template v-if="loading">
              <tr v-for="n in 6" :key="'skeleton-' + n">
                <td class="px-4 py-3">
                  <div class="h-4 w-24 bg-gray-100 animate-pulse rounded"></div>
                </td>
                <td class="px-4 py-3">
                  <div class="h-4 w-32 bg-gray-100 animate-pulse rounded"></div>
                </td>
                <td class="px-4 py-3">
                  <div class="h-4 w-16 bg-gray-100 animate-pulse rounded"></div>
                </td>
              
                <td class="px-4 py-3">
                  <div class="h-4 w-20 bg-gray-100 animate-pulse rounded"></div>
                </td>
                <td class="px-4 py-3">
                  <div class="h-5 w-20 bg-gray-100 animate-pulse rounded-full"></div>
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
              <tr v-for="patient in patients" :key="patient.id" class="hover:bg-gray-50">
                <td class="px-4 py-2 text-sm text-gray-900 font-medium">
                  {{ patient.hn }}
                </td>
                <td class="px-4 py-2 text-sm text-gray-900">
                  <div class="flex items-center">
                    <div>
                      <div class="font-medium">
                        {{ patient.prefix }} {{ patient.first_name }} {{ patient.last_name }}
                      </div>
                      <div v-if="patient.nickname" class="text-xs text-gray-500">
                        ({{ patient.nickname }})
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-2 text-sm text-gray-700">
                  {{ patient.gender }}
                </td>
                <td class="px-4 py-2 text-sm text-gray-700">
                  {{ patient.phone_1 || '-' }}
                </td>
                <td class="px-4 py-2 text-sm text-gray-700">
                  {{ patient.branch?.name || '-' }}
                </td>
                <td class="px-4 py-2 text-sm">
                  <span
                    v-if="patient.patientGroup"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :style="{
                      backgroundColor: patient.patientGroup.color + '20',
                      color: patient.patientGroup.color
                    }"
                  >
                    {{ patient.patientGroup.name }}
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-4 py-2 text-sm">
                  <span
                    :class="
                      patient.isActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                    "
                    class="px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{ patient.isActive ? 'ใช้งาน' : 'ปิดใช้งาน' }}
                  </span>
                </td>
                <td class="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">
                  {{ formatDate(patient.createdAt) }}
                </td>
                <td class="px-4 py-2 text-sm text-right whitespace-nowrap">
                  <!-- Action Buttons Container -->
                  <div class="flex items-center justify-end gap-2">
                    <!-- Edit Button -->
                    <button
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-md bg-white transition-colors border-sky-200 text-sky-700 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      @click="openEdit(patient)"
                      v-tooltip:top="'แก้ไข'"
                    >
                      <Pencil class="w-3.5 h-3.5" />
                      แก้ไข
                    </button>

                    <!-- Action Dropdown -->
                    <div class="relative inline-block text-left">
                      <div>
                        <button
                          @click="toggleActionMenu(patient.id)"
                          :data-patient-id="patient.id"
                          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-md bg-white transition-colors border-gray-200 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          v-tooltip:top="'จัดการ'"
                        >
                          จัดการ
                          <ChevronDown class="w-3 h-3 ml-1" />
                        </button>
                      </div>

                    <!-- Dropdown Menu using Teleport -->
                    <Teleport to="body">
                      <div
                        v-if="activeActionMenu === patient.id"
                        class="fixed z-50 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        :style="getDropdownPosition(patient.id)"
                        @click-outside="closeActionMenu"
                      >
                        <div class="py-1">
                          <button
                            @click="openDetail(patient); closeActionMenu()"
                            class="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            <Eye class="w-4 h-4" />
                            ดูข้อมูล
                          </button>
                          <div class="border-t border-gray-100"></div>
                          <button
                            @click="toggleActive(patient); closeActionMenu()"
                            class="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-700"
                            :class="patient.isActive ? 'text-orange-600' : 'text-green-600'"
                          >
                            <ToggleRight v-if="patient.isActive" class="w-4 h-4" />
                            <ToggleLeft v-else class="w-4 h-4" />
                            {{ patient.isActive ? 'ปิดใช้งาน' : 'เปิดใช้งาน' }}
                          </button>
                        </div>
                      </div>
                    </Teleport>
                  </div>
                </div>
                </td>
              </tr>
            </template>

            <!-- Empty state -->
            <tr v-if="!loading && patients.length === 0">
              <td colspan="9" class="px-4 py-10 text-center text-gray-500 text-sm">
                ไม่พบข้อมูลลูกค้า
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer: pagination -->
      <div
        class="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100 text-sm"
      >
        <div class="text-gray-600">
          แสดง
          <span class="mx-1 text-gray-900 font-medium">{{ from }}</span>
          -
          <span class="mx-1 text-gray-900 font-medium">{{ to }}</span>
          จากทั้งหมด
          <span class="mx-1 text-gray-900 font-medium">{{ meta.total }}</span>
          รายการ
        </div>
        <div class="flex items-center gap-2">
          <button
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded-md bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="meta.page <= 1 || loading"
            @click="go(meta.page - 1)"
          >
            <ChevronLeft class="w-3.5 h-3.5" />
            ก่อนหน้า
          </button>
          <span
            class="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-md text-gray-700"
          >
            หน้า <span class="text-gray-900 font-medium">{{ meta.page }}</span> / {{ totalPages }}
          </span>
          <button
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded-md bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="meta.page >= totalPages || loading"
            @click="go(meta.page + 1)"
          >
            ถัดไป
            <ChevronRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Patient Modal -->
    <PatientModal
      ref="patientModal"
      v-model="modalOpen"
      :initialData="editingPatient"
      :loading="modalLoading"
      :isEditMode="!!editingPatient"
      @save="handleSave"
    />

    <!-- Patient Detail Modal -->
    <PatientDetailModal
      v-model="detailModalOpen"
      :patientData="selectedPatient"
      @queue-opd="handleQueueOPD"
      @queue-ipd="handleQueueIPD"
      @queue-service="handleQueueService"
      @add-receipt="handleAddReceipt"
    />
  </div>
</template>

<script>
import patientService from '@/services/patient.js'
import PatientModal from './components/modals/PatientModal.vue'
import PatientDetailModal from './components/modals/PatientDetailModal.vue'
import {
  Plus,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Pencil,
  ToggleLeft,
  ToggleRight,
  SearchIcon,
  Eye
} from 'lucide-vue-next'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import Swal from 'sweetalert2'

export default {
  name: 'PatientsPage',
  components: {
    Plus,
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
    PatientModal,
    PatientDetailModal,
    SearchIcon,
    Eye
  },
  data() {
    return {
      loading: false,
      query: '',
      // Status options
      statusOptions: [
        { label: 'สถานะทั้งหมด', value: '' },
        { label: 'ใช้งาน', value: true },
        { label: 'ปิดใช้งาน', value: false }
      ],
      statusOption: { label: 'สถานะทั้งหมด', value: '' },
      // Page size options
      pageSize: 10,
      pageSizeOptions: [
        { label: '10 ต่อหน้า', value: 10 },
        { label: '20 ต่อหน้า', value: 20 },
        { label: '50 ต่อหน้า', value: 50 }
      ],
      pageSizeOption: { label: '10 ต่อหน้า', value: 10 },
      meta: { page: 1, totalPages: 1, total: 0 },
      patients: [],
      typingTimer: null,
      sort: 'createdAt',
      order: 'desc',
      modalOpen: false,
      modalLoading: false,
      editingPatient: null,
      detailModalOpen: false,
      selectedPatient: null,
      activeActionMenu: null
    }
  },
  computed: {
    from() {
      if (this.meta.total === 0) return 0
      return (this.meta.page - 1) * this.pageSize + 1
    },
    to() {
      return Math.min(this.meta.page * this.pageSize, this.meta.total)
    },
    totalPages() {
      if (this.pageSize <= 0) return 1
      return Math.max(1, Math.ceil(this.meta.total / this.pageSize))
    },
    isActive() {
      return this.statusOption.value
    }
  },
  methods: {
    async reload() {
      console.log('🔄 Reloading patients with params:', {
        page: this.meta.page,
        limit: this.pageSize,
        search: this.query || '',
        status: this.isActive === '' ? 'all' : this.isActive ? 'active' : 'inactive'
      })
      
      this.loading = true
      try {
        const { data, pagination } = await patientService.getAllPatients({
          page: this.meta.page,
          limit: this.pageSize,
          search: this.query || '',
          status: this.isActive === '' ? 'all' : this.isActive ? 'active' : 'inactive'
        })
        
        console.log('✅ Patients loaded:', data)
        console.log('📊 Pagination:', pagination)
        this.patients = data
        this.meta = {
          page: pagination.page,
          total: pagination.total,
          totalPages: pagination.totalPages
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: error?.response?.data?.message || error.message || 'ไม่สามารถโหลดข้อมูลได้'
        })
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
      this.reload()
    },
    formatDate(iso) {
      if (!iso) return '-'
      const d = new Date(iso)
      return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: '2-digit' })
    },
    onFilterInput() {
      console.log('🔍 Filter input changed:', this.query)
      clearTimeout(this.typingTimer)
      this.typingTimer = setTimeout(() => {
        console.log('⏰ Search timer triggered, reloading...')
        this.meta.page = 1
        this.reload()
      }, 500)
    },
    go(p) {
      if (p < 1 || p > this.totalPages) return
      this.meta.page = p
      this.reload()
    },
    async openCreate() {
      this.editingPatient = null
      this.modalOpen = true
    },
    openEdit(patient) {
      this.editingPatient = { ...patient }
      this.modalOpen = true
    },
    openDetail(patient) {
      this.selectedPatient = { ...patient }
      this.detailModalOpen = true
    },
    handleQueueOPD(patient) {
      console.log('จัดคิว OPD สำหรับ:', patient)
      // TODO: Implement queue OPD functionality
    },
    handleQueueIPD(patient) {
      console.log('จัดคิว IPD สำหรับ:', patient)
      // TODO: Implement queue IPD functionality
    },
    handleQueueService(patient) {
      console.log('จัดคิว บริการ สำหรับ:', patient)
      // TODO: Implement queue service functionality
    },
    handleAddReceipt(patient) {
      console.log('เพิ่มใบเสร็จ สำหรับ:', patient)
      // TODO: Implement add receipt functionality
    },
    toggleActionMenu(patientId) {
      this.activeActionMenu = this.activeActionMenu === patientId ? null : patientId
    },
    closeActionMenu() {
      this.activeActionMenu = null
    },
    getDropdownPosition(patientId) {
      // Find the button element for this patient
      const button = document.querySelector(`[data-patient-id="${patientId}"]`)
      if (!button) return {}
      
      const rect = button.getBoundingClientRect()
      return {
        top: `${rect.bottom + 8}px`,
        left: `${rect.right - 192}px` // 192px = w-48 (12rem)
      }
    },
    async handleSave(data) {
      // Confirm before action
      const isEdit = !!data.id
      const confirm = await Swal.fire({
        title: isEdit ? 'ยืนยันการแก้ไขลูกค้า?' : 'ยืนยันการสร้างลูกค้าใหม่?',
        text: isEdit
          ? `ต้องการบันทึกการเปลี่ยนแปลงของ "${data.first_name} ${data.last_name}" หรือไม่`
          : `ต้องการสร้างลูกค้า "${data.first_name} ${data.last_name}" หรือไม่`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'บันทึก',
        cancelButtonText: 'ยกเลิก',
        reverseButtons: true
      })
      if (!confirm.isConfirmed) return

      this.modalLoading = true
      try {
        if (isEdit) {
          await patientService.updatePatient(data.id, data)
          this.modalOpen = false
          this.modalLoading = false
          Swal.fire({
            icon: 'success',
            title: 'แก้ไขลูกค้าสำเร็จ',
            timer: 1600,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          })
          await this.reload()
        } else {
          const newPatient = await patientService.createPatient(data)
          this.modalLoading = false
          
          // แสดงข้อความถามว่าต้องการเพิ่มไฟล์หรือไม่
          const addFiles = await Swal.fire({
            title: 'สร้างลูกค้าสำเร็จ!',
            text: 'ต้องการเพิ่มไฟล์เอกสารหรือไม่?',
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#14b8a6',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'เพิ่มไฟล์',
            cancelButtonText: 'ปิด',
            reverseButtons: true
          })
          
          if (addFiles.isConfirmed) {
            // เปลี่ยนเป็นโหมดแก้ไขและเปลี่ยนไปที่ Documents Tab
            this.editingPatient = { ...newPatient.data }
            this.modalOpen = true
            // ส่ง event ไปยัง PatientModal เพื่อเปลี่ยน tab
            this.$nextTick(() => {
              this.$refs.patientModal?.switchToDocumentsTab?.()
            })
          } else {
            // ปิด modal
            this.modalOpen = false
            await this.reload()
          }
        }
      } catch (error) {
        this.modalLoading = false
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: error?.response?.data?.message || error.message || 'ไม่สามารถบันทึกข้อมูลได้'
        })
      }
    },
    async toggleActive(patient) {
      const desired = !patient.isActive
      const res = await Swal.fire({
        title: desired ? 'เปิดใช้งานลูกค้า?' : 'ปิดใช้งานลูกค้า?',
        text: `${desired ? 'เปิดให้ใช้งาน' : 'ปิดการใช้งาน'} "${patient.first_name} ${patient.last_name}" หรือไม่`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: desired ? 'เปิดใช้งาน' : 'ปิดใช้งาน',
        cancelButtonText: 'ยกเลิก',
        reverseButtons: true
      })
      if (!res.isConfirmed) return

      try {
        await patientService.updatePatientActive(patient.id, desired)
        Swal.fire({
          icon: 'success',
          title: desired ? 'เปิดใช้งานแล้ว' : 'ปิดใช้งานแล้ว',
          timer: 1200,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        })
        await this.reload()
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'อัปเดตสถานะไม่สำเร็จ',
          text: error?.response?.data?.message || error.message || 'กรุณาลองใหม่อีกครั้ง'
        })
      }
    }
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
    statusOption() {
      this.meta.page = 1
      this.reload()
    },
    pageSizeOption: {
      deep: true,
      handler(newVal) {
        this.pageSize = newVal.value
        this.meta.page = 1
        this.reload()
      }
    }
  }
}
</script>
