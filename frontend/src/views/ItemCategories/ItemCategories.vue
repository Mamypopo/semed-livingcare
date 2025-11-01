<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <p class="text-md text-slate-600">จัดการหมวดหมู่รายการตรวจ</p>
      </div>
      <div class="flex items-center gap-2">
        <!-- Search -->
        <div class="relative">
          <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            v-model.trim="query"
            @input="onFilterInput"
            type="text"
            placeholder="ค้นหาชื่อหมวดหมู่..."
            class="w-64 px-3 py-2 pl-10 pr-4 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
          />
        </div>

        <!-- CategoryType -->
        <Listbox v-model="categoryTypeOption" as="div" class="relative">
          <div>
            <ListboxButton class="px-3 py-2 text-sm bg-white hover:bg-slate-50 text-slate-700 border border-gray-200 rounded-md min-w-48 flex items-center justify-between w-full">
              <div class="flex items-center gap-2">
                <div v-if="categoryTypeOption.color" class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ backgroundColor: categoryTypeOption.color }"></div>
                <span>{{ categoryTypeOption.label }}</span>
              </div>
              <ChevronDown class="w-4 h-4 opacity-60" />
            </ListboxButton>
          </div>
          <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
            <ListboxOptions class="absolute right-0 mt-2 z-50 p-2 shadow-xl bg-white rounded-xl border border-gray-200/50 w-56 focus:outline-none">
              <ListboxOption v-for="opt in categoryTypeOptions" :key="String(opt.value)" :value="opt" v-slot="{ active, selected }">
                <li :class="['px-3 py-2 text-sm rounded-lg cursor-pointer flex items-center justify-between transition-colors', active ? 'bg-emerald-50 text-slate-800' : 'text-slate-700 hover:bg-slate-50']">
                  <div class="flex items-center gap-2">
                    <div v-if="opt.color" class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ backgroundColor: opt.color }"></div>
                    <span>{{ opt.label }}</span>
                  </div>
                  <span v-if="selected" class="text-emerald-500 text-xs">เลือก</span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </Listbox>

        <!-- Status -->
        <Listbox v-model="statusOption" as="div" class="relative">
          <div>
            <ListboxButton class="px-3 py-2 text-sm bg-white hover:bg-slate-50 text-slate-700 border border-gray-200 rounded-md min-w-40 flex items-center justify-between w-full">
              <span>{{ statusOption.label }}</span>
              <ChevronDown class="w-4 h-4 opacity-60" />
            </ListboxButton>
          </div>
          <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
            <ListboxOptions class="absolute right-0 mt-2 z-50 p-2 shadow-xl bg-white rounded-xl border border-gray-200/50 w-48 focus:outline-none">
              <ListboxOption v-for="opt in statusOptions" :key="String(opt.value)" :value="opt" v-slot="{ active, selected }">
                <li :class="['px-3 py-2 text-sm rounded-lg cursor-pointer flex items-center justify-between transition-colors', active ? 'bg-emerald-50 text-slate-800' : 'text-slate-700 hover:bg-slate-50']">
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
            <ListboxButton class="px-4 py-2 text-sm bg-white border hover:bg-slate-50 text-slate-700 border-gray-200 rounded-md flex items-center gap-2">
              <span>{{ pageSizeOption.label }}</span>
              <ChevronDown class="w-3.5 h-3.5 opacity-60" />
            </ListboxButton>
          </div>
          <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
            <ListboxOptions class="absolute right-0 mt-2 z-50 p-1.5 shadow-xl bg-white rounded-lg border border-gray-200/50 w-32 focus:outline-none">
              <ListboxOption v-for="opt in pageSizeOptions" :key="opt.value" :value="opt" v-slot="{ active, selected }">
                <li :class="['px-2 py-1.5 text-sm rounded cursor-pointer flex items-center justify-between transition-colors', active ? 'bg-emerald-50 text-slate-800' : 'text-slate-700 hover:bg-slate-50']">
                  <span>{{ opt.label }}</span>
                  <span v-if="selected" class="text-emerald-500 text-xs">เลือก</span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </Listbox>

        <!-- Add button -->
        <button @click="openCreate" class="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-emerald-400 to-teal-400 text-white hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md">
          เพิ่มหมวดหมู่
        </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200/50 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600">ชื่อหมวดหมู่</th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600">ประเภทหมวดหมู่</th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600">สถานะ</th>
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
                  <div class="h-5 w-28 bg-gray-100 animate-pulse rounded-full"></div>
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
              <td colspan="4" class="px-4 py-10 text-center text-slate-500 text-sm">ไม่พบข้อมูล</td>
            </tr>

            <!-- Data rows -->
            <tr v-else v-for="cat in items" :key="cat.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-4 py-2 text-sm text-slate-800 font-medium">{{ cat.name }}</td>
              <td class="px-4 py-2 text-sm text-slate-700">
                <span
                  v-if="getTypeColor(cat.categoryType)"
                  class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border"
                  :style="{
                    backgroundColor: hexToRgba(getTypeColor(cat.categoryType), 0.15),
                    color: getTypeColor(cat.categoryType),
                    borderColor: hexToRgba(getTypeColor(cat.categoryType), 0.3)
                  }"
                >
                  {{ mapType(cat.categoryType) }}
                </span>
                <span v-else>{{ mapType(cat.categoryType) }}</span>
              </td>
              <td class="px-4 py-2 text-sm">
                <span :class="cat.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-600 border border-gray-200'" class="px-2 py-1 rounded-md text-xs font-medium">
                  {{ cat.isActive ? 'ใช้งาน' : 'ปิดใช้งาน' }}
                </span>
              </td>
              <td class="px-4 py-2 text-sm text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-2">
                  <button @click="openEdit(cat)" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-md bg-white transition-colors border-sky-200 text-sky-700 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500" title="แก้ไข">
                    <Pencil class="w-3.5 h-3.5" /> แก้ไข
                  </button>
                  <button @click="toggleActive(cat)" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-md ml-2 transition-colors" :class="cat.isActive ? 'border-orange-200 bg-white text-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500' : 'border-green-200 bg-white text-green-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500'" :title="cat.isActive ? 'ปิดใช้งาน' : 'เปิดใช้งาน'">
                    <ToggleRight v-if="cat.isActive" class="w-3.5 h-3.5" />
                    <ToggleLeft v-else class="w-3.5 h-3.5" />
                    {{ cat.isActive ? 'ปิดใช้งาน' : 'เปิดใช้งาน' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer: pagination -->
      <div v-if="!loading && items.length > 0" class="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-gray-100 text-sm">
        <div class="text-slate-600">
          แสดง
          <span class="mx-1 text-slate-800 font-medium">{{ from }}</span>
          -
          <span class="mx-1 text-slate-800 font-medium">{{ to }}</span>
          จากทั้งหมด
          <span class="mx-1 text-slate-800 font-medium">{{ total }}</span>
          รายการ
        </div>
        <div class="flex items-center gap-2">
          <button class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded-md bg-white text-slate-700 hover:bg-slate-50 hover:border-gray-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed" :disabled="currentPage <= 1 || loading" @click="goToPage(currentPage - 1)">
            <ChevronLeft class="w-3.5 h-3.5" /> ก่อนหน้า
          </button>
          <span class="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-md text-slate-700">
            หน้า <span class="text-slate-800 font-medium">{{ currentPage }}</span> / {{ totalPages }}
          </span>
          <button class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded-md bg-white text-slate-700 hover:bg-slate-50 hover:border-gray-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed" :disabled="currentPage >= totalPages || loading" @click="goToPage(currentPage + 1)">
            ถัดไป <ChevronRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <ItemCategoryModal
      v-model="modalOpen"
      :initialData="editing"
      :loading="modalLoading"
      @save="handleSave"
      @update:modelValue="onModalClose"
    />
  </div>
</template>

<script>
import itemCategoryService from '@/services/item-category.js'
import ItemCategoryModal from '@/views/ItemCategories/components/modals/ItemCategoryModal.vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { Search as SearchIcon, ChevronDown, ChevronLeft, ChevronRight, Pencil, ToggleRight, ToggleLeft } from 'lucide-vue-next'
import Swal from 'sweetalert2'

export default {
  name: 'ItemCategories',
  components: { ItemCategoryModal, Listbox, ListboxButton, ListboxOptions, ListboxOption, SearchIcon, ChevronDown, ChevronLeft, ChevronRight, Pencil, ToggleRight, ToggleLeft },
  data() {
    return {
      query: '',
      searchQuery: '',
      loading: false,
      items: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      modalOpen: false,
      modalLoading: false,
      editing: null,
      typingTimer: null,
      // Filters
      statusOption: { label: 'ทั้งหมด', value: '' },
      statusOptions: [
        { label: 'ทั้งหมด', value: '' },
        { label: 'ใช้งาน', value: true },
        { label: 'ปิดใช้งาน', value: false }
      ],
      categoryTypeOption: { label: 'ทุกประเภท', value: '' },
      categoryTypeOptions: [
        { label: 'ทุกประเภท', value: '', color: null },
        { label: 'ยา/อุปกรณ์', value: 'DRUG_SUPPLY', color: '#10b981' },
        { label: 'คอร์ส/โปรแกรม', value: 'COURSE', color: '#3b82f6' },
        { label: 'การตรวจ/Lab/X-Ray', value: 'LAB_XRAY', color: '#f59e0b' },
        { label: 'รายการวินิจฉัย', value: 'DIAGNOSIS', color: '#ef4444' },
        { label: 'คำแนะนำ/อ้างอิง', value: 'ADVICE_REFERENCE', color: '#8b5cf6' },
        { label: 'ค่าใช้จ่ายอื่นๆ', value: 'EXPENSE', color: '#6b7280' }
      ],
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
    from() {
      if (this.total === 0) return 0
      return (this.currentPage - 1) * this.pageSize + 1
    },
    to() {
      return Math.min(this.currentPage * this.pageSize, this.total)
    },
    params() {
      return {
        search: this.searchQuery || undefined,
        categoryType: this.categoryTypeOption.value || undefined,
        isActive: this.statusOption.value === '' ? undefined : this.statusOption.value,
        page: this.currentPage,
        limit: this.pageSizeOption.value,
        sort: 'createdAt',
        order: 'desc'
      }
    }
  },
  methods: {
    onFilterInput() {
      clearTimeout(this.typingTimer)
      this.typingTimer = setTimeout(() => {
        this.searchQuery = this.query
        this.currentPage = 1
      }, 500)
    },
    async loadItems() {
      try {
        this.loading = true
        const res = await itemCategoryService.list(this.params)
        this.items = res.data || []
        this.total = res.pagination?.total || 0
        this.pageSize = res.pagination?.limit || this.pageSizeOption.value
      } catch (e) {
        console.error('load categories error', e)
        this.items = []
        this.total = 0
        Swal.fire({ icon: 'error', title: 'โหลดข้อมูลไม่สำเร็จ' })
      } finally {
        this.loading = false
      }
    },
    openCreate() {
      this.editing = null
      this.modalOpen = true
    },
    openEdit(row) {
      this.editing = { ...row }
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
        title: isEdit ? 'ยืนยันการแก้ไขหมวดหมู่?' : 'ยืนยันการสร้างหมวดหมู่?',
        text: isEdit ? `ต้องการบันทึกการเปลี่ยนแปลงของ "${payload.name}" หรือไม่` : `ต้องการสร้างหมวดหมู่ "${payload.name}" หรือไม่`,
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
          await itemCategoryService.update(payload.id, payload)
          this.modalOpen = false
          this.modalLoading = false
          Swal.fire({ icon: 'success', title: 'แก้ไขสำเร็จ', timer: 1400, showConfirmButton: false, toast: true, position: 'top-end' })
        } else {
          const data = { ...payload }
          delete data.id
          await itemCategoryService.create(data)
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
    async toggleActive(row) {
      const desired = !row.isActive
      const res = await Swal.fire({
        title: desired ? 'เปิดใช้งานหมวดหมู่?' : 'ปิดใช้งานหมวดหมู่?',
        text: `${desired ? 'เปิดให้ใช้งาน' : 'ปิดการใช้งาน'} "${row.name}" หรือไม่`,
        icon: 'question', showCancelButton: true, confirmButtonText: desired ? 'เปิดใช้งาน' : 'ปิดใช้งาน', cancelButtonText: 'ยกเลิก', reverseButtons: true
      })
      if (!res.isConfirmed) return
      try {
        await itemCategoryService.toggleActive(row.id)
        Swal.fire({ icon: 'success', title: desired ? 'เปิดใช้งานแล้ว' : 'ปิดใช้งานแล้ว', timer: 1200, showConfirmButton: false, toast: true, position: 'top-end' })
        await this.loadItems()
      } catch (e) {
        Swal.fire({ icon: 'error', title: 'อัปเดตสถานะไม่สำเร็จ', text: e?.response?.data?.message || e.message })
      }
    },
    goToPage(p) {
      if (p >= 1 && p <= this.totalPages) this.currentPage = p
    },
    mapType(t) {
      const m = {
        DRUG_SUPPLY: 'ยา/อุปกรณ์',
        COURSE: 'คอร์ส/โปรแกรม',
        LAB_XRAY: 'การตรวจ/Lab/X-Ray',
        DIAGNOSIS: 'รายการวินิจฉัย',
        ADVICE_REFERENCE: 'คำแนะนำ/อ้างอิง',
        EXPENSE: 'ค่าใช้จ่ายอื่นๆ'
      }
      return m[t] || t
    },
    getTypeColor(t) {
      const option = this.categoryTypeOptions.find(opt => opt.value === t)
      return option?.color || null
    },
    hexToRgba(hex, alpha = 0.2) {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }
  },
  watch: {
    params: {
      handler(np, op) {
        if (JSON.stringify(np) !== JSON.stringify(op)) this.loadItems()
      },
      deep: true
    },
    'pageSizeOption.value'() {
      this.currentPage = 1
    }
  },
  mounted() {
    this.loadItems()
  }
}
</script>

<style scoped></style>


