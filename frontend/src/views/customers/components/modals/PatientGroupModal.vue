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
                  isEdit ? 'แก้ไขกลุ่มลูกค้า' : 'เพิ่มกลุ่มลูกค้าใหม่'
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
                <!-- First Row: Name and Discount Type -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Name -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700"
                      >ชื่อกลุ่มลูกค้า <span class="text-red-500">*</span></label
                    >
                    <input
                      v-model.trim="form.name"
                      type="text"
                      class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 hover:border-emerald-300 focus:outline-none"
                      placeholder="เช่น Walk-in, Corporate, VIP"
                    />
                    <p v-if="errors.name" class="text-xs text-red-600 mt-1">{{ errors.name }}</p>
                  </div>

                  <!-- Discount Type -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700">ประเภทส่วนลด</label>
                    <Listbox v-model="form.discount_type" as="div" class="relative">
                      <div>
                        <ListboxButton
                          class="mt-1 w-full px-3 py-2 text-left bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 hover:border-emerald-300 focus:outline-none"
                        >
                          <span class="block truncate">{{
                            getDiscountTypeLabel(form.discount_type)
                          }}</span>
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
                            v-for="discountType in discountTypeOptions"
                            :key="discountType.value"
                            :value="discountType.value"
                            v-slot="{ active, selected }"
                          >
                            <li
                              :class="[
                                active ? 'bg-emerald-50 text-emerald-700' : 'text-gray-900',
                                'cursor-pointer select-none relative py-2 pl-3 pr-9',
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
                                  active ? 'text-emerald-600' : 'text-emerald-600',
                                  'absolute inset-y-0 right-0 flex items-center pr-4',
                                ]"
                              >
                                <CheckIcon class="w-4 h-4" />
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
                    <label class="block text-sm font-medium text-gray-700">จำนวนส่วนลด</label>
                    <div class="relative mt-1">
                      <input
                        v-model.number="form.discount_amount"
                        type="number"
                        min="0"
                        step="0.01"
                        class="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 hover:border-emerald-300 focus:outline-none"
                        :placeholder="form.discount_type === 'percent' ? '10' : '100'"
                      />
                      <div
                        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                      >
                        <span class="text-gray-500 text-sm">{{
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
                  <label class="block text-sm font-medium text-gray-700">หมายเหตุ</label>
                  <textarea
                    v-model.trim="form.note"
                    rows="3"
                    class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 hover:border-emerald-300 focus:outline-none"
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
                      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none"
                      :class="form.isActive ? 'bg-emerald-600' : 'bg-gray-300'"
                    >
                      <span class="sr-only">สลับเปิด/ปิดการใช้งาน</span>
                      <span
                        :class="form.isActive ? 'translate-x-5' : 'translate-x-1'"
                        class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition"
                      ></span>
                    </button>
                    <span
                      class="ml-3 text-sm"
                      :class="form.isActive ? 'text-emerald-700' : 'text-gray-600'"
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
import { X, ChevronDown, CheckIcon } from 'lucide-vue-next'
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
    CheckIcon,
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
            color: v.color || '#22C55E',
            discount_type: v.discount_type || '',
            discount_amount: v.discount_amount || null,
            isActive: v.isActive ?? true,
          }
        } else {
          this.resetForm()
        }
        this.errors = {}
        this.originalSnapshot = JSON.stringify(this.form)
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
        this.form = {
          id: null,
          name: '',
          note: '',
          color: '#22C55E',
          discount_type: '',
          discount_amount: null,
          isActive: true,
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
