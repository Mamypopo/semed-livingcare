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
                  isEdit ? 'แก้ไขกลุ่มลูกค้า' : 'เพิ่มกลุ่มลูกค้าใหม่'
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
                <!-- First Row: Name and Discount Type -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Name -->
                  <div>
                    <label class="block text-sm font-medium text-slate-700"
                      >ชื่อกลุ่มลูกค้า <span class="text-red-500">*</span></label
                    >
                    <input
                      v-model.trim="form.name"
                      type="text"
                      class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                      placeholder="เช่น Walk-in, Corporate, VIP"
                    />
                    <p v-if="errors.name" class="text-xs text-red-600 mt-1">{{ errors.name }}</p>
                  </div>

                  <!-- Discount Type -->
                  <div>
                    <label class="block text-sm font-medium text-slate-700">ประเภทส่วนลด</label>
                    <Listbox v-model="form.discount_type" as="div" class="relative">
                      <div>
                        <ListboxButton
                          class="mt-1 relative w-full px-3 py-2 text-left bg-white hover:bg-slate-50 text-slate-700 border border-gray-200 rounded-md"
                        >
                          <span class="block truncate">{{
                            getDiscountTypeLabel(form.discount_type)
                          }}</span>
                          <span
                            class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
                          >
                            <ChevronDown class="w-4 h-4 text-slate-400" />
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
                          class="absolute z-50 mt-2 w-full bg-white rounded-xl border border-gray-200/50 p-2 shadow-xl focus:outline-none"
                        >
                          <ListboxOption
                            v-for="discountType in discountTypeOptions"
                            :key="discountType.value"
                            :value="discountType.value"
                            v-slot="{ active, selected }"
                          >
                            <li
                              :class="[
                                'cursor-pointer select-none relative py-2 pl-3 pr-9 rounded-lg transition-colors',
                                active ? 'bg-emerald-50 text-slate-800' : 'text-slate-700 hover:bg-slate-50',
                              ]"
                            >
                              <span
                                :class="[
                                  selected ? 'font-semibold' : 'font-normal',
                                  'block truncate',
                                ]"
                              >
                                {{ discountType.label }}
                              </span>
                              <span
                                v-if="selected"
                                :class="[
                                  'absolute inset-y-0 right-0 flex items-center pr-4',
                                  'text-emerald-500 text-xs',
                                ]"
                              >
                                เลือก
                              </span>
                            </li>
                          </ListboxOption>
                        </ListboxOptions>
                      </transition>
                    </Listbox>
                    <p v-if="errors.discount_type" class="text-xs text-red-600 mt-1">
                      {{ errors.discount_type }}
                    </p>
                  </div>
                </div>

                <!-- Second Row: Color and Discount Amount -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Color -->
                  <div>
                    <ColorPicker
                      v-model="form.color"
                      label="สี"
                      placeholder="#22C55E"
                      :error="errors.color"
                    />
                  </div>

                  <!-- Discount Amount -->
                  <div v-if="form.discount_type">
                    <label class="block text-sm font-medium text-slate-700">จำนวนส่วนลด</label>
                    <div class="relative mt-1">
                      <input
                        v-model.number="form.discount_amount"
                        type="number"
                        min="0"
                        step="0.01"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                        :placeholder="form.discount_type === 'percent' ? '10' : '100'"
                      />
                      <div
                        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                      >
                        <span class="text-slate-500 text-sm">{{
                          form.discount_type === 'percent' ? '%' : 'บาท'
                        }}</span>
                      </div>
                    </div>
                    <p v-if="errors.discount_amount" class="text-xs text-red-600 mt-1">
                      {{ errors.discount_amount }}
                    </p>
                  </div>
                </div>

                <!-- Third Row: Note (Full Width) -->
                <div>
                  <label class="block text-sm font-medium text-slate-700">หมายเหตุ</label>
                  <textarea
                    v-model.trim="form.note"
                    rows="3"
                    class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                    placeholder="หมายเหตุเพิ่มเติม..."
                  ></textarea>
                  <p v-if="errors.note" class="text-xs text-red-600 mt-1">{{ errors.note }}</p>
                </div>

                <!-- Fourth Row: Active Status (Full Width) -->
                <div>
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
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import { X, ChevronDown } from 'lucide-vue-next'
import ColorPicker from '@/components/ColorPicker.vue'
import ConfirmClosePopover from '@/components/ConfirmClosePopover.vue'

export default {
  name: 'PatientGroupModal',
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
    X,
    ChevronDown,
    ColorPicker,
    ConfirmClosePopover,
  },
  props: {
    modelValue: { type: Boolean, required: true },
    initialData: { type: Object, default: null },
    loading: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'save'],
  data() {
    return {
      form: {
        id: null,
        name: '',
        note: '',
        color: '#22C55E',
        discount_type: '',
        discount_amount: null,
        isActive: true,
      },
      errors: {},
      originalSnapshot: null,
      showConfirmClose: false,
      discountTypeOptions: [
        { label: 'ไม่ระบุ', value: '' },
        { label: 'เปอร์เซ็นต์ (%)', value: 'percent' },
        { label: 'จำนวนเงิน (บาท)', value: 'amount' },
      ],
    }
  },
  computed: {
    isEdit() {
      return !!(this.form && this.form.id)
    },
    defaultForm() {
      return {
        id: null,
        name: '',
        note: '',
        color: '#22C55E',
        discount_type: '',
        discount_amount: null,
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
      handler() {
        this.resetForm()
      },
    },
  },
  methods: {
    resetForm() {
      if (this.initialData) {
        this.form = {
          id: this.initialData.id || null,
          name: this.initialData.name || '',
          note: this.initialData.note || '',
          color: this.initialData.color || '#22C55E',
          discount_type: this.initialData.discount_type || '',
          discount_amount: this.initialData.discount_amount || null,
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
      if (!this.form.name) e.name = 'กรุณากรอกชื่อกลุ่มลูกค้า'

      // Color format validation
      if (this.form.color && !/^#[0-9A-F]{6}$/i.test(this.form.color)) {
        e.color = 'รูปแบบสีไม่ถูกต้อง (ต้องเป็น #RRGGBB)'
      }

      // Discount validation
      if (this.form.discount_type && !['percent', 'amount'].includes(this.form.discount_type)) {
        e.discount_type = "ประเภทส่วนลดต้องเป็น 'percent' หรือ 'amount'"
      }

      if (this.form.discount_type && this.form.discount_amount === null) {
        e.discount_amount = 'กรุณากรอกจำนวนส่วนลด'
      } else if (this.form.discount_amount !== null && this.form.discount_amount < 0) {
        e.discount_amount = 'จำนวนส่วนลดต้องไม่เป็นค่าลบ'
      } else if (this.form.discount_type === 'percent' && this.form.discount_amount > 100) {
        e.discount_amount = 'ส่วนลดเปอร์เซ็นต์ต้องไม่เกิน 100'
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
    },

    getDiscountTypeLabel(value) {
      const option = this.discountTypeOptions.find((opt) => opt.value === value)
      return option ? option.label : 'ไม่ระบุ'
    },
  },
}
</script>
