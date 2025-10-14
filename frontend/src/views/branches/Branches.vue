<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <p class="text-md text-gray-500">จัดการข้อมูลสาขาทั้งหมดในระบบ</p>
      </div>
      <div class="flex items-center gap-2">
        <input v-model.trim="query" @input="onFilterInput" type="text" placeholder="ค้นหา รหัส/ชื่อ/ที่อยู่..." class="px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-56 hover:border-emerald-300 focus:outline-none" />

        <!-- Status dropdown (Headless UI Listbox) -->
        <Listbox v-model="statusOption" as="div" class="relative">
          <div>
            <ListboxButton class="px-3 py-2 text-sm bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-md min-w-40 flex items-center justify-between w-full">
              <span>{{ statusOption.label }}</span>
              <ChevronDown class="w-4 h-4 opacity-60" />
            </ListboxButton>
          </div>
          <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
            <ListboxOptions class="absolute right-0 mt-2 z-50 p-2 shadow-xl bg-white rounded-xl border border-gray-100 w-48 focus:outline-none">
              <ListboxOption v-for="opt in statusOptions" :key="String(opt.value)" :value="opt" v-slot="{ active, selected }">
                <li :class="[ 'px-3 py-2 text-sm rounded-lg cursor-pointer flex items-center justify-between', active ? 'bg-emerald-50 text-gray-900' : 'text-gray-700' ]">
                  <span>{{ opt.label }}</span>
                  <span v-if="selected" class="text-emerald-600 text-xs">เลือก</span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </Listbox>

        <!-- Page size (Headless UI Listbox) merged into filter row -->
        <Listbox v-model="pageSizeOption" as="div" class="relative ">
          <div>
            <ListboxButton class="px-4 py-2 text-sm bg-white border border-gray-200 rounded flex items-center gap-2">
              <span>{{ pageSizeOption.label }}</span>
              <ChevronDown class="w-3.5 h-3.5 opacity-60" />
            </ListboxButton>
          </div>
          <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
            <ListboxOptions class="absolute right-0 mt-2 z-50 p-1.5 shadow-xl bg-white rounded-lg border border-gray-100 w-32 focus:outline-none">
              <ListboxOption v-for="opt in pageSizeOptions" :key="opt.value" :value="opt" v-slot="{ active, selected }">
                <li :class="[ 'px-2 py-1.5 text-sm rounded cursor-pointer flex items-center justify-between', active ? 'bg-emerald-50 text-gray-900' : 'text-gray-700' ]">
                  <span>{{ opt.label }}</span>
                  <span v-if="selected" class="text-emerald-600 text-xs">เลือก</span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </Listbox>

        <button class="px-4 py-2 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2" @click="openCreate">เพิ่มสาขา</button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">รหัส</th>
              <th @click="toggleSort('name')" class="px-4 py-2 text-left text-xs font-semibold cursor-pointer select-none" :class="sort==='name' ? 'text-emerald-700' : 'text-gray-600'">
                <span class="inline-flex items-center">ชื่อสาขา
                  <svg v-if="sort==='name'" xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path v-if="order==='asc'" fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                    <path v-else fill-rule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.83l-3.71 3.94a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clip-rule="evenodd" />
                  </svg>
                </span>
              </th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">ที่อยู่</th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">โทร</th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">สถานะ</th>
              <th @click="toggleSort('createdAt')" class="px-4 py-2 text-left text-xs font-semibold cursor-pointer select-none" :class="sort==='createdAt' ? 'text-emerald-700' : 'text-gray-600'">
                <span class="inline-flex items-center">วันที่สร้าง
                  <svg v-if="sort==='createdAt'" xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path v-if="order==='asc'" fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                    <path v-else fill-rule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.83l-3.71 3.94a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clip-rule="evenodd" />
                  </svg>
                </span>
              </th>
              <th class="px-4 py-2 text-right text-xs font-semibold text-gray-600">จัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <!-- Loading skeleton -->
            <tr v-if="loading" v-for="n in 6" :key="'skeleton-'+n">
              <td class="px-4 py-3"><div class="h-4 w-16 bg-gray-100 animate-pulse rounded"></div></td>
              <td class="px-4 py-3"><div class="h-4 w-40 bg-gray-100 animate-pulse rounded"></div></td>
              <td class="px-4 py-3"><div class="h-4 w-64 bg-gray-100 animate-pulse rounded"></div></td>
              <td class="px-4 py-3"><div class="h-4 w-24 bg-gray-100 animate-pulse rounded"></div></td>
              <td class="px-4 py-3"><div class="h-5 w-20 bg-gray-100 animate-pulse rounded-full"></div></td>
              <td class="px-4 py-3 text-right"><div class="h-8 w-24 bg-gray-100 animate-pulse rounded ml-auto"></div></td>
            </tr>

            <!-- Rows -->
            <tr v-for="b in branches" :key="b.id" class="hover:bg-gray-50" v-show="!loading">
              <td class="px-4 py-2 text-sm text-gray-700">{{ b.code }}</td>
              <td class="px-4 py-2 text-sm text-gray-900 font-medium">{{ b.name }}</td>
              <td class="px-4 py-2 text-sm text-gray-700 truncate max-w-[28ch]">{{ b.address || '-' }}</td>
              <td class="px-4 py-2 text-sm text-gray-700">{{ b.phone || '-' }}</td>
              <td class="px-4 py-2 text-sm">
                <span :class="b.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ b.isActive ? 'ใช้งาน' : 'ปิดใช้งาน' }}
                </span>
              </td>
              <td class="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">{{ formatDate(b.createdAt) }}</td>
              <td class="px-4 py-2 text-sm text-right whitespace-nowrap">
                <button class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200" @click="openEdit(b)">แก้ไข</button>
                <button class="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 ml-2" @click="remove(b)">ลบ</button>
              </td>
            </tr>

            <!-- Empty state -->
            <tr v-if="!loading && branches.length === 0">
              <td colspan="6" class="px-4 py-10 text-center text-gray-500 text-sm">ไม่พบข้อมูล</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer: pagination -->
      <div class="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100 text-sm text-gray-600">
        <div>
          แสดง {{ from }} - {{ to }} จากทั้งหมด {{ meta.total }} รายการ
        </div>
        <div class="flex items-center gap-2">
          <button class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="meta.page<=1 || loading" @click="go(meta.page-1)">ก่อนหน้า</button>
          <span>หน้า {{ meta.page }} / {{ meta.totalPages }}</span>
          <button class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="meta.page>=meta.totalPages || loading" @click="go(meta.page+1)">ถัดไป</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Reusable Create/Edit Modal -->
  <BranchModal
    v-model="modalOpen"
    :initialData="editingBranch"
    :loading="modalLoading"
    @save="handleSave"
  />
</template>

<script>
import { branchService } from '@/services/branch'
import { ChevronDown } from 'lucide-vue-next'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import BranchModal from '@/views/branches/components/modals/BranchModal.vue'
import Swal from 'sweetalert2'

export default {
  name: 'Branches',
  components: { ChevronDown, Listbox, ListboxButton, ListboxOptions, ListboxOption, BranchModal },
  data() {
    return {
      loading: false,
      query: '',
      // ใช้ผ่าน Listbox
      statusOptions: [
        { label: 'สถานะทั้งหมด', value: '' },
        { label: 'ใช้งาน', value: true },
        { label: 'ปิดใช้งาน', value: false }
      ],
      statusOption: { label: 'สถานะทั้งหมด', value: '' },
      pageSize: 10,
      pageSizeOptions: [
        { label: '10 ต่อหน้า', value: 10 },
        { label: '20 ต่อหน้า', value: 20 },
        { label: '50 ต่อหน้า', value: 50 }
      ],
      pageSizeOption: { label: '10 ต่อหน้า', value: 10 },
      meta: { page: 1, totalPages: 1, total: 0 },
      branches: [],
      typingTimer: null,
      statusOpen: false,
      sort: 'createdAt',
      order: 'desc',
      modalOpen: false,
      modalLoading: false,
      editingBranch: null
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
    isActive() {
      return this.statusOption.value
    }
  },
  methods: {
    // เมื่อเลือกสถานะใหม่ จะรีเฟรชอัตโนมัติผ่าน watch ด้านล่าง
    async reload() {
      this.loading = true
      try {
        const { data, meta } = await branchService.getAll({
          page: this.meta.page,
          pageSize: this.pageSize,
          search: this.query || undefined,
          isActive: this.isActive === '' ? undefined : this.isActive,
          sort: this.sort,
          order: this.order
        })
        this.branches = data
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
      this.reload()
    },
    formatDate(iso) {
      if (!iso) return '-'
      const d = new Date(iso)
      return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: '2-digit' })
    },
    onFilterInput() {
      clearTimeout(this.typingTimer)
      this.typingTimer = setTimeout(() => {
        this.meta.page = 1
        this.reload()
      }, 300)
    },
    changePageSize() {
      this.meta.page = 1
      this.reload()
    },
    go(p) {
      if (p < 1 || p > this.meta.totalPages) return
      this.meta.page = p
      this.reload()
    },
    openCreate() {
      this.editingBranch = null
      this.modalOpen = true
    },
    openEdit(b) {
      this.editingBranch = { ...b }
      this.modalOpen = true
    },
    async handleSave(data) {
      this.modalLoading = true
      try {
        if (data.id) {
          // TODO: await branchService.update(data.id, data)
          this.branches = this.branches.map(x => x.id === data.id ? { ...x, ...data } : x)
          await Swal.fire({
            icon: 'success',
            title: 'แก้ไขสาขาสำเร็จ',
            timer: 1600,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          })
        } else {
          // TODO: const created = await branchService.create(data)
          const created = { id: Math.random().toString(36).slice(2), createdAt: new Date().toISOString(), ...data }
          this.branches = [created, ...this.branches]
          this.meta.total += 1
          await Swal.fire({
            icon: 'success',
            title: 'สร้างสาขาสำเร็จ',
            timer: 1600,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          })
        }
        this.modalOpen = false
      } finally {
        this.modalLoading = false
      }
    },
    async remove(b) {
      const res = await Swal.fire({
        title: 'ลบสาขา?',
        text: `คุณต้องการลบ "${b.name}" หรือไม่`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ลบ',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        reverseButtons: true
      })
      if (res.isConfirmed) {
        // TODO: await branchService.remove(b.id)
        this.branches = this.branches.filter(x => x.id !== b.id)
        this.meta.total = Math.max(0, this.meta.total - 1)
        if (this.branches.length === 0 && this.meta.page > 1) this.go(this.meta.page - 1)
        await Swal.fire({
          icon: 'success',
          title: 'ลบสาขาสำเร็จ',
          timer: 1400,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        })
      }
    }
  },
  mounted() {
    this.reload()
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

<style scoped>
</style>


