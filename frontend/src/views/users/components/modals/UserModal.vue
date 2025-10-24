<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <DialogModal as="div" class="relative z-50" @close="requestClose">
      <TransitionChild
        as="template"
        enter="ease-out duration-200"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-150"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="ease-out duration-200"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-150"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-2xl transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all"
            >
              <!-- Header -->
              <div
                class="flex items-center justify-between px-6 pt-5 pb-4 rounded-t-2xl border-b border-gray-100 bg-white"
              >
                <DialogTitle as="h3" class="text-gray-900 text-lg font-semibold">{{
                  isEdit ? 'แก้ไขผู้ใช้' : 'เพิ่มผู้ใช้ใหม่'
                }}</DialogTitle>
                <button
                  @click="requestClose"
                  class="text-gray-400 hover:text-red-500 bg-gray-50 rounded-md p-1 transition-colors relative"
                >
                  <X class="w-5 h-5" />
                  <ConfirmClosePopover
                    v-if="showConfirmClose"
                    @cancel="showConfirmClose = false"
                    @confirm="forceClose"
                  />
                </button>
              </div>

              <div class="px-6 py-5 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Name -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700">ชื่อ *</label>
                    <input
                      v-model.trim="form.name"
                      type="text"
                      class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                    />
                    <p v-if="errors.name" class="text-xs text-red-600 mt-1">{{ errors.name }}</p>
                  </div>

                  <!-- Email -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700">อีเมล *</label>
                    <input
                      v-model.trim="form.email"
                      type="email"
                      class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                    />
                    <p v-if="errors.email" class="text-xs text-red-600 mt-1">{{ errors.email }}</p>
                  </div>

                  <!-- Password (only for new users) -->
                  <div v-if="!isEdit">
                    <label class="block text-sm font-medium text-gray-700">รหัสผ่าน *</label>
                    <input
                      v-model.trim="form.password"
                      type="password"
                      class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                    />
                    <p v-if="errors.password" class="text-xs text-red-600 mt-1">
                      {{ errors.password }}
                    </p>
                  </div>

                  <!-- Change Password Button (for existing users) -->
                  <div v-if="isEdit" class="md:col-span-2">
                    <button
                      type="button"
                      @click="openChangePasswordModal"
                      class="inline-flex items-center px-3 py-2 text-sm border border-gray-200 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-emerald-300/80 transition-colors duration-200 hover:border-emerald-400"
                    >
                      <Key class="w-4 h-4 mr-2" />
                      เปลี่ยนรหัสผ่าน
                    </button>
                  </div>

                  <!-- Role -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700">บทบาท *</label>
                    <Listbox v-model="form.role" as="div" class="relative">
                      <div>
                        <ListboxButton
                          class="mt-1 w-full px-3 py-2 text-left bg-white border border-gray-200 rounded-lg shadow-sm  text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                        >
                          <span class="block truncate">{{ getRoleLabel(form.role) }}</span>
                          <span
                            class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
                          >
                            <ChevronDown class="w-4 h-4 text-gray-400" />
                          </span>
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
                          class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none"
                        >
                          <ListboxOption
                            v-for="role in roleOptions"
                            :key="role.value"
                            :value="role.value"
                            v-slot="{ active, selected }"
                          >
                            <li
                              :class="[
                                active ? 'bg-emerald-50 text-emerald-700' : 'text-gray-900',
                                'cursor-pointer select-none relative py-2 pl-3 pr-9'
                              ]"
                            >
                              <span
                                :class="[
                                  selected ? 'font-semibold' : 'font-normal',
                                  'block truncate'
                                ]"
                              >
                                {{ role.label }}
                              </span>
                              <span
                                v-if="selected"
                                :class="[
                                  active ? 'text-emerald-600' : 'text-emerald-600',
                                  'absolute inset-y-0 right-0 flex items-center pr-4'
                                ]"
                              >
                                <CheckIcon class="w-4 h-4" />
                              </span>
                            </li>
                          </ListboxOption>
                        </ListboxOptions>
                      </transition>
                    </Listbox>
                    <p v-if="errors.role" class="text-xs text-red-600 mt-1">{{ errors.role }}</p>
                  </div>

                  <!-- Branch -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700">สาขา</label>
                    <Listbox v-model="form.branchId" as="div" class="relative">
                      <div>
                        <ListboxButton
                        class="mt-1 w-full px-3 py-2 text-left bg-white border border-gray-200 rounded-lg shadow-sm  text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                        >
                          <div class="flex items-center gap-2">
                            <span class="block truncate">{{ getBranchName(form.branchId) }}</span>
                            <span
                              v-if="getBranchCode(form.branchId)"
                              class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md font-medium"
                            >
                              {{ getBranchCode(form.branchId) }}
                            </span>
                          </div>
                          <span
                            class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
                          >
                            <ChevronDown class="w-4 h-4 text-gray-400" />
                          </span>
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
                          class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none"
                        >
                          <!-- Search input -->
                          <div class="px-3 py-2 border-b border-gray-200">
                            <input
                              v-model="branchSearchQuery"
                              @input="onBranchSearchInput"
                              type="text"
                              placeholder="ค้นหาสาขา..."
                              class="w-full px-2 py-1 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                              @click.stop
                            />
                          </div>

                          <ListboxOption :value="null" v-slot="{ active, selected }">
                            <li
                              :class="[
                                active ? 'bg-emerald-50 text-emerald-700' : 'text-gray-900',
                                'cursor-pointer select-none relative py-2 pl-3 pr-9'
                              ]"
                            >
                              <span
                                :class="[
                                  selected ? 'font-semibold' : 'font-normal',
                                  'block truncate'
                                ]"
                              >
                                ไม่ระบุสาขา
                              </span>
                              <span
                                v-if="selected"
                                :class="[
                                  active ? 'text-emerald-600' : 'text-emerald-600',
                                  'absolute inset-y-0 right-0 flex items-center pr-4'
                                ]"
                              >
                                <CheckIcon class="w-4 h-4" />
                              </span>
                            </li>
                          </ListboxOption>

                          <ListboxOption
                            v-for="branch in filteredBranches"
                            :key="branch.id"
                            :value="branch.id"
                            v-slot="{ active, selected }"
                          >
                            <li
                              :class="[
                                active ? 'bg-emerald-50 text-emerald-700' : 'text-gray-900',
                                'cursor-pointer select-none relative py-2 pl-3 pr-9'
                              ]"
                            >
                              <div class="flex items-center gap-2">
                                <span
                                  :class="[
                                    selected ? 'font-semibold' : 'font-normal',
                                    'block truncate'
                                  ]"
                                >
                                  {{ branch.name }}
                                </span>
                                <span
                                  class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md font-medium"
                                >
                                  {{ branch.code }}
                                </span>
                              </div>
                              <span
                                v-if="selected"
                                :class="[
                                  active ? 'text-emerald-600' : 'text-emerald-600',
                                  'absolute inset-y-0 right-0 flex items-center pr-4'
                                ]"
                              >
                                <CheckIcon class="w-4 h-4" />
                              </span>
                            </li>
                          </ListboxOption>

                          <!-- No results message -->
                          <div
                            v-if="filteredBranches.length === 0 && branchSearchQuery"
                            class="px-3 py-2 text-sm text-gray-500 text-center"
                          >
                            ไม่พบสาขาที่ค้นหา
                          </div>
                        </ListboxOptions>
                      </transition>
                    </Listbox>
                  </div>

                  <!-- Active Status -->
                  <div class="md:col-span-2">
                    <div class="flex items-center">
                      <button
                        type="button"
                        @click="form.isActive = !form.isActive"
                        :aria-pressed="form.isActive"
                        class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2"
                        :class="form.isActive ? 'bg-lime-500' : 'bg-gray-300'"
                      >
                        <span class="sr-only">สลับเปิด/ปิดการใช้งาน</span>
                        <span
                          :class="form.isActive ? 'translate-x-5' : 'translate-x-0'"
                          class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition"
                        ></span>
                      </button>
                      <span
                        class="ml-3 text-sm text-gray-700"
                      >
                        {{ form.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="px-6 pb-6 pt-2 flex justify-end gap-2 border-t border-gray-100 bg-white rounded-b-2xl"
              >
                <button
                  type="button"
                  class="px-4 py-2 text-sm border border-gray-200 rounded-md bg-white text-gray-700 hover:bg-gray-50"
                  @click="requestClose"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  class="px-4 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 shadow-sm"
                  :disabled="loading"
                  @click="onSave"
                >
                  {{ loading ? 'กำลังบันทึก...' : isEdit ? 'บันทึกการแก้ไข' : 'บันทึก' }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </DialogModal>
  </TransitionRoot>

  <!-- Change Password Modal -->
  <TransitionRoot appear :show="changePasswordModalOpen" as="template">
    <DialogModal as="div" class="relative z-[60]" @close="closeChangePasswordModal">
      <TransitionChild
        as="template"
        enter="ease-out duration-200"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-150"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/40" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="ease-out duration-200"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-150"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all"
            >
              <!-- Header -->
              <div
                class="flex items-center justify-between px-6 pt-5 pb-4 rounded-t-2xl border-b border-gray-100 bg-white"
              >
                <DialogTitle as="h3" class="text-gray-900 text-lg font-semibold"
                  >เปลี่ยนรหัสผ่าน</DialogTitle
                >
                <button
                  @click="closeChangePasswordModal"
                  class="text-gray-400 hover:text-red-500 bg-gray-50 rounded-md p-1 transition-colors"
                >
                  <X class="w-5 h-5" />
                </button>
              </div>

              <div class="px-6 py-5 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">รหัสผ่านใหม่ *</label>
                  <input
                    ref="newPasswordInput"
                    v-model.trim="newPassword"
                    type="password"
                    class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 hover:border-emerald-300 focus:outline-none"
                    autofocus
                  />
                  <p v-if="passwordError" class="text-xs text-red-600 mt-1">{{ passwordError }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >ยืนยันรหัสผ่านใหม่ *</label
                  >
                  <input
                    v-model.trim="confirmPassword"
                    type="password"
                    class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 hover:border-emerald-300 focus:outline-none"
                  />
                  <p v-if="confirmPasswordError" class="text-xs text-red-600 mt-1">
                    {{ confirmPasswordError }}
                  </p>
                </div>
              </div>

              <div
                class="px-6 pb-6 pt-2 flex justify-end gap-2 border-t border-gray-100 bg-white rounded-b-2xl"
              >
                <button
                  type="button"
                  class="px-4 py-2 text-sm border border-gray-200 rounded-md bg-white text-gray-700 hover:bg-gray-50"
                  @click="closeChangePasswordModal"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  class="px-4 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 shadow-sm"
                  :disabled="passwordLoading"
                  @click="handleChangePassword"
                >
                  {{ passwordLoading ? 'กำลังบันทึก...' : 'บันทึก' }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </DialogModal>
  </TransitionRoot>
</template>

<script>
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { ChevronDown, CheckIcon, X, Key } from 'lucide-vue-next'
import ConfirmClosePopover from '@/components/ConfirmClosePopover.vue'
import { userService } from '@/services/user'
import { branchService } from '@/services/branch'

export default {
  name: 'UserModalComponent',
  components: {
    DialogModal: Dialog,
    DialogPanel,
    DialogTitle,
    TransitionRoot,
    TransitionChild,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    ChevronDown,
    CheckIcon,
    X,
    Key,
    ConfirmClosePopover
  },
  props: {
    modelValue: { type: Boolean, required: true },
    initialData: { type: Object, default: null },
    loading: { type: Boolean, default: false }
  },
  emits: ['update:modelValue', 'save', 'passwordChanged'],
  data() {
    return {
      form: {
        id: null,
        name: '',
        email: '',
        password: '',
        role: 'GUEST',
        branchId: null,
        isActive: true
      },
      errors: {},
      originalSnapshot: null,
      showConfirmClose: false,
      branches: [],
      filteredBranches: [],
      branchSearchQuery: '',
      branchSearchTimer: null,
      changePasswordModalOpen: false,
      newPassword: '',
      confirmPassword: '',
      passwordError: '',
      confirmPasswordError: '',
      passwordLoading: false,
      roleOptions: [
        { label: 'ผู้เยี่ยมชม', value: 'GUEST' },
        { label: 'พนักงาน', value: 'STAFF' },
        { label: 'ผู้ดูแลระบบ', value: 'ADMIN' },
        { label: 'แพทย์', value: 'DOCTOR' }
      ]
    }
  },
  computed: {
    isEdit() {
      return !!(this.form && this.form.id)
    }
  },
  watch: {
    initialData: {
      immediate: true,
      handler(v) {
        if (v) {
          this.form = {
            id: v.id || null,
            name: v.name || '',
            email: v.email || '',
            password: '',
            role: v.role || 'GUEST',
            branchId: v.branchId || null,
            isActive: v.isActive ?? true
          }
        } else {
          this.form = {
            id: null,
            name: '',
            email: '',
            password: '',
            role: 'GUEST',
            branchId: null,
            isActive: true
          }
        }
        this.errors = {}
        this.originalSnapshot = JSON.stringify(this.form)
      }
    },
    branchSearchQuery() {
      // Trigger search when query changes
      this.onBranchSearchInput()
    }
  },
  async mounted() {
    await this.loadData()
  },
  beforeUnmount() {
    // Cleanup timer
    if (this.branchSearchTimer) {
      clearTimeout(this.branchSearchTimer)
    }
  },
  methods: {
    async loadData() {
      try {
        const branchesData = await branchService.getAllForDropdown('', 20)
        this.branches = branchesData
        this.filteredBranches = branchesData
      } catch (error) {
        console.error('Error loading data:', error)
      }
    },
    async onClose() {
      // Don't close main modal if password modal is open
      if (this.changePasswordModalOpen) {
        return
      }

      const isDirty = JSON.stringify(this.form) !== this.originalSnapshot
      if (isDirty) {
        this.showConfirmClose = true
        return
      }
      this.resetForm()
      this.$emit('update:modelValue', false)
    },
    requestClose() {
      this.onClose()
    },
    forceClose() {
      this.resetForm()
      this.showConfirmClose = false
      this.$emit('update:modelValue', false)
    },
    resetForm() {
      if (this.initialData) {
        this.form = {
          id: this.initialData.id || null,
          name: this.initialData.name || '',
          email: this.initialData.email || '',
          password: '',
          role: this.initialData.role || 'GUEST',
          branchId: this.initialData.branchId || null,
          staffLevelId: this.initialData.staffLevelId || null,
          isActive: this.initialData.isActive ?? true
        }
      } else {
        this.form = {
          id: null,
          name: '',
          email: '',
          password: '',
          role: 'GUEST',
          branchId: null,
          isActive: true
        }
      }
      this.originalSnapshot = JSON.stringify(this.form)
      // Reset search queries
      this.branchSearchQuery = ''
    },
    validate() {
      const e = {}
      if (!this.form.name) e.name = 'กรุณากรอกชื่อ'
      if (!this.form.email) e.email = 'กรุณากรอกอีเมล'
      if (!this.isEdit && !this.form.password) e.password = 'กรุณากรอกรหัสผ่าน'
      if (!this.form.role) e.role = 'กรุณาเลือกบทบาท'

      // Email format validation
      if (this.form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        e.email = 'รูปแบบอีเมลไม่ถูกต้อง'
      }

      // Password length validation
      if (!this.isEdit && this.form.password && this.form.password.length < 6) {
        e.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
      }

      this.errors = e
      return Object.keys(e).length === 0
    },
    onSave() {
      if (!this.validate()) return

      // Prepare data for saving
      const dataToSave = { ...this.form }

      // Remove password field if editing and password is empty
      if (this.isEdit && !dataToSave.password) {
        delete dataToSave.password
      }

      this.$emit('save', dataToSave)
    },
    getRoleLabel(role) {
      const option = this.roleOptions.find(opt => opt.value === role)
      return option ? option.label : role
    },
    getBranchName(branchId) {
      if (!branchId) return 'ไม่ระบุสาขา'
      const branch = this.branches.find(b => b.id === branchId)
      return branch ? branch.name : 'ไม่ระบุสาขา'
    },
    getBranchCode(branchId) {
      if (!branchId) return null
      const branch = this.branches.find(b => b.id === branchId)
      return branch ? branch.code : null
    },
    openChangePasswordModal() {
      // Blur current focused element first
      if (document.activeElement) {
        document.activeElement.blur()
      }

      this.changePasswordModalOpen = true
      this.newPassword = ''
      this.confirmPassword = ''
      this.passwordError = ''
      this.confirmPasswordError = ''

      // Focus on input after modal opens
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.$refs.newPasswordInput) {
            this.$refs.newPasswordInput.focus()
          }
        }, 200)
      })
    },
    validatePasswordChange() {
      this.passwordError = ''
      this.confirmPasswordError = ''

      if (!this.newPassword) {
        this.passwordError = 'กรุณากรอกรหัสผ่านใหม่'
        return false
      }

      if (this.newPassword.length < 6) {
        this.passwordError = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
        return false
      }

      if (!this.confirmPassword) {
        this.confirmPasswordError = 'กรุณายืนยันรหัสผ่าน'
        return false
      }

      if (this.newPassword !== this.confirmPassword) {
        this.confirmPasswordError = 'รหัสผ่านไม่ตรงกัน'
        return false
      }

      return true
    },
    async handleChangePassword() {
      if (!this.validatePasswordChange()) return

      this.passwordLoading = true
      try {
        await userService.updatePassword(this.form.id, this.newPassword)
        this.closeChangePasswordModal()
        this.$emit('passwordChanged')
        // Show success message
        const Swal = (await import('sweetalert2')).default
        Swal.fire({
          icon: 'success',
          title: 'เปลี่ยนรหัสผ่านสำเร็จ',
          timer: 1600,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        })
      } catch (error) {
        this.passwordError =
          error?.response?.data?.message || error.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน'
      } finally {
        this.passwordLoading = false
      }
    },
    closeChangePasswordModal() {
      this.changePasswordModalOpen = false
      this.newPassword = ''
      this.confirmPassword = ''
      this.passwordError = ''
      this.confirmPasswordError = ''
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
          this.filteredBranches = branches
        } catch (error) {
          console.error('Error searching branches:', error)
        }
      }, 300) // 300ms delay
    }
  }
}
</script>

<style scoped></style>
