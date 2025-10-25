<template>
  <TransitionRoot appear :show="isOpen" as="template">
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
              class="w-full max-w-lg transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all"
            >
              <!-- Header -->
              <div
                class="flex items-center justify-between px-6 pt-5 pb-4 rounded-t-2xl border-b border-gray-100 bg-white"
              >
                <DialogTitle as="h3" class="text-gray-900 text-lg font-semibold">{{
                  isEdit ? 'แก้ไขแผนก' : 'เพิ่มแผนกใหม่'
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
                <!-- Department Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >ชื่อแผนก <span class="text-red-500">*</span></label
                  >
                  <input
                    v-model.trim="form.name"
                    type="text"
                    class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                    placeholder="เช่น OPD, IPD, คลินิกเฉพาะทาง"
                  />
                  <p v-if="errors.name" class="text-xs text-red-600 mt-1">{{ errors.name }}</p>
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

              <!-- Footer -->
              <div class="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-2xl">
                <button
                  @click="requestClose"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
                >
                  ยกเลิก
                </button>
                <button
                  @click="handleSubmit"
                  :disabled="loading"
                  class="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
                >
                  <div v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {{ loading ? 'กำลังบันทึก...' : (isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มแผนก') }}
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
import { X } from 'lucide-vue-next'
import {
  Dialog as DialogModal,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'
import ConfirmClosePopover from '@/components/ConfirmClosePopover.vue'
import departmentService from '@/services/department.js'

export default {
  name: 'DepartmentModal',
  components: {
    X,
    DialogModal,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    ConfirmClosePopover
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    department: {
      type: Object,
      default: null
    },
    mode: {
      type: String,
      default: 'create' // 'create' or 'edit'
    }
  },
  emits: ['close', 'saved'],
  data() {
    return {
      loading: false,
      showConfirmClose: false,
      errors: {},
      form: {
        name: '',
        isActive: true
      }
    }
  },
  computed: {
    isEdit() {
      return this.mode === 'edit'
    }
  },
  methods: {
    resetForm() {
      this.form = {
        name: '',
        isActive: true
      }
      this.errors = {}
    },
    validateForm() {
      this.errors = {}
      
      if (!this.form.name.trim()) {
        this.errors.name = 'กรุณากรอกชื่อแผนก'
        return false
      }
      
      if (this.form.name.trim().length < 2) {
        this.errors.name = 'ชื่อแผนกต้องมีอย่างน้อย 2 ตัวอักษร'
        return false
      }
      
      return true
    },
    async handleSubmit() {
      if (!this.validateForm()) return
      
      try {
        this.loading = true
        
        if (this.isEdit) {
          await departmentService.update(this.department.id, {
            name: this.form.name.trim(),
            isActive: this.form.isActive
          })
        } else {
          await departmentService.create({
            name: this.form.name.trim()
          })
        }
        
        this.$emit('saved')
      } catch (error) {
        console.error('Error saving department:', error)
        
        if (error.response?.data?.message) {
          this.errors.name = error.response.data.message
        } else {
          this.errors.name = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
        }
      } finally {
        this.loading = false
      }
    },
    requestClose() {
      if (this.loading) return
      
      // Check if form has changes
      const hasChanges = this.isEdit 
        ? (this.form.name !== this.department?.name || this.form.isActive !== this.department?.isActive)
        : this.form.name.trim() !== ''
      
      if (hasChanges) {
        this.showConfirmClose = true
      } else {
        this.forceClose()
      }
    },
    forceClose() {
      this.showConfirmClose = false
      this.resetForm()
      this.$emit('close')
    }
  },
  watch: {
    isOpen(newValue) {
      if (newValue) {
        this.resetForm()
        if (this.isEdit && this.department) {
          this.form = {
            name: this.department.name || '',
            isActive: this.department.isActive ?? true
          }
        }
      }
    },
    department: {
      handler(newValue) {
        if (newValue && this.isEdit) {
          this.form = {
            name: newValue.name || '',
            isActive: newValue.isActive ?? true
          }
        }
      },
      deep: true
    }
  }
}
</script>