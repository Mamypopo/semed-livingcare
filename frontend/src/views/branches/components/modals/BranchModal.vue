<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <BranchDialog as="div" class="relative z-50" @close="requestClose">
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
              class="w-full max-w-xl transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all"
            >
              <!-- Header (match Auth style: clean, light) -->
              <div
                class="flex items-center justify-between px-6 pt-5 pb-4 rounded-t-2xl border-b border-slate-200/50 bg-white"
              >
                <DialogTitle as="h3" class="text-slate-800 text-lg font-semibold">{{
                  isEdit ? 'แก้ไขสาขา' : 'เพิ่มสาขาใหม่'
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
                <div class="grid grid-cols-1 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-700">รหัสสาขา</label>
                    <input
                      v-model.trim="form.code"
                      type="text"
                      :readonly="true"
                      disabled
                      class="mt-1 w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg shadow-sm text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                    />
                    <p v-if="errors.code" class="text-xs text-red-600 mt-1">{{ errors.code }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700">ชื่อสาขา</label>
                    <input
                      v-model.trim="form.name"
                      type="text"
                      class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                    />
                    <p v-if="errors.name" class="text-xs text-red-600 mt-1">{{ errors.name }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700">ที่อยู่</label>
                    <textarea
                      v-model.trim="form.address"
                      rows="3"
                      class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                    ></textarea>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
 <div>
                    <label class="block text-sm font-medium text-slate-700">โทรศัพท์</label>
                    <input
                      v-model.trim="form.phone"
                      type="text"
                      class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700">อีเมล</label>
                    <input
                      v-model.trim="form.email"
                      type="email"
                      class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                    />
                  </div>
                    </div>
                 
                  <div>
                    <label class="block text-sm font-medium text-slate-700">เลขที่หนังสือรับรอง</label>
                    <input
                      v-model.trim="form.licenseNumber"
                      type="text"
                      class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                    />
                  </div>
                  <div class="space-y-4">
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
                      <span class="ml-3 text-sm text-slate-700">
                        {{ form.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน' }}
                      </span>
                    </div>
                    
                    <div class="flex items-center">
                      <button
                        type="button"
                        @click="form.isMainBranch = !form.isMainBranch"
                        :aria-pressed="form.isMainBranch"
                        class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
                        :class="form.isMainBranch ? 'bg-emerald-400' : 'bg-gray-300'"
                      >
                        <span class="sr-only">สลับสาขาหลัก</span>
                        <span
                          :class="form.isMainBranch ? 'translate-x-5' : 'translate-x-0'"
                          class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition"
                        ></span>
                      </button>
                      <span class="ml-3 text-sm text-slate-700">
                        {{ form.isMainBranch ? 'สาขาหลัก' : 'สาขาย่อย' }}
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
                  @click="onSave"
                >
                  {{ loading ? 'กำลังบันทึก...' : isEdit ? 'บันทึกการแก้ไข' : 'บันทึก' }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </BranchDialog>
  </TransitionRoot>
</template>

<script>
import { Dialog as HeadlessDialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import ConfirmClosePopover from '@/components/ConfirmClosePopover.vue'
import { X } from 'lucide-vue-next'

export default {
  name: 'BranchModal',
  components: {
    BranchDialog: HeadlessDialog,
    DialogPanel,
    DialogTitle,
    TransitionRoot,
    TransitionChild,
    ConfirmClosePopover,
    X,
  },
  props: {
    modelValue: { type: Boolean, required: true },
    initialData: { type: Object, default: null },
    loading: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'save'],
  data() {
    return {
      form: { id: null, code: '', name: '', address: '', phone: '', email: '', licenseNumber: '', isActive: true, isMainBranch: false },
      errors: {},
      originalSnapshot: null,
      showConfirmClose: false,
    }
  },
  computed: {
    isEdit() {
      return !!(this.form && this.form.id)
    },
  },
  watch: {
    initialData: {
      immediate: true,
      handler(v) {
        if (v) {
          this.form = {
            id: v.id || null,
            code: v.code || '',
            name: v.name || '',
            address: v.address || '',
            phone: v.phone || '',
            email: v.email || '',
            licenseNumber: v.licenseNumber || '',
            isActive: v.isActive ?? true,
            isMainBranch: v.isMainBranch ?? false,
          }
        } else {
          this.form = { id: null, code: '', name: '', address: '', phone: '', email: '', licenseNumber: '', isActive: true, isMainBranch: false }
        }
        this.errors = {}
        this.originalSnapshot = JSON.stringify(this.form)
      },
    },
  },
  methods: {
    async onClose() {
      const isDirty = JSON.stringify(this.form) !== this.originalSnapshot
      if (isDirty) {
        this.showConfirmClose = true
        return
      }
      // reset to initial empty or initialData
      if (this.initialData) {
        this.form = {
          id: this.initialData.id || null,
          code: this.initialData.code || '',
          name: this.initialData.name || '',
          address: this.initialData.address || '',
          phone: this.initialData.phone || '',
          email: this.initialData.email || '',
          licenseNumber: this.initialData.licenseNumber || '',
          isActive: this.initialData.isActive ?? true,
          isMainBranch: this.initialData.isMainBranch ?? false,
        }
      } else {
        this.form = { id: null, code: '', name: '', address: '', phone: '', email: '', licenseNumber: '', isActive: true, isMainBranch: false }
      }
      this.originalSnapshot = JSON.stringify(this.form)
      this.$emit('update:modelValue', false)
    },
    requestClose() {
      this.onClose()
    },
    forceClose() {
      // reset to initial empty or initialData then close
      if (this.initialData) {
        this.form = {
          id: this.initialData.id || null,
          code: this.initialData.code || '',
          name: this.initialData.name || '',
          address: this.initialData.address || '',
          phone: this.initialData.phone || '',
          email: this.initialData.email || '',
          licenseNumber: this.initialData.licenseNumber || '',
          isActive: this.initialData.isActive ?? true,
          isMainBranch: this.initialData.isMainBranch ?? false,
        }
      } else {
        this.form = { id: null, code: '', name: '', address: '', phone: '', email: '', licenseNumber: '', isActive: true, isMainBranch: false }
      }
      this.originalSnapshot = JSON.stringify(this.form)
      this.showConfirmClose = false
      this.$emit('update:modelValue', false)
    },
    validate() {
      const e = {}
      if (!this.form.code) e.code = 'กรุณากรอกรหัสสาขา'
      if (!this.form.name) e.name = 'กรุณากรอกชื่อสาขา'
      if (!this.form.licenseNumber) e.licenseNumber = 'กรุณากรอกเลขที่หนังสือรับรอง'
      this.errors = e
      return Object.keys(e).length === 0
    },
    onSave() {
      if (!this.validate()) return
      this.$emit('save', { ...this.form })
    },
  },
}
</script>

<style scoped></style>
