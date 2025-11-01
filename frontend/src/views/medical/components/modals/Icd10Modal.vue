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
                  isEdit ? 'แก้ไขรายการวินิจฉัย' : 'เพิ่มรายการวินิจฉัยใหม่'
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
                <!-- Row 1: รหัส ICD10 และ ชื่อโรค (ไทย) -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- รหัส ICD10 -->
                  <div>
                    <label class="block text-sm font-medium text-slate-700"
                      >รหัส ICD10 <span class="text-red-500">*</span></label
                    >
                    <input
                      v-model.trim="form.code"
                      type="text"
                      class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                      placeholder="เช่น A01, M4922"
                    />
                    <p v-if="errors.code" class="text-xs text-red-600 mt-1">{{ errors.code }}</p>
                  </div>

                  <!-- ชื่อโรค (ไทย) -->
                  <div>
                    <label class="block text-sm font-medium text-slate-700"
                      >ชื่อโรค (ไทย) <span class="text-red-500">*</span></label
                    >
                    <input
                      v-model.trim="form.nameTh"
                      type="text"
                      class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                      placeholder="เช่น อหิวาตกโรค"
                    />
                    <p v-if="errors.nameTh" class="text-xs text-red-600 mt-1">{{ errors.nameTh }}</p>
                  </div>
                </div>

                <!-- Row 2: ชื่อโรค (อังกฤษ) และ รหัสกลุ่ม -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- ชื่อโรค (อังกฤษ) -->
                  <div>
                    <label class="block text-sm font-medium text-slate-700">ชื่อโรค (อังกฤษ)</label>
                    <input
                      v-model.trim="form.nameEn"
                      type="text"
                      class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                      placeholder="เช่น Cholera"
                    />
                  </div>

                  <!-- รหัสกลุ่ม -->
                  <div>
                    <label class="block text-sm font-medium text-slate-700">รหัสกลุ่ม</label>
                    <input
                      v-model.trim="form.groupCode"
                      type="text"
                      class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                      placeholder="เช่น A00-A09"
                    />
                  </div>
                </div>

                <!-- Row 3: ชื่อกลุ่ม (ไทย) และ ชื่อกลุ่ม (อังกฤษ) -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- ชื่อกลุ่ม (ไทย) -->
                  <div>
                    <label class="block text-sm font-medium text-slate-700">ชื่อกลุ่ม (ไทย)</label>
                    <input
                      v-model.trim="form.groupNameTh"
                      type="text"
                      class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                      placeholder="เช่น โรคติดเชื้อในลำไส้"
                    />
                  </div>

                  <!-- ชื่อกลุ่ม (อังกฤษ) -->
                  <div>
                    <label class="block text-sm font-medium text-slate-700">ชื่อกลุ่ม (อังกฤษ)</label>
                    <input
                      v-model.trim="form.groupNameEn"
                      type="text"
                      class="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                      placeholder="เช่น Intestinal infectious diseases"
                    />
                  </div>
                </div>

                <!-- Row 4: หมวดหมู่ -->
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

                <!-- Row 5: สถานะ -->
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
                    <span class="ml-3 text-sm text-slate-700">
                      {{ form.isActive ? 'ใช้งาน' : 'ปิดใช้งาน' }}
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
  Dialog as DialogModal,
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
  name: 'Icd10Modal',
  components: {
    DialogModal,
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
        code: '',
        nameTh: '',
        nameEn: '',
        groupCode: '',
        groupNameTh: '',
        groupNameEn: '',
        categoryId: null,
        isActive: true,
      },
      errors: {},
      originalSnapshot: null,
      showConfirmClose: false,
      categories: [],
      selectedCategory: null,
      loadingCategories: false,
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
        nameTh: '',
        nameEn: '',
        groupCode: '',
        groupNameTh: '',
        groupNameEn: '',
        categoryId: null,
        isActive: true,
      }
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
  },
  methods: {
    resetForm() {
      if (this.initialData) {
        this.form = {
          id: this.initialData.id || null,
          code: this.initialData.code || '',
          nameTh: this.initialData.nameTh || '',
          nameEn: this.initialData.nameEn || '',
          groupCode: this.initialData.groupCode || '',
          groupNameTh: this.initialData.groupNameTh || '',
          groupNameEn: this.initialData.groupNameEn || '',
          categoryId: this.initialData.categoryId || null,
          isActive: this.initialData.isActive ?? true,
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
        // โหลดหมวดหมู่ประเภท DIAGNOSIS มาให้เลย (เหมือน MedicalItemModal ที่โหลด LAB_XRAY)
        const params = {
          limit: 100,
          categoryType: 'DIAGNOSIS'
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

      this.$emit('save', dataToSave)
    },

    validate() {
      const e = {}
      if (!this.form.code || !this.form.code.trim()) {
        e.code = 'กรุณากรอกรหัส ICD10'
      }
      if (!this.form.nameTh || !this.form.nameTh.trim()) {
        e.nameTh = 'กรุณากรอกชื่อโรค (ไทย)'
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
  },
}
</script>

