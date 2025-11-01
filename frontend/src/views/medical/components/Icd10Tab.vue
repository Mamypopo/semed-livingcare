<template>
  <div class="space-y-6">
    <!-- Filters -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <!-- Search -->
        <div class="relative">
          <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            v-model.trim="query"
            @input="onFilterInput"
            type="text"
            placeholder="ค้นหา รหัส/ชื่อโรค..."
            class="w-64 px-3 py-2 pl-10 pr-4 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
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
      </div>

      <!-- Add button -->
      <button
        @click="openCreate"
        class="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-emerald-400 to-teal-400 text-white hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        เพิ่มรายการวินิจฉัย
      </button>
    </div>

    <!-- ICD10 Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200/50 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600">รหัส ICD10</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600">ชื่อโรค (ไทย)</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600">ชื่อโรค (อังกฤษ)</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600">หมวดหมู่</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600">รหัสกลุ่ม</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600">สถานะ</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-slate-600">จัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <!-- Loading skeleton -->
            <template v-if="loading">
              <tr v-for="n in 6" :key="'skeleton-diagnosis-' + n">
                <td class="px-4 py-3">
                  <div class="h-4 w-24 bg-gray-100 animate-pulse rounded"></div>
                </td>
                <td class="px-4 py-3">
                  <div class="h-4 w-64 bg-gray-100 animate-pulse rounded"></div>
                </td>
                <td class="px-4 py-3">
                  <div class="h-4 w-64 bg-gray-100 animate-pulse rounded"></div>
                </td>
                <td class="px-4 py-3">
                  <div class="h-5 w-28 bg-gray-100 animate-pulse rounded-full"></div>
                </td>
                <td class="px-4 py-3">
                  <div class="h-4 w-20 bg-gray-100 animate-pulse rounded"></div>
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
              <td colspan="8" class="px-4 py-10 text-center text-slate-500 text-sm">ไม่พบข้อมูล</td>
            </tr>

            <!-- Data rows -->
            <tr v-else v-for="item in items" :key="item.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-4 py-3 text-sm font-semibold text-slate-800 whitespace-nowrap">{{ item.code }}</td>
              <td class="px-4 py-3 text-sm text-slate-700">
                <div class="line-clamp-2">{{ item.nameTh }}</div>
              </td>
              <td class="px-4 py-3 text-sm text-slate-700">
                <div class="line-clamp-2">{{ item.nameEn || '-' }}</div>
              </td>
              <td class="px-4 py-3 text-sm text-slate-700">
                <span v-if="item.category?.name" class="text-slate-800">
                  {{ item.category.name }}
                </span>
                <span v-else class="text-slate-400">-</span>
              </td>
              <td class="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">{{ item.groupCode || '-' }}</td>
           
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
                    @click="openEdit(item)"
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

    <!-- ICD10 Modal -->
    <Icd10Modal
      v-model="modalOpen"
      :initialData="editing"
      :loading="modalLoading"
      @save="handleSave"
      @update:modelValue="onModalClose"
    />
  </div>
</template>

<script>
import {
  Search as SearchIcon,
  Pencil,
  ToggleRight,
  ToggleLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-vue-next'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import icd10Service from '@/services/icd10.js'
import Icd10Modal from '@/views/medical/components/modals/Icd10Modal.vue'
import Swal from 'sweetalert2'

export default {
  name: 'Icd10Tab',
  components: {
    SearchIcon,
    Pencil,
    ToggleRight,
    ToggleLeft,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    Icd10Modal,
  },
  data() {
    return {
      query: '',
      searchQuery: '', // สำหรับ debounce
      loading: false,
      items: [],
      meta: { page: 1, totalPages: 1, total: 0 },
      searchTimer: null,
      modalOpen: false,
      modalLoading: false,
      editing: null,

      // Filter options
      statusOption: { label: 'ทั้งหมด', value: '' },
      statusOptions: [
        { label: 'ทั้งหมด', value: '' },
        { label: 'ใช้งาน', value: true },
        { label: 'ปิดใช้งาน', value: false },
      ],

      // Pagination options
      pageSizeOption: { label: '10 ต่อหน้า', value: 10 },
      pageSizeOptions: [
        { label: '10 ต่อหน้า', value: 10 },
        { label: '20 ต่อหน้า', value: 20 },
        { label: '50 ต่อหน้า', value: 50 },
        { label: '100 ต่อหน้า', value: 100 },
      ],
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
    params() {
      return {
        search: this.searchQuery || undefined,
        isActive: this.statusOption.value === '' ? undefined : this.statusOption.value,
        page: this.meta.page,
        limit: this.pageSizeOption.value,
        sort: 'createdAt',
        order: 'desc',
      }
    },
  },
  methods: {
    onFilterInput() {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.searchQuery = this.query
        this.meta.page = 1
      }, 500)
    },
    async loadItems() {
      try {
        this.loading = true
        const params = this.params

        const response = await icd10Service.list(params)
        const body = response?.data || {}

        this.items = Array.isArray(body.data) ? body.data : []
        this.meta.total = body.pagination?.total || 0
        this.meta.totalPages = body.pagination?.totalPages || 1
        this.meta.page = body.pagination?.page || this.meta.page
      } catch (error) {
        console.error('Error loading ICD10 items:', error)
        this.items = []
        this.meta.total = 0
        this.meta.totalPages = 1

        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถโหลดข้อมูลรายการวินิจฉัยได้',
        })
      } finally {
        this.loading = false
      }
    },
    openCreate() {
      this.editing = null
      this.modalOpen = true
    },
    openEdit(item) {
      this.editing = { ...item }
      this.modalOpen = true
    },
    onModalClose(isOpen) {
      if (!isOpen) {
        this.editing = null
        this.modalLoading = false
      }
    },
    async handleSave(payload) {
      const isEdit = !!payload.id
      const confirm = await Swal.fire({
        title: isEdit ? 'ยืนยันการแก้ไขรายการวินิจฉัย?' : 'ยืนยันการสร้างรายการวินิจฉัย?',
        text: isEdit
          ? `ต้องการบันทึกการเปลี่ยนแปลงของ "${payload.code} - ${payload.nameTh}" หรือไม่`
          : `ต้องการสร้างรายการวินิจฉัย "${payload.code} - ${payload.nameTh}" หรือไม่`,
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
          await icd10Service.update(payload.id, payload)
          this.modalOpen = false
          this.modalLoading = false
          Swal.fire({
            icon: 'success',
            title: 'แก้ไขสำเร็จ',
            timer: 1400,
            showConfirmButton: false,
            toast: true,
            position: 'top-end',
          })
        } else {
          const data = { ...payload }
          delete data.id
          await icd10Service.create(data)
          this.modalOpen = false
          this.modalLoading = false
          Swal.fire({
            icon: 'success',
            title: 'สร้างสำเร็จ',
            timer: 1400,
            showConfirmButton: false,
            toast: true,
            position: 'top-end',
          })
        }
        await this.loadItems()
      } catch (e) {
        this.modalLoading = false
        Swal.fire({
          icon: 'error',
          title: 'บันทึกไม่สำเร็จ',
          text: e?.response?.data?.message || e.message,
        })
      }
    },
    async toggleActive(item) {
      const desired = !item.isActive
      const res = await Swal.fire({
        title: desired ? 'เปิดใช้งานรายการวินิจฉัย?' : 'ปิดใช้งานรายการวินิจฉัย?',
        text: `${desired ? 'เปิดให้ใช้งาน' : 'ปิดการใช้งาน'} "${item.code} - ${item.nameTh}" หรือไม่`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: desired ? 'เปิดใช้งาน' : 'ปิดใช้งาน',
        cancelButtonText: 'ยกเลิก',
        reverseButtons: true,
      })
      if (!res.isConfirmed) return

      try {
        await icd10Service.toggleActive(item.id)
        Swal.fire({
          icon: 'success',
          title: desired ? 'เปิดใช้งานแล้ว' : 'ปิดใช้งานแล้ว',
          timer: 1200,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        })
        await this.loadItems()
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'อัปเดตสถานะไม่สำเร็จ',
          text: error?.response?.data?.message || error.message || 'กรุณาลองใหม่อีกครั้ง',
        })
      }
    },
    go(page) {
      if (page < 1 || page > this.totalPages) return
      this.meta.page = page
    },
  },
  watch: {
    params: {
      handler(newParams, oldParams) {
        if (JSON.stringify(newParams) !== JSON.stringify(oldParams)) {
          this.loadItems()
        }
      },
      deep: true,
      immediate: false,
    },
    'pageSizeOption.value'() {
      this.meta.page = 1
    },
    searchQuery(newQuery, oldQuery) {
      if (newQuery !== oldQuery) {
        // This will trigger params watcher automatically
      }
    },
  },
  mounted() {
    this.loadItems()
  },
  beforeUnmount() {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer)
    }
  },
}
</script>

<style scoped></style>

