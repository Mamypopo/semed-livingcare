<template>
  <TransitionRoot appear :show="modelValue">
    <DialogModal as="div" class="relative z-50" @close="requestClose">
      <TransitionChild
        as="div"
        enter="ease-out duration-200"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-150"
        leave-from="opacity-100"
        leave-to="opacity-0"
        class="fixed inset-0 bg-black/25"
      />

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            enter="ease-out duration-200"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-150"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-3xl transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all"
            >
              <!-- Header -->
              <div
                class="flex items-center justify-between px-6 pt-5 pb-4 rounded-t-2xl border-b border-slate-200/50 bg-white"
              >
                <DialogTitle as="h3" class="text-slate-800 text-lg font-semibold">{{
                  isEdit ? 'แก้ไขรายการตรวจ' : 'เพิ่มรายการตรวจใหม่'
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
                <!-- Row 1: ชื่อรายการ และ ประเภท -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- ชื่อรายการ -->
                  <div>
                    <label class="block text-sm font-medium text-slate-700"
                      >ชื่อรายการ <span class="text-red-500">*</span></label
                    >
                    <input
                      v-model.trim="form.name"
                      type="text"
                      class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                      placeholder="เช่น ตรวจทั่วไป"
                    />
                    <p v-if="errors.name" class="text-xs text-red-600 mt-1">{{ errors.name }}</p>
                  </div>

                  <!-- ประเภท -->
                  <div>
                    <label class="block text-sm font-medium text-slate-700">ประเภท <span class="text-red-500">*</span></label>
                    <Listbox v-model="form.examType" as="div" class="relative">
                      <div>
                        <ListboxButton
                          class="mt-1 relative w-full px-3 py-2 text-left bg-white hover:bg-slate-50 text-slate-700 border border-gray-200 rounded-lg shadow-sm focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                        >
                          <span class="block truncate">{{
                            getExamTypeLabel(form.examType)
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
                            v-for="examType in examTypeOptions"
                            :key="examType.value"
                            :value="examType.value"
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
                                {{ examType.label }}
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
                    <p v-if="errors.examType" class="text-xs text-red-600 mt-1">
                      {{ errors.examType }}
                    </p>
                  </div>
                </div>

                <!-- Row 2: หมวดหมู่ -->
                <div>
                  <label class="block text-sm font-medium text-slate-700">หมวดหมู่</label>
                  <Listbox v-model="selectedCategory" as="div" class="relative">
                    <div>
                      <ListboxButton
                        class="mt-1 relative w-full px-3 py-2 text-left bg-white hover:bg-slate-50 text-slate-700 border border-gray-200 rounded-lg shadow-sm focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                      >
                        <span class="block truncate">{{
                          selectedCategory?.name || 'เลือกหมวดหมู่'
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
                        class="absolute z-50 mt-2 w-full bg-white rounded-xl border border-gray-200/50 p-2 shadow-xl focus:outline-none max-h-60 overflow-auto"
                      >
                        <ListboxOption
                          :value="null"
                          v-slot="{ active, selected }"
                        >
                          <li
                            :class="[
                              'cursor-pointer select-none relative py-2 pl-3 pr-9 rounded-lg transition-colors',
                              active ? 'bg-emerald-50 text-slate-800' : 'text-slate-700 hover:bg-slate-50',
                            ]"
                          >
                            <span class="block truncate">ไม่มีหมวดหมู่</span>
                            <span
                              v-if="selected"
                              class="absolute inset-y-0 right-0 flex items-center pr-4 text-emerald-500 text-xs"
                            >
                              เลือก
                            </span>
                          </li>
                        </ListboxOption>
                        <ListboxOption
                          v-for="category in categories"
                          :key="category.id"
                          :value="category"
                          v-slot="{ active, selected }"
                        >
                          <li
                            :class="[
                              'cursor-pointer select-none relative py-2 pl-3 pr-9 rounded-lg transition-colors',
                              active ? 'bg-emerald-50 text-slate-800' : 'text-slate-700 hover:bg-slate-50',
                            ]"
                          >
                            <span class="block truncate">{{ category.name }}</span>
                            <span
                              v-if="selected"
                              class="absolute inset-y-0 right-0 flex items-center pr-4 text-emerald-500 text-xs"
                            >
                              เลือก
                            </span>
                          </li>
                        </ListboxOption>
                      </ListboxOptions>
                    </transition>
                  </Listbox>
                  <p v-if="errors.categoryId" class="text-xs text-red-600 mt-1">
                    {{ errors.categoryId }}
                  </p>
                </div>

                <!-- Row 3: รหัสกรมบัญชีกลาง / ชื่อสามัญ / หน่วย -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <!-- รหัสกรมบัญชีกลาง -->
                  <div>
                    <label class="block text-sm font-medium text-slate-700">รหัสกรมบัญชีกลาง</label>
                    <input
                      v-model.trim="form.nhsoCode"
                      type="text"
                      class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                      placeholder="เช่น 12345"
                    />
                    <p v-if="errors.nhsoCode" class="text-xs text-red-600 mt-1">{{ errors.nhsoCode }}</p>
                  </div>

                  <!-- ชื่อสามัญ -->
                  <div>
                    <label class="block text-sm font-medium text-slate-700">ชื่อสามัญ</label>
                    <input
                      v-model.trim="form.genericName"
                      type="text"
                      class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                      placeholder="ชื่อสามัญ"
                    />
                    <p v-if="errors.genericName" class="text-xs text-red-600 mt-1">{{ errors.genericName }}</p>
                  </div>

                  <!-- หน่วย -->
                  <div>
                    <label class="block text-sm font-medium text-slate-700">หน่วย</label>
                    <input
                      v-model.trim="form.unit"
                      type="text"
                      class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                      placeholder="เช่น ครั้ง, ชุด"
                    />
                    <p v-if="errors.unit" class="text-xs text-red-600 mt-1">{{ errors.unit }}</p>
                  </div>
                </div>

                <!-- Row 4: ราคา OPD และ IPD -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- ราคา OPD -->
                  <div>
                    <label class="block text-sm font-medium text-slate-700">ราคา OPD</label>
                    <div class="relative mt-1">
                      <input
                        v-model.number="form.priceOpd"
                        type="number"
                        step="0.01"
                        min="0"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                        placeholder="0.00"
                      />
                      <div
                        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                      >
                        <span class="text-slate-500 text-sm">บาท</span>
                      </div>
                    </div>
                    <p v-if="errors.priceOpd" class="text-xs text-red-600 mt-1">{{ errors.priceOpd }}</p>
                  </div>

                  <!-- ราคา IPD -->
                  <div>
                    <label class="block text-sm font-medium text-slate-700">ราคา IPD</label>
                    <div class="relative mt-1">
                      <input
                        v-model.number="form.priceIpd"
                        type="number"
                        step="0.01"
                        min="0"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                        placeholder="0.00"
                      />
                      <div
                        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                      >
                        <span class="text-slate-500 text-sm">บาท</span>
                      </div>
                    </div>
                    <p v-if="errors.priceIpd" class="text-xs text-red-600 mt-1">{{ errors.priceIpd }}</p>
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
import ConfirmClosePopover from '@/components/ConfirmClosePopover.vue'
import itemCategoryService from '@/services/item-category.js'

export default {
  name: 'MedicalItemModal',
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
        examType: '',
        categoryId: null,
        nhsoCode: '',
        genericName: '',
        unit: '',
        priceOpd: null,
        priceIpd: null,
      },
      errors: {},
      originalSnapshot: null,
      showConfirmClose: false,
      categories: [],
      selectedCategory: null,
      loadingCategories: false,
      examTypeOptions: [
        { label: 'เลือกประเภท', value: '' },
        { label: 'ตรวจทั่วไป', value: 'GENERAL' },
        { label: 'Lab', value: 'LAB' },
        { label: 'X-Ray', value: 'XRAY' },
        { label: 'ชุดรายการ', value: 'PACKAGE' },
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
        examType: '',
        categoryId: null,
        nhsoCode: '',
        genericName: '',
        unit: '',
        priceOpd: null,
        priceIpd: null,
      }
    },
    // Map examType to categoryType for filtering
    categoryTypeForExamType() {
      // ถ้ายังไม่ได้เลือก examType หรือเป็น GENERAL, LAB, XRAY, PACKAGE → ใช้ LAB_XRAY (default สำหรับรายการตรวจ)
      if (!this.form.examType || ['GENERAL', 'LAB', 'XRAY', 'PACKAGE'].includes(this.form.examType)) {
        return 'LAB_XRAY'
      }
      return null
    },
  },
  watch: {
    modelValue: {
      handler(newValue) {
        if (newValue) {
          // Modal เปิด - reset form และ load categories
          this.resetForm()
          this.loadCategories()
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
    selectedCategory: {
      handler(newCat) {
        this.form.categoryId = newCat?.id || null
      }
    },
    // Watch examType to reload categories when it changes
    'form.examType': {
      handler(newType, oldType) {
        if (newType !== oldType && this.modelValue) {
          // Reload categories with new categoryType filter
          this.loadCategories()
          // Reset selected category if it doesn't match the new filter
          this.$nextTick(() => {
            if (this.selectedCategory) {
              const stillExists = this.categories.some(c => c.id === this.selectedCategory.id)
              if (!stillExists) {
                this.selectedCategory = null
                this.form.categoryId = null
              }
            }
          })
        }
      }
    }
  },
  methods: {
    resetForm() {
      if (this.initialData) {
        this.form = {
          id: this.initialData.id || null,
          name: this.initialData.name || '',
          examType: this.initialData.examType || '',
          categoryId: this.initialData.categoryId || null,
          nhsoCode: this.initialData.nhsoCode || '',
          genericName: this.initialData.genericName || '',
          unit: this.initialData.unit || '',
          priceOpd: this.initialData.priceOpd ?? null,
          priceIpd: this.initialData.priceIpd ?? null,
        }
        // Set selected category from initialData (หลังจาก categories โหลดเสร็จ)
        this.setSelectedCategoryFromData()
      } else {
        this.form = { ...this.defaultForm }
        this.selectedCategory = null
      }
      this.errors = {}
      this.originalSnapshot = JSON.stringify(this.form)
    },
    setSelectedCategoryFromData() {
      if (!this.initialData) {
        this.selectedCategory = null
        return
      }
      
      // ถ้ามี categoryId และ categories โหลดเสร็จแล้ว
      if (this.initialData.categoryId && this.categories.length > 0) {
        this.selectedCategory = this.categories.find(c => c.id === this.initialData.categoryId) || null
      } else if (this.initialData.category) {
        // ถ้ามี category object มาจาก API
        this.selectedCategory = { id: this.initialData.category.id, name: this.initialData.category.name }
      } else {
        this.selectedCategory = null
      }
    },
    async loadCategories() {
      try {
        this.loadingCategories = true
        // กรองหมวดหมู่ตาม examType (GENERAL/LAB/XRAY/PACKAGE -> LAB_XRAY)
        const params = {
          limit: 100,
          categoryType: this.categoryTypeForExamType || undefined
        }
        const items = await itemCategoryService.getForDropdown(params)
        this.categories = items || []
        
        // Set selected category หลังจาก categories โหลดเสร็จ
        this.setSelectedCategoryFromData()
      } catch (error) {
        console.error('Error loading categories:', error)
        this.categories = []
      } finally {
        this.loadingCategories = false
      }
    },

    async onSubmit() {
      if (!this.validate()) return

      // Prepare data for saving
      const dataToSave = { ...this.form }
      // Sanitize numbers
      if (dataToSave.priceOpd === '' || dataToSave.priceOpd === null) dataToSave.priceOpd = null
      if (dataToSave.priceIpd === '' || dataToSave.priceIpd === null) dataToSave.priceIpd = null

      this.$emit('save', dataToSave)
    },

    validate() {
      const e = {}
      if (!this.form.name || !this.form.name.trim()) {
        e.name = 'กรุณากรอกชื่อรายการ'
      }

      if (!this.form.examType) {
        e.examType = 'กรุณาเลือกประเภท'
      } else if (!['GENERAL', 'LAB', 'XRAY', 'PACKAGE'].includes(this.form.examType)) {
        e.examType = 'ประเภทไม่ถูกต้อง'
      }

      // Price validation
      if (this.form.priceOpd !== null && this.form.priceOpd !== '' && this.form.priceOpd < 0) {
        e.priceOpd = 'ราคา OPD ต้องไม่เป็นค่าลบ'
      }

      if (this.form.priceIpd !== null && this.form.priceIpd !== '' && this.form.priceIpd < 0) {
        e.priceIpd = 'ราคา IPD ต้องไม่เป็นค่าลบ'
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

    getExamTypeLabel(value) {
      const option = this.examTypeOptions.find((opt) => opt.value === value)
      return option ? option.label : 'เลือกประเภท'
    },
  },
}
</script>
