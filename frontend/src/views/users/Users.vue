<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <p class="text-md text-gray-500">จัดการข้อมูลผู้ใช้ทั้งหมดในระบบ</p>
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
          placeholder="ค้นหา ชื่อ/อีเมล..."
          class="px-3 py-2 pl-10 pr-4 text-sm  border border-gray-200 rounded-lg shadow-sm 
       bg-white text-gray-700 placeholder-gray-400 
       focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80
       focus:outline-none transition-colors duration-200 hover:border-emerald-400"
        />
        </div>
        <!-- Role dropdown -->
        <Listbox v-model="roleOption" as="div" class="relative">
          <div>
            <ListboxButton
              class="px-3 py-2 text-sm bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-md min-w-40 flex items-center justify-between w-full"
            >
              <span>{{ roleOption.label }}</span>
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
                v-for="opt in roleOptions"
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

        <!-- Branch dropdown -->
        <Listbox v-model="branchOption" as="div" class="relative">
          <div>
            <ListboxButton
              @click="onBranchDropdownOpen"
              class="px-3 py-2 text-sm bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-md min-w-40 flex items-center justify-between w-full"
            >
              <div class="flex items-center gap-2">
                <span>{{ branchOption.label }}</span>
                <span
                  v-if="branchOption.code"
                  class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md font-medium"
                >
                  {{ branchOption.code }}
                </span>
              </div>
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
              class="absolute right-0 mt-2 z-50 p-2 shadow-xl bg-white rounded-xl border border-gray-100 w-64 focus:outline-none"
            >
              <!-- Search input -->
              <div class="px-3 py-2 border-b border-gray-100">
                <input
                  v-model="branchSearchQuery"
                  @input="onBranchSearchInput"
                  type="text"
                  placeholder="ค้นหาสาขา..."
                  class="w-full px-2 py-1 text-sm  border border-gray-200 rounded-lg shadow-sm 
       bg-white text-gray-700 placeholder-gray-400 
       focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80
       focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                />
              </div>

              <!-- Branch options -->
              <div class="max-h-48 overflow-y-auto">
                <ListboxOption
                  v-for="opt in filteredBranchOptions"
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
                    <div class="flex items-center gap-2">
                      <span>{{ opt.label }}</span>
                      <span
                        v-if="opt.code"
                        class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md font-medium"
                      >
                        {{ opt.code }}
                      </span>
                    </div>
                    <span v-if="selected" class="text-emerald-600 text-xs">เลือก</span>
                  </li>
                </ListboxOption>

                <!-- No results -->
                <div
                  v-if="filteredBranchOptions.length === 0"
                  class="px-3 py-2 text-sm text-gray-500 text-center"
                >
                  ไม่พบสาขาที่ค้นหา
                </div>
              </div>
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
          เพิ่มผู้ใช้
        </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                @click="toggleSort('name')"
                class="px-4 py-2 text-left text-xs font-semibold cursor-pointer select-none text-gray-600"
              >
                <span class="inline-flex items-center"
                  >ชื่อ
                  <ChevronUp
                    v-if="sort === 'name' && order === 'asc'"
                    class="w-3.5 h-3.5 ml-1 text-emerald-600"
                  />
                  <ChevronDown v-else class="w-3.5 h-3.5 ml-1 text-emerald-600" />
                </span>
              </th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">อีเมล</th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">บทบาท</th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">สาขา</th>
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
                  <div class="h-4 w-32 bg-gray-100 animate-pulse rounded"></div>
                </td>
                <td class="px-4 py-3">
                  <div class="h-4 w-48 bg-gray-100 animate-pulse rounded"></div>
                </td>
                <td class="px-4 py-3">
                  <div class="h-4 w-20 bg-gray-100 animate-pulse rounded"></div>
                </td>
                <td class="px-4 py-3">
                  <div class="h-4 w-24 bg-gray-100 animate-pulse rounded"></div>
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
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
                <td class="px-4 py-2 text-sm text-gray-900 font-medium">{{ user.name }}</td>
                <td class="px-4 py-2 text-sm text-gray-700">{{ user.email }}</td>
                <td class="px-4 py-2 text-sm">
                  <span
                    :class="getRoleBadgeClass(user.role)"
                    class="px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{ getRoleLabel(user.role) }}
                  </span>
                </td>
                <td class="px-4 py-2 text-sm text-gray-700">{{ user.branch?.name || '-' }}</td>
                <td class="px-4 py-2 text-sm">
                  <span
                    :class="
                      user.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                    "
                    class="px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{ user.isActive ? 'ใช้งาน' : 'ปิดใช้งาน' }}
                  </span>
                </td>
                <td class="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">
                  {{ formatDate(user.createdAt) }}
                </td>
                <td class="px-4 py-2 text-sm text-right whitespace-nowrap">
                  <template v-if="isAdmin">
                    <button
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-md bg-white transition-colors border-sky-200 text-sky-700 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      @click="openEdit(user)"
                      v-tooltip:top="'แก้ไข'"
                    >
                      <Pencil class="w-3.5 h-3.5" />
                      แก้ไข
                    </button>
                    <button
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-md ml-2 transition-colors"
                      :class="
                        user.isActive
                          ? 'border-orange-200 bg-white text-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500'
                          : 'border-green-200 bg-white text-green-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500'
                      "
                      @click="toggleActive(user)"
                      v-tooltip:top="user.isActive ? 'ปิดใช้งาน' : 'เปิดใช้งาน'"
                    >
                      <ToggleRight v-if="user.isActive" class="w-3.5 h-3.5" />
                      <ToggleLeft v-else class="w-3.5 h-3.5" />
                      {{ user.isActive ? 'ปิดใช้งาน' : 'เปิดใช้งาน' }}
                    </button>
                  </template>
                </td>
              </tr>
            </template>

            <!-- Empty state -->
            <tr v-if="!loading && users.length === 0">
              <td colspan="7" class="px-4 py-10 text-center text-gray-500 text-sm">ไม่พบข้อมูล</td>
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
  </div>

  <!-- Reusable Create/Edit Modal -->
  <UserModal
    v-model="modalOpen"
    :initialData="editingUser"
    :loading="modalLoading"
    @save="handleSave"
    @passwordChanged="handlePasswordChanged"
  />
</template>

<script>
import { userService } from '@/services/user'
import { branchService } from '@/services/branch'
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
import UserModal from '@/views/users/components/modals/UserModal.vue'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'UsersManagement',
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
    UserModal,
    SearchIcon
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      loading: false,
      query: '',
      // Role options
      roleOptions: [
        { label: 'บทบาททั้งหมด', value: '' },
        { label: 'ผู้ดูแลระบบ', value: 'ADMIN' },
        { label: 'พนักงาน', value: 'STAFF' },
        { label: 'ผู้เยี่ยมชม', value: 'GUEST' }
      ],
      roleOption: { label: 'บทบาททั้งหมด', value: '' },
      // Status options
      statusOptions: [
        { label: 'สถานะทั้งหมด', value: '' },
        { label: 'ใช้งาน', value: true },
        { label: 'ปิดใช้งาน', value: false }
      ],
      statusOption: { label: 'สถานะทั้งหมด', value: '' },
      // Branch options
      branchOptions: [{ label: 'ทุกสาขา', value: '' }],
      branchOption: { label: 'ทุกสาขา', value: '' },
      branchSearchQuery: '',
      filteredBranchOptions: [{ label: 'ทุกสาขา', value: '' }],
      // Page size options
      pageSize: 10,
      pageSizeOptions: [
        { label: '10 ต่อหน้า', value: 10 },
        { label: '20 ต่อหน้า', value: 20 },
        { label: '50 ต่อหน้า', value: 50 }
      ],
      pageSizeOption: { label: '10 ต่อหน้า', value: 10 },
      meta: { page: 1, totalPages: 1, total: 0 },
      users: [],
      typingTimer: null,
      branchSearchTimer: null,
      sort: 'createdAt',
      order: 'desc',
      modalOpen: false,
      modalLoading: false,
      editingUser: null
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
    role() {
      return this.roleOption.value
    },
    isActive() {
      return this.statusOption.value
    },
    branchId() {
      return this.branchOption.value
    },
    isAdmin() {
      return this.authStore && this.authStore.userRole === 'ADMIN'
    }
  },
  methods: {
    async reload() {
      this.loading = true
      try {
        const { data, meta } = await userService.getAll({
          page: this.meta.page,
          pageSize: this.pageSize,
          search: this.query || undefined,
          role: this.role === '' ? undefined : this.role,
          isActive: this.isActive === '' ? undefined : this.isActive,
          branchId: this.branchId === '' ? undefined : this.branchId,
          sort: this.sort,
          order: this.order
        })
        this.users = data
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
    go(p) {
      if (p < 1 || p > this.totalPages) return
      this.meta.page = p
      this.reload()
    },
    async openCreate() {
      this.editingUser = null
      this.modalOpen = true
    },
    openEdit(user) {
      this.editingUser = { ...user }
      this.modalOpen = true
    },
    async handleSave(data) {
      // Confirm before action
      const isEdit = !!data.id
      const confirm = await Swal.fire({
        title: isEdit ? 'ยืนยันการแก้ไขผู้ใช้?' : 'ยืนยันการสร้างผู้ใช้ใหม่?',
        text: isEdit
          ? `ต้องการบันทึกการเปลี่ยนแปลงของ "${data.name}" หรือไม่`
          : `ต้องการสร้างผู้ใช้ "${data.name}" หรือไม่`,
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
          const res = await userService.update(data.id, data)
          this.modalOpen = false
          this.modalLoading = false
          Swal.fire({
            icon: 'success',
            title: 'แก้ไขผู้ใช้สำเร็จ',
            timer: 1600,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          })
          // Reload data to get latest information
          await this.reload()
        } else {
          const res = await userService.create(data)
          this.modalOpen = false
          this.modalLoading = false
          Swal.fire({
            icon: 'success',
            title: 'สร้างผู้ใช้สำเร็จ',
            timer: 1600,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          })
          // Reload data to get latest information
          await this.reload()
        }
      } catch (e) {
        this.modalLoading = false
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: e?.response?.data?.message || e.message || 'ไม่สามารถบันทึกข้อมูลได้'
        })
      }
    },
    async toggleActive(user) {
      const desired = !user.isActive
      const res = await Swal.fire({
        title: desired ? 'เปิดใช้งานผู้ใช้?' : 'ปิดใช้งานผู้ใช้?',
        text: `${desired ? 'เปิดให้ใช้งาน' : 'ปิดการใช้งาน'} "${user.name}" หรือไม่`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: desired ? 'เปิดใช้งาน' : 'ปิดใช้งาน',
        cancelButtonText: 'ยกเลิก',
        reverseButtons: true
      })
      if (!res.isConfirmed) return

      try {
        await userService.updateActive(user.id, desired)
        Swal.fire({
          icon: 'success',
          title: desired ? 'เปิดใช้งานแล้ว' : 'ปิดใช้งานแล้ว',
          timer: 1200,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        })
        // Reload data to get latest information
        await this.reload()
      } catch (e) {
        Swal.fire({
          icon: 'error',
          title: 'อัปเดตสถานะไม่สำเร็จ',
          text: e?.response?.data?.message || e.message || 'กรุณาลองใหม่อีกครั้ง'
        })
      }
    },
    getRoleLabel(role) {
      const labels = {
        ADMIN: 'ผู้ดูแลระบบ',
        STAFF: 'พนักงาน',
        GUEST: 'ผู้เยี่ยมชม',
        DOCTOR: 'แพทย์'
      }
      return labels[role] || role
    },
    getRoleBadgeClass(role) {
      const classes = {
        ADMIN: 'bg-purple-50 text-purple-700',
        STAFF: 'bg-blue-50 text-blue-700',
        GUEST: 'bg-gray-50 text-gray-700',
        DOCTOR: 'bg-emerald-50 text-emerald-700'
      }
      return classes[role] || 'bg-gray-50 text-gray-700'
    },
    handlePasswordChanged() {
      // Password was changed successfully
      // Could reload user data or show additional notifications if needed
    },
    async loadBranches() {
      try {
        const branches = await branchService.getAllForDropdown('', 20)
        this.branchOptions = [
          { label: 'ทุกสาขา', value: '' },
          ...branches.map(branch => ({
            label: branch.name,
            code: branch.code,
            value: branch.id
          }))
        ]
        this.filteredBranchOptions = this.branchOptions
      } catch (error) {
        console.error('Error loading branches:', error)
      }
    },
    async onBranchSearchInput() {
      // Clear previous timer
      if (this.branchSearchTimer) {
        clearTimeout(this.branchSearchTimer)
      }

      // Set new timer
      this.branchSearchTimer = setTimeout(async () => {
        try {
          const branches = await branchService.getAllForDropdown(this.branchSearchQuery, 20)
          this.filteredBranchOptions = [
            { label: 'ทุกสาขา', value: '' },
            ...branches.map(branch => ({
              label: branch.name,
              code: branch.code,
              value: branch.id
            }))
          ]
        } catch (error) {
          console.error('Error searching branches:', error)
        }
      }, 300)
    },
    async onBranchDropdownOpen() {
      // Load branches only when dropdown is opened
      if (this.branchOptions.length === 1) {
        // Only "ทุกสาขา" option
        await this.loadBranches()
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
    if (this.branchSearchTimer) {
      clearTimeout(this.branchSearchTimer)
    }
  },
  watch: {
    roleOption() {
      this.meta.page = 1
      this.reload()
    },
    statusOption() {
      this.meta.page = 1
      this.reload()
    },
    branchOption() {
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

<style scoped></style>
