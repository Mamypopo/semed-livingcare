<template>
  <div class="space-y-6">
    <!-- Header -->
    <!-- Tabs -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200/50">
      <div class="border-b border-slate-200/50 px-6 py-4">
        <nav class="flex space-x-8" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300',
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors',
            ]"
          >
            <component :is="tab.icon" class="w-4 h-4" />
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Tab Content: รายการตรวจ -->
      <div v-if="activeTab === 'items'" class="p-6">
        <!-- Toolbar: Filters & Actions -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-2">
            <!-- Search -->
            <div class="relative">
              <SearchIcon
                class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400"
              />
              <input
                v-model.trim="query"
                @input="onFilterInput"
                type="text"
                placeholder="ค้นหา รหัส/ชื่อ/ชื่อสามัญ/รหัสกรมบัญชีกลาง..."
                class="w-64 px-3 py-2 pl-10 pr-4 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
              />
            </div>

            <!-- Exam Type dropdown -->
            <Listbox v-model="examTypeOption" as="div" class="relative">
              <div>
                <ListboxButton
                  class="px-3 py-2 text-sm bg-white hover:bg-slate-50 text-slate-700 border border-gray-200 rounded-md min-w-40 flex items-center justify-between w-full"
                >
                  <span>{{ examTypeOption.label }}</span>
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
                    v-for="opt in examTypeOptions"
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
          </div>

          <!-- Add button -->
          <button
            @click="openCreateModal"
            class="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-emerald-400 to-teal-400 text-white hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            เพิ่มรายการตรวจ
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600">รหัส</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600">ชื่อรายการ</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600">ประเภท</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600">หมวดหมู่</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600">หน่วย</th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-slate-600">ราคา OPD</th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-slate-600">ราคา IPD</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600">สถานะ</th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-slate-600">จัดการ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <!-- Loading skeleton -->
              <template v-if="loading">
                <tr v-for="n in 6" :key="'skeleton-' + n">
                  <td class="px-4 py-3">
                    <div class="h-4 w-20 bg-gray-100 animate-pulse rounded"></div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="h-4 w-40 bg-gray-100 animate-pulse rounded"></div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="h-4 w-24 bg-gray-100 animate-pulse rounded"></div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="h-4 w-32 bg-gray-100 animate-pulse rounded"></div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="h-4 w-16 bg-gray-100 animate-pulse rounded"></div>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="h-4 w-20 bg-gray-100 animate-pulse rounded ml-auto"></div>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="h-4 w-20 bg-gray-100 animate-pulse rounded ml-auto"></div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="h-5 w-20 bg-gray-100 animate-pulse rounded-full"></div>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="h-8 w-32 bg-gray-100 animate-pulse rounded ml-auto"></div>
                  </td>
                </tr>
              </template>

              <!-- Empty state -->
              <tr v-else-if="items.length === 0">
                <td colspan="9" class="px-4 py-10 text-center text-slate-500 text-sm">
                  <div class="flex flex-col items-center">
                    <Stethoscope class="w-12 h-12 text-slate-300 mb-4" />
                    <p class="text-lg font-medium text-slate-800 mb-2">ไม่มีข้อมูลรายการตรวจ</p>
                    <p class="text-sm text-slate-600">เริ่มต้นด้วยการเพิ่มรายการตรวจใหม่</p>
                  </div>
                </td>
              </tr>
              <tr v-else v-for="item in items" :key="item.id" class="hover:bg-slate-50 transition-colors">
                <td class="px-4 py-3 text-sm font-semibold text-slate-800">{{ item.code }}</td>
                <td class="px-4 py-3 text-sm text-slate-700">{{ item.name }}</td>
                <td class="px-4 py-3 text-sm text-slate-700">{{ mapExamType(item.examType) }}</td>
                <td class="px-4 py-3 text-sm text-slate-700">{{ item.category?.name || '-' }}</td>
                <td class="px-4 py-3 text-sm text-slate-700">{{ item.unit || '-' }}</td>
                <td class="px-4 py-3 text-sm text-right text-slate-700">{{ formatMoney(item.priceOpd) }}</td>
                <td class="px-4 py-3 text-sm text-right text-slate-700">{{ formatMoney(item.priceIpd) }}</td>
                <td class="px-4 py-3 text-sm">
                  <span
                    :class="
                      item.isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    "
                    class="px-2 py-1 rounded-md text-xs font-medium"
                  >
                    {{ item.isActive ? 'ใช้งาน' : 'ปิดใช้งาน' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      v-if="item.examType === 'PACKAGE'"
                      @click="openComponentsModal(item)"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-md bg-white transition-colors border-violet-200 text-violet-700 hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      title="จัดการส่วนประกอบ"
                    >
                      <Package class="w-3.5 h-3.5" />
                      จัดการส่วนประกอบ
                    </button>
                    <button
                      @click="openEditModal(item)"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-md bg-white transition-colors border-sky-200 text-sky-700 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      title="แก้ไข"
                    >
                      <Pencil class="w-3.5 h-3.5" />
                      แก้ไข
                    </button>
                    <button
                      @click="toggleActive(item)"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-md ml-2 transition-colors"
                      :class="
                        item.isActive
                          ? 'border-orange-200 bg-white text-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500'
                          : 'border-green-200 bg-white text-green-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500'
                      "
                      :title="item.isActive ? 'ปิดใช้งาน' : 'เปิดใช้งาน'"
                    >
                      <ToggleRight v-if="item.isActive" class="w-3.5 h-3.5" />
                      <ToggleLeft v-else class="w-3.5 h-3.5" />
                      {{ item.isActive ? 'ปิดใช้งาน' : 'เปิดใช้งาน' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer: pagination -->
        <div
          class="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-b-lg border-t border-gray-100 text-sm"
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

      <!-- Tab Content: รายการวินิจฉัย (ICD10) -->
      <div v-if="activeTab === 'diagnosis'" class="p-6">
        <Icd10Tab />
      </div>
    </div>

    <!-- Medical Item Modal -->
    <MedicalItemModal
      v-model="modalOpen"
      :initialData="editingItem"
      :loading="modalLoading"
      @save="handleSave"
      @update:modelValue="onModalClose"
    />

    <!-- Package Components Modal -->
    <PackageComponentsModal
      v-if="selectedPackageId"
      v-model="showComponentsModal"
      :parent-item-id="selectedPackageId"
      @updated="onComponentsUpdated"
    />
  </div>
</template>

<script>
import {
  Search as SearchIcon,
  Pencil,
  Stethoscope,
  ToggleRight,
  ToggleLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  ClipboardList,
  Package
} from 'lucide-vue-next'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import medicalItemService from '@/services/medical-item.js'
import MedicalItemModal from '@/views/medical/components/modals/MedicalItemModal.vue'
import PackageComponentsModal from '@/views/medical/components/modals/PackageComponentsModal.vue'
import Icd10Tab from '@/views/medical/components/Icd10Tab.vue'
import Swal from 'sweetalert2'

export default {
  name: 'MedicalItemsPage',
  components: {
    SearchIcon,
    Pencil,
    Stethoscope,
    ToggleRight,
    ToggleLeft,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    FileText,
    ClipboardList,
    Package,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    MedicalItemModal,
    PackageComponentsModal,
    Icd10Tab
  },
  data() {
    return {
      activeTab: 'items',
      tabs: [
        { id: 'items', name: 'รายการตรวจ', icon: ClipboardList },
        { id: 'diagnosis', name: 'รายการวินิจฉัย', icon: FileText }
      ],
      query: '',
      searchQuery: '', // สำหรับ debounce
      loading: false,
      modalOpen: false,
      modalLoading: false,
      editingItem: null,
      items: [],
      meta: { page: 1, totalPages: 1, total: 0 },
      searchTimer: null,
      showComponentsModal: false,
      selectedPackageId: null,

      // Filter options
      examTypeOption: { label: 'ทั้งหมด', value: '' },
      examTypeOptions: [
        { label: 'ทั้งหมด', value: '' },
        { label: 'ตรวจทั่วไป', value: 'GENERAL' },
        { label: 'Lab', value: 'LAB' },
        { label: 'X-Ray', value: 'XRAY' },
        { label: 'ชุดรายการ', value: 'PACKAGE' }
      ],

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
      if (this.pageSizeOption.value <= 0) return 1
      return Math.max(1, Math.ceil(this.meta.total / this.pageSizeOption.value))
    },
    from() {
      if (this.meta.total === 0) return 0
      return (this.meta.page - 1) * this.pageSizeOption.value + 1
    },
    to() {
      return Math.min(this.meta.page * this.pageSizeOption.value, this.meta.total)
    },
    itemParams() {
      return {
        search: this.searchQuery || undefined,
        examType: this.examTypeOption.value || undefined,
        isActive: this.statusOption.value === '' ? undefined : this.statusOption.value,
        page: this.meta.page,
        limit: this.pageSizeOption.value
      }
    }
  },
  methods: {
    onFilterInput() {
      // Debounce search
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.searchQuery = this.query
        this.meta.page = 1
      }, 500)
    },
    async loadItems() {
      try {
        this.loading = true
        const params = this.itemParams

        const response = await medicalItemService.list(params)

        this.items = response.data || []
        this.meta.total = response.pagination?.total || 0
        this.meta.totalPages = response.pagination?.totalPages || 1
        this.meta.page = response.pagination?.page || this.meta.page
      } catch (error) {
        console.error('Error loading items:', error)
        this.items = []
        this.meta.total = 0
        this.meta.totalPages = 1

        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถโหลดข้อมูลรายการตรวจได้'
        })
      } finally {
        this.loading = false
      }
    },
    openCreateModal() {
      this.editingItem = null
      this.modalOpen = true
    },
    openEditModal(item) {
      this.editingItem = { ...item }
      this.modalOpen = true
    },
    onModalClose(isOpen) {
      if (!isOpen) {
        this.editingItem = null
        this.modalLoading = false
      }
    },
    async handleSave(payload) {
      const isEdit = !!payload.id
      const confirm = await Swal.fire({
        title: isEdit ? 'ยืนยันการแก้ไขรายการตรวจ?' : 'ยืนยันการสร้างรายการตรวจ?',
        text: isEdit ? `ต้องการบันทึกการเปลี่ยนแปลงของ "${payload.name}" หรือไม่` : `ต้องการสร้างรายการตรวจ "${payload.name}" หรือไม่`,
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
          await medicalItemService.update(payload.id, payload)
          this.modalOpen = false
          this.modalLoading = false
          Swal.fire({ icon: 'success', title: 'แก้ไขสำเร็จ', timer: 1400, showConfirmButton: false, toast: true, position: 'top-end' })
        } else {
          // สร้างใหม่
          const data = { ...payload }
          delete data.id
          await medicalItemService.create(data)
          this.modalOpen = false
          this.modalLoading = false
          Swal.fire({ icon: 'success', title: 'สร้างสำเร็จ', timer: 1400, showConfirmButton: false, toast: true, position: 'top-end' })
        }
        await this.loadItems()
      } catch (e) {
        this.modalLoading = false
        Swal.fire({ icon: 'error', title: 'บันทึกไม่สำเร็จ', text: e?.response?.data?.message || e.message })
      }
    },
    async toggleActive(item) {
      const desired = !item.isActive
      const res = await Swal.fire({
        title: desired ? 'เปิดใช้งานรายการตรวจ?' : 'ปิดใช้งานรายการตรวจ?',
        text: `${desired ? 'เปิดให้ใช้งาน' : 'ปิดการใช้งาน'} "${item.name}" หรือไม่`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: desired ? 'เปิดใช้งาน' : 'ปิดใช้งาน',
        cancelButtonText: 'ยกเลิก',
        reverseButtons: true
      })
      if (!res.isConfirmed) return

      try {
        await medicalItemService.toggleActive(item.id)
        Swal.fire({
          icon: 'success',
          title: desired ? 'เปิดใช้งานแล้ว' : 'ปิดใช้งานแล้ว',
          timer: 1200,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        })
        await this.loadItems()
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'อัปเดตสถานะไม่สำเร็จ',
          text: error?.response?.data?.message || error.message || 'กรุณาลองใหม่อีกครั้ง'
        })
      }
    },
    go(page) {
      if (page < 1 || page > this.totalPages) return
      this.meta.page = page
    },
    mapExamType(t) {
      const m = {
        GENERAL: 'ตรวจทั่วไป',
        LAB: 'Lab',
        XRAY: 'X-Ray',
        PACKAGE: 'ชุดรายการ'
      }
      return m[t] || t
    },
    formatMoney(v) {
      if (v === null || v === undefined) return '-'
      const n = Number(v)
      if (Number.isNaN(n)) return '-'
      return n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    openComponentsModal(item) {
      if (!item || !item.id || item.examType !== 'PACKAGE') return
      // Set selectedPackageId ก่อน แล้วค่อยเปิด modal เพื่อให้ component render และรับ prop ก่อน
      this.selectedPackageId = item.id
      this.$nextTick(() => {
        this.showComponentsModal = true
      })
    },
    onComponentsUpdated() {
      // Reload items when components are updated
      this.loadItems()
    }
  },
  watch: {
    itemParams: {
      handler(newParams, oldParams) {
        if (JSON.stringify(newParams) !== JSON.stringify(oldParams)) {
          this.loadItems()
        }
      },
      deep: true,
      immediate: false
    },
    'pageSizeOption.value'() {
      this.meta.page = 1
    },
    searchQuery(newQuery, oldQuery) {
      if (newQuery !== oldQuery) {
        // This will trigger itemParams watcher automatically
      }
    }
  },
  mounted() {
    this.loadItems()
    // ไม่ต้องโหลด ICD10 ทันที เนื่องจาก default tab เป็น 'items'
  },
  beforeUnmount() {
    // Cleanup search timer
    if (this.searchTimer) {
      clearTimeout(this.searchTimer)
    }
  }
}
</script>
