<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" class="relative z-50" @close="requestClose">
      <TransitionChild as="template" enter="ease-out duration-200" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-150" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild as="template" enter="ease-out duration-200" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="ease-in duration-150" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
            <DialogPanel class="w-full max-w-xl transform rounded-2xl bg-white text-left align-middle shadow-2xl transition-all">
              <!-- Header -->
              <div class="flex items-center justify-between px-6 pt-5 pb-4 rounded-t-2xl bg-gradient-to-r from-emerald-500 to-emerald-600">
                <DialogTitle as="h3" class="text-white text-lg font-semibold">{{ isEdit ? 'แก้ไขสาขา' : 'เพิ่มสาขาใหม่' }}</DialogTitle>
                <button @click="requestClose" class="text-white/90 hover:text-white transition-colors relative">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 11-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd"/></svg>
                  <ConfirmClosePopover v-if="showConfirmClose" @cancel="showConfirmClose=false" @confirm="forceClose" />
                </button>
              </div>

              <div class="px-6 py-5 space-y-4">
                <div class="grid grid-cols-1 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">รหัสสาขา</label>
                    <input v-model.trim="form.code" type="text" class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                    <p v-if="errors.code" class="text-xs text-red-600 mt-1">{{ errors.code }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">ชื่อสาขา</label>
                    <input v-model.trim="form.name" type="text" class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                    <p v-if="errors.name" class="text-xs text-red-600 mt-1">{{ errors.name }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">ที่อยู่</label>
                    <textarea v-model.trim="form.address" rows="3" class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">โทรศัพท์</label>
                    <input v-model.trim="form.phone" type="text" class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                  </div>
                  <div class="flex items-center">
                    <input id="active" v-model="form.isActive" type="checkbox" class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
                    <label for="active" class="ml-2 text-sm text-gray-700">เปิดใช้งาน</label>
                  </div>
                </div>
              </div>

              <div class="px-6 pb-6 pt-2 flex justify-end gap-2 border-t border-gray-100">
                <button type="button" class="px-4 py-2 text-sm border border-gray-200 rounded-md bg-white text-gray-700 hover:bg-gray-50" @click="requestClose">ยกเลิก</button>
                <button type="button" class="px-4 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 shadow-sm" :disabled="loading" @click="onSave">
                  {{ loading ? 'กำลังบันทึก...' : (isEdit ? 'บันทึกการแก้ไข' : 'บันทึก') }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import ConfirmClosePopover from '@/views/branches/components/modals/ConfirmClosePopover.vue'
import Swal from 'sweetalert2'

export default {
  name: 'BranchModal',
  components: { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild, ConfirmClosePopover },
  props: {
    modelValue: { type: Boolean, required: true },
    initialData: { type: Object, default: null },
    loading: { type: Boolean, default: false }
  },
  emits: ['update:modelValue', 'save'],
  data() {
    return {
      form: { id: null, code: '', name: '', address: '', phone: '', isActive: true },
      errors: {},
      originalSnapshot: null,
      showConfirmClose: false
    }
  },
  computed: {
    isEdit() { return !!(this.form && this.form.id) }
  },
  watch: {
    initialData: {
      immediate: true,
      handler(v) {
        if (v) {
          this.form = { id: v.id || null, code: v.code || '', name: v.name || '', address: v.address || '', phone: v.phone || '', isActive: v.isActive ?? true }
        } else {
          this.form = { id: null, code: '', name: '', address: '', phone: '', isActive: true }
        }
        this.errors = {}
        this.originalSnapshot = JSON.stringify(this.form)
      }
    }
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
        this.form = { id: this.initialData.id || null, code: this.initialData.code || '', name: this.initialData.name || '', address: this.initialData.address || '', phone: this.initialData.phone || '', isActive: this.initialData.isActive ?? true }
      } else {
        this.form = { id: null, code: '', name: '', address: '', phone: '', isActive: true }
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
        this.form = { id: this.initialData.id || null, code: this.initialData.code || '', name: this.initialData.name || '', address: this.initialData.address || '', phone: this.initialData.phone || '', isActive: this.initialData.isActive ?? true }
      } else {
        this.form = { id: null, code: '', name: '', address: '', phone: '', isActive: true }
      }
      this.originalSnapshot = JSON.stringify(this.form)
      this.showConfirmClose = false
      this.$emit('update:modelValue', false)
    },
    validate() {
      const e = {}
      if (!this.form.code) e.code = 'กรุณากรอกรหัสสาขา'
      if (!this.form.name) e.name = 'กรุณากรอกชื่อสาขา'
      this.errors = e
      return Object.keys(e).length === 0
    },
    onSave() {
      if (!this.validate()) return
      this.$emit('save', { ...this.form })
    }
  }
}
</script>

<style scoped>
</style>


