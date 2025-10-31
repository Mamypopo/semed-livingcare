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
                class="flex items-center justify-between px-6 pt-5 pb-4 rounded-t-2xl border-b border-slate-200/50 bg-white"
              >
                <DialogTitle as="h3" class="text-slate-800 text-lg font-semibold">{{
                  isEdit ? 'แก้ไขประเภทประกัน' : 'เพิ่มประเภทประกันใหม่'
                }}</DialogTitle>
                <button
                  @click="requestClose"
                  class="text-slate-400 hover:text-red-500 bg-slate-50 rounded-md p-1 transition-colors relative"
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
                  <!-- Code -->
                  <div>
                    <label class="block text-sm font-medium text-slate-700"
                      >รหัสประเภทประกัน *</label
                    >
                    <input
                      v-model.trim="form.code"
                      type="text"
                      class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm 
       bg-white text-gray-700 placeholder-gray-400 
       focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80
       focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                      placeholder="เช่น SSI, CSM, AET"
                    />
                    <p v-if="errors.code" class="text-xs text-red-600 mt-1">{{ errors.code }}</p>
                  </div>

                  <!-- Name -->
                  <div>
                    <label class="block text-sm font-medium text-slate-700"
                      >ชื่อประเภทประกัน *</label
                    >
                    <input
                      v-model.trim="form.name"
                      type="text"
                      class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm 
       bg-white text-gray-700 placeholder-gray-400 
       focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80
       focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                      placeholder="เช่น สังคมสงเคราะห์, เอกชน, ราชการ"
                    />
                    <p v-if="errors.name" class="text-xs text-red-600 mt-1">{{ errors.name }}</p>
                  </div>

                  <!-- Note -->
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-slate-700">หมายเหตุ</label>
                    <textarea
                      v-model.trim="form.note"
                      rows="3"
                      class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm 
       bg-white text-gray-700 placeholder-gray-400 
       focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80
       focus:outline-none transition-colors duration-200 hover:border-emerald-400"                      placeholder="หมายเหตุเพิ่มเติม..."
                    ></textarea>
                    <p v-if="errors.note" class="text-xs text-red-600 mt-1">{{ errors.note }}</p>
                  </div>

                  <!-- Active Status -->
                  <div class="md:col-span-2">
                    <div class="flex items-center">
                      <button
                        type="button"
                        @click="form.isActive = !form.isActive"
                        :aria-pressed="form.isActive"
                        class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
                        :class="form.isActive ? 'bg-emerald-400' : 'bg-gray-300'"
                      >
                        <span class="sr-only">สลับเปิด/ปิดการใช้งาน</span>
                        <span
                          :class="form.isActive ? 'translate-x-5' : 'translate-x-0'"
                          class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition"
                        ></span>
                      </button>
                      <span
                        class="ml-3 text-sm text-slate-700"
                      >
                        {{ form.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="px-6 pb-6 pt-2 flex justify-end gap-2 border-t border-slate-200/50 bg-white rounded-b-2xl"
              >
                <button
                  type="button"
                  class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300 transition-all duration-200 shadow-sm hover:shadow"
                  @click="requestClose"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-white bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
import ConfirmClosePopover from '@/components/ConfirmClosePopover.vue'

export default {
  name: 'InsuranceTypeModal',
  components: {
    DialogModal: Dialog,
    DialogPanel,
    DialogTitle,
    TransitionRoot,
    TransitionChild,
    X,
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
        code: '',
        name: '',
        note: '',
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
    },
    defaultForm() {
      return {
        id: null,
        code: '',
        name: '',
        note: '',
        isActive: true,
      }
    },
  },
  watch: {
    modelValue: {
      handler(newValue) {
        if (newValue) {
          // Modal เปิด - reset form
          this.resetForm()
        } else {
          // Modal ปิด - cleanup
          this.errors = {}
          this.showConfirmClose = false
        }
      },
    },
    initialData: {
      immediate: true,
      handler(v) {
        this.resetForm()
      },
    },
  },
  methods: {
    resetForm() {
      if (this.initialData) {
        this.form = {
          id: this.initialData.id || null,
          code: this.initialData.code || '',
          name: this.initialData.name || '',
          note: this.initialData.note || '',
          isActive: this.initialData.isActive ?? true,
        }
      } else {
        this.form = { ...this.defaultForm }
      }
      this.errors = {}
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
      if (!this.form.code) e.code = 'กรุณากรอกรหัสประเภทประกัน'
      if (!this.form.name) e.name = 'กรุณากรอกชื่อประเภทประกัน'

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
        this.$emit('update:modelValue', false)
      }
    },
    requestClose() {
      this.onClose()
    },
    forceClose() {
      this.showConfirmClose = false
      this.$emit('update:modelValue', false)
    }
  }
}
</script>
