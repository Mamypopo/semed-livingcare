<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <DialogModal as="div" class="relative z-50" @close="requestClose">
      <TransitionChild as="template" enter="ease-out duration-200" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-150" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild as="template" enter="ease-out duration-200" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="ease-in duration-150" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
            <DialogPanel class="w-full max-w-xl transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
              <!-- Header -->
              <div class="flex items-center justify-between px-6 pt-5 pb-4 rounded-t-2xl border-b border-slate-200/50 bg-white">
                <DialogTitle as="h3" class="text-slate-800 text-lg font-semibold">{{ isEdit ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่' }}</DialogTitle>
                <button @click="requestClose" class="text-slate-400 hover:text-red-500 bg-slate-50 rounded-md p-1 transition-colors relative">
                  <X class="w-5 h-5" />
                  <ConfirmClosePopover
                    v-if="showConfirmClose"
                    @cancel="showConfirmClose = false"
                    @confirm="forceClose"
                  />
                </button>
              </div>

              <!-- Body -->
              <div class="px-6 py-5 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700">ชื่อหมวดหมู่ <span class="text-red-500">*</span></label>
                  <input v-model.trim="form.name" type="text" class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400" placeholder="เช่น ตรวจทั่วไป" />
                  <p v-if="errors.name" class="text-xs text-red-600 mt-1">{{ errors.name }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-700">ประเภท <span class="text-red-500">*</span></label>
                  <Listbox v-model="form.categoryType" as="div" class="relative">
                    <div>
                      <ListboxButton class="mt-1 relative w-full px-3 py-2 text-left bg-white hover:bg-slate-50 text-slate-700 border border-gray-200 rounded-lg shadow-sm focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80">
                        <div class="flex items-center gap-2">
                          <div v-if="getTypeColor(form.categoryType)" class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ backgroundColor: getTypeColor(form.categoryType) }"></div>
                          <span class="block truncate">{{ getTypeLabel(form.categoryType) }}</span>
                        </div>
                        <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"><ChevronDown class="w-4 h-4 text-slate-400" /></span>
                      </ListboxButton>
                    </div>
                    <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                      <ListboxOptions class="absolute z-50 mt-2 w-full bg-white rounded-xl border border-gray-200/50 p-2 shadow-xl focus:outline-none">
                        <ListboxOption v-for="opt in typeOptions" :key="opt.value" :value="opt.value" v-slot="{ active, selected }">
                          <li :class="['cursor-pointer select-none relative py-2 pl-3 pr-9 rounded-lg transition-colors', active ? 'bg-emerald-50 text-slate-800' : 'text-slate-700 hover:bg-slate-50']">
                            <div class="flex items-center gap-2">
                              <div v-if="opt.color" class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ backgroundColor: opt.color }"></div>
                              <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ opt.label }}</span>
                            </div>
                            <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-4 text-emerald-500 text-xs">เลือก</span>
                          </li>
                        </ListboxOption>
                      </ListboxOptions>
                    </transition>
                  </Listbox>
                  <p v-if="errors.categoryType" class="text-xs text-red-600 mt-1">{{ errors.categoryType }}</p>
                </div>
              </div>

              <!-- Footer -->
              <div class="px-6 pb-6 pt-2 flex justify-end gap-2 border-t border-slate-200/50 bg-white rounded-b-2xl">
                <button type="button" class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300 transition-all duration-200 shadow-sm hover:shadow" @click="requestClose">ยกเลิก</button>
                <button type="button" class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-white bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="loading" @click="onSubmit">{{ loading ? 'กำลังบันทึก...' : isEdit ? 'บันทึกการแก้ไข' : 'บันทึก' }}</button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </DialogModal>
  </TransitionRoot>
</template>

<script>
import { Dialog as DialogModal, DialogPanel, DialogTitle, TransitionRoot, TransitionChild, Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { X, ChevronDown } from 'lucide-vue-next'
import ConfirmClosePopover from '@/components/ConfirmClosePopover.vue'

export default {
  name: 'ItemCategoryModal',
  components: { DialogModal, DialogPanel, DialogTitle, TransitionRoot, TransitionChild, Listbox, ListboxButton, ListboxOptions, ListboxOption, X, ChevronDown, ConfirmClosePopover },
  props: { modelValue: { type: Boolean, required: true }, initialData: { type: Object, default: null }, loading: { type: Boolean, default: false } },
  emits: ['update:modelValue', 'save'],
  data() {
    return {
      form: { id: null, name: '', categoryType: '' },
      errors: {},
      showConfirmClose: false,
      originalSnapshot: '',
      typeOptions: [
        { label: 'ยา/อุปกรณ์', value: 'DRUG_SUPPLY', color: '#10b981' },
        { label: 'คอร์ส/โปรแกรม', value: 'COURSE', color: '#3b82f6' },
        { label: 'การตรวจ/Lab/X-Ray', value: 'LAB_XRAY', color: '#f59e0b' },
        { label: 'รายการวินิจฉัย', value: 'DIAGNOSIS', color: '#ef4444' },
        { label: 'คำแนะนำ/อ้างอิง', value: 'ADVICE_REFERENCE', color: '#8b5cf6' },
        { label: 'ค่าใช้จ่ายอื่นๆ', value: 'EXPENSE', color: '#6b7280' }
      ]
    }
  },
  computed: {
    isEdit() { return !!this.form.id },
    typeMap() { return Object.fromEntries(this.typeOptions.map(t => [t.value, t.label])) },
    typeColorMap() { return Object.fromEntries(this.typeOptions.map(t => [t.value, t.color])) }
  },
  watch: {
    modelValue(val) {
      if (val) {
        this.resetForm()
      }
    },
    initialData: {
      immediate: true,
      handler() { this.resetForm() }
    }
  },
  methods: {
    resetForm() {
      if (this.initialData) {
        this.form = { id: this.initialData.id || null, name: this.initialData.name || '', categoryType: this.initialData.categoryType || '' }
      } else {
        this.form = { id: null, name: '', categoryType: '' }
      }
      this.errors = {}
      this.originalSnapshot = JSON.stringify(this.form)
      this.showConfirmClose = false
    },
    requestClose() {
      const isDirty = JSON.stringify(this.form) !== this.originalSnapshot
      if (isDirty) {
        this.showConfirmClose = true
        return
      }
      this.$emit('update:modelValue', false)
    },
    forceClose() {
      this.showConfirmClose = false
      this.resetForm()
      this.$emit('update:modelValue', false)
    },
    onSubmit() {
      const e = {}
      if (!this.form.name || !this.form.name.trim()) e.name = 'กรุณากรอกชื่อหมวดหมู่'
      if (!this.form.categoryType) e.categoryType = 'กรุณาเลือกประเภท'
      this.errors = e
      if (Object.keys(e).length) return
      this.$emit('save', { ...this.form })
    },
    getTypeLabel(v) { return this.typeMap[v] || 'เลือกประเภท' },
    getTypeColor(v) { return this.typeColorMap[v] || null }
  }
}
</script>

<style scoped></style>


