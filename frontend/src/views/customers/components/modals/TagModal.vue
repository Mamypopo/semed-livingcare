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
                  isEdit ? 'แก้ไขแท็ก' : 'เพิ่มแท็กใหม่'
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
                <!-- First Row: Name and Color -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Name -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700"
                      >ชื่อแท็ก <span class="text-red-500">*</span></label
                    >
                    <input
                      v-model.trim="form.name"
                      type="text"
                      class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm 
       bg-white text-gray-700 placeholder-gray-400 
       focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80
       focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                      placeholder="เช่น VIP, Walk-in, Corporate"
                    />
                    <p v-if="errors.name" class="text-xs text-red-600 mt-1">{{ errors.name }}</p>
                  </div>

                  <!-- Color -->
                  <div>
                    <ColorPicker
                      v-model="form.color"
                      label="สี"
                      placeholder="#3B82F6"
                      :error="errors.color"
                    />
                  </div>
                </div>

                <!-- Second Row: Note (Full Width) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">หมายเหตุ</label>
                  <textarea
                    v-model.trim="form.note"
                    rows="3"
                    class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm 
       bg-white text-gray-700 placeholder-gray-400 
       focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80
       focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                    placeholder="หมายเหตุเพิ่มเติม..."
                  ></textarea>
                  <p v-if="errors.note" class="text-xs text-red-600 mt-1">{{ errors.note }}</p>
                </div>

                <!-- Third Row: Active Status (Full Width) -->
                <div>
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
                  @click="onSubmit"
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
</template>

<script>
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { X } from 'lucide-vue-next'
import ColorPicker from '@/components/ColorPicker.vue'
import ConfirmClosePopover from '@/components/ConfirmClosePopover.vue'

export default {
  name: 'TagModal',
  components: {
    DialogModal: Dialog,
    DialogPanel,
    DialogTitle,
    TransitionRoot,
    TransitionChild,
    X,
    ColorPicker,
    ConfirmClosePopover
  },
  props: {
    modelValue: { type: Boolean, required: true },
    initialData: { type: Object, default: null },
    loading: { type: Boolean, default: false }
  },
  emits: ['update:modelValue', 'save'],
  data() {
    return {
      form: {
        id: null,
        name: '',
        note: '',
        color: '#3B82F6',
        isActive: true
      },
      errors: {},
      originalSnapshot: null,
      showConfirmClose: false
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
            note: v.note || '',
            color: v.color || '#3B82F6',
            isActive: v.isActive ?? true
          }
        } else {
          this.resetForm()
        }
        this.errors = {}
        this.originalSnapshot = JSON.stringify(this.form)
      }
    }
  },
  methods: {
    resetForm() {
      if (this.initialData) {
        this.form = {
          id: this.initialData.id || null,
          name: this.initialData.name || '',
          note: this.initialData.note || '',
          color: this.initialData.color || '#3B82F6',
          isActive: this.initialData.isActive ?? true
        }
      } else {
        this.form = {
          id: null,
          name: '',
          note: '',
          color: '#3B82F6',
          isActive: true
        }
      }
      this.originalSnapshot = JSON.stringify(this.form)
    },

    async onSubmit() {
      if (!this.validate()) return

      // Prepare data for saving
      const dataToSave = { ...this.form }

      this.$emit('save', dataToSave)
    },

    validate() {
      const e = {}
      if (!this.form.name) e.name = 'กรุณากรอกชื่อแท็ก'

      // Color format validation
      if (this.form.color && !/^#[0-9A-F]{6}$/i.test(this.form.color)) {
        e.color = 'รูปแบบสีไม่ถูกต้อง (ต้องเป็น #RRGGBB)'
      }

      this.errors = e
      return Object.keys(e).length === 0
    },

    onClose() {
      if (!this.loading) {
        const isDirty = JSON.stringify(this.form) !== this.originalSnapshot
        if (isDirty) {
          this.showConfirmClose = true
          return
        }
        this.resetForm()
        this.$emit('update:modelValue', false)
      }
    },
    requestClose() {
      this.onClose()
    },
    forceClose() {
      this.resetForm()
      this.showConfirmClose = false
      this.$emit('update:modelValue', false)
    }
  }
}
</script>
