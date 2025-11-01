<template>
  <div class="p-6">
    <div class="rounded-xl border border-gray-100 bg-white">
      <table class="min-w-full">
        <thead class="bg-emerald-50 sticky top-0 z-10">
          <tr>
            <th
              class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide w-16"
            >
              #
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide w-32"
            >
              รหัส
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide"
            >
              รายการ
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide w-24"
            >
              จำนวน
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide w-24"
            >
              หน่วย
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide w-32"
            >
              ราคา/หน่วย
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide w-32"
            >
              ส่วนลด/หน่วย
            </th>
            <th
              class="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wide w-32"
            >
              ยอดรวม
            </th>
            <th
              class="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide w-24"
            >
              ตัวเลือก
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100">
          <!-- Loading State -->
          <template v-if="loading">
            <tr v-for="n in 5" :key="'skeleton-' + n">
              <td class="px-4 py-3">
                <div class="h-4 w-8 bg-gray-100 animate-pulse rounded"></div>
              </td>
              <td class="px-4 py-3">
                <div class="h-4 w-24 bg-gray-100 animate-pulse rounded"></div>
              </td>
              <td class="px-4 py-3">
                <div class="h-4 w-full bg-gray-100 animate-pulse rounded"></div>
              </td>
              <td class="px-4 py-3">
                <div class="h-4 w-16 bg-gray-100 animate-pulse rounded"></div>
              </td>
              <td class="px-4 py-3">
                <div class="h-4 w-16 bg-gray-100 animate-pulse rounded"></div>
              </td>
              <td class="px-4 py-3">
                <div class="h-4 w-24 bg-gray-100 animate-pulse rounded"></div>
              </td>
              <td class="px-4 py-3">
                <div class="h-4 w-24 bg-gray-100 animate-pulse rounded"></div>
              </td>
              <td class="px-4 py-3">
                <div class="h-4 w-24 bg-gray-100 animate-pulse rounded ml-auto"></div>
              </td>
              <td class="px-4 py-3">
                <div class="h-8 w-16 bg-gray-100 animate-pulse rounded mx-auto"></div>
              </td>
            </tr>
          </template>
          <!-- Visit Items -->
          <tr v-else v-for="(item, index) in visitItems" :key="item.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm text-gray-700 text-center">{{ index + 1 }}</td>
            <td class="px-4 py-3 text-sm font-medium text-gray-700">
              {{ item.medicalItem?.code || '-' }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-700">
              <div class="flex items-center gap-2">
                <span>{{ item.medicalItem?.name || '-' }}</span>
                <span
                  v-if="item.medicalItem?.examType === 'PACKAGE'"
                  class="inline-flex px-2 py-0.5 rounded-md bg-green-50 text-green-700 text-xs font-medium"
                >
                  โปรแกรม
                </span>
              </div>
            </td>
            <td class="px-4 py-3">
              <input
                v-model.number="item.quantity"
                @blur="updateItem(item)"
                @keyup.enter="updateItem(item)"
                type="number"
                min="1"
                class="w-full px-2 py-1 text-sm border border-gray-200 rounded text-gray-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300 focus:outline-none"
              />
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ item.medicalItem?.unit || 'ครั้ง' }}</td>
            <td class="px-4 py-3">
              <input
                v-model.number="item.price"
                @blur="updateItem(item)"
                @keyup.enter="updateItem(item)"
                type="number"
                step="0.01"
                min="0"
                class="w-full px-2 py-1 text-sm border border-gray-200 rounded text-gray-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300 focus:outline-none"
              />
            </td>
            <td class="px-4 py-3">
              <div class="relative inline-flex items-center">
                <input
                  v-model.number="item.discount"
                  @blur="updateItem(item)"
                  @keyup.enter="updateItem(item)"
                  type="number"
                  step="0.01"
                  min="0"
                  :max="item.discountType === 'PERCENTAGE' ? 100 : undefined"
                  class="w-36 px-2 py-1 pr-16 text-sm border border-gray-200 rounded text-gray-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300 focus:outline-none"
                  :placeholder="item.discountType === 'PERCENTAGE' ? '0-100' : '0.00'"
                />
                <Listbox
                  v-model="item.discountType"
                  @update:model-value="updateItem(item)"
                  as="div"
                  class="absolute right-2"
                >
                  <ListboxButton
                    class="px-2 py-1 text-xs bg-white hover:bg-slate-50 text-slate-700 border-0 rounded focus:outline-none flex items-center gap-1"
                  >
                    <span>{{ item.discountType === 'PERCENTAGE' ? '%' : 'บาท' }}</span>
                    <ChevronDown class="w-3 h-3 opacity-60" />
                  </ListboxButton>
                  <transition
                    enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95"
                    enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform opacity-100 scale-100"
                    leave-to-class="transform opacity-0 scale-95"
                  >
                    <ListboxOptions
                      class="absolute right-0 mt-1 z-50 p-1 shadow-xl bg-white rounded-lg border border-gray-200 w-24 focus:outline-none"
                    >
                      <ListboxOption
                        v-for="option in discountTypeOptions"
                        :key="option.value"
                        :value="option.value"
                        v-slot="{ active, selected }"
                      >
                        <li
                          :class="[
                            'px-2 py-1.5 text-xs rounded cursor-pointer flex items-center justify-between transition-colors',
                            active
                              ? 'bg-emerald-50 text-slate-800'
                              : 'text-slate-700 hover:bg-slate-50',
                          ]"
                        >
                          <span>{{ option.label }}</span>
                          <span v-if="selected" class="text-emerald-500 text-xs">✓</span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </Listbox>
              </div>
            </td>
            <td class="px-4 py-3 text-sm font-medium text-gray-900 text-right">
              {{ formatCurrency(calculateTotal(item)) }}
            </td>
            <td class="px-4 py-3 text-center">
              <button
                @click="handleRemove(item)"
                class="inline-flex items-center justify-center w-8 h-8 rounded text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                v-tooltip:top="'ลบ'"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </td>
          </tr>

          <!-- Search Row -->
          <tr class="bg-slate-50 hover:bg-slate-100">
            <td class="px-4 py-3 text-sm text-gray-400 text-center">-</td>
            <td class="px-4 py-3" colspan="2">
              <div class="relative">
                <SearchIcon
                  class="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400"
                />
                <input
                  v-model.trim="searchQuery"
                  @input="onSearchInput"
                  @focus="showSearchDropdown = true"
                  @blur="handleSearchBlur"
                  type="text"
                  placeholder="ค้นหาอย่างน้อย 3 ตัวอักษร"
                  class="w-full pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-slate-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200"
                />
                <!-- Search Dropdown -->
                <div
                  v-if="showSearchDropdown && searchResults.length > 0"
                  class="absolute z-50 mt-1 w-full bg-white rounded-lg border border-gray-200 shadow-xl max-h-60 overflow-auto"
                >
                  <button
                    v-for="result in searchResults"
                    :key="result.id"
                    @mousedown.prevent="selectItem(result)"
                    class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div class="font-medium">{{ result.code }}</div>
                    <div class="text-xs text-gray-500">{{ result.name }}</div>
                  </button>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-sm text-gray-500 text-center">1</td>
            <td class="px-4 py-3 text-sm text-gray-600">ครั้ง</td>
            <td class="px-4 py-3">
              <input
                type="number"
                value="0.00"
                disabled
                class="w-full px-2 py-1 text-sm border border-gray-200 rounded text-gray-500 bg-gray-50 cursor-not-allowed"
              />
            </td>
            <td class="px-4 py-3">
              <input
                type="number"
                value="0"
                disabled
                class="w-36 px-2 py-1 text-sm border border-gray-200 rounded text-gray-500 bg-gray-50 cursor-not-allowed"
              />
            </td>
            <td class="px-4 py-3 text-sm font-medium text-gray-900 text-right">0.00</td>
            <td class="px-4 py-3 text-center">
              <button
                @click="handleAddItem"
                :disabled="!selectedItem || addingItem"
                class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                v-tooltip:top="'เพิ่ม'"
              >
                <Plus class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { Search as SearchIcon, Plus, Trash2, ChevronDown } from 'lucide-vue-next'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import medicalItemService from '@/services/medical-item.js'
import visitItemService from '@/services/visit-item.js'
import Swal from 'sweetalert2'

const SEARCH_MIN_LENGTH = 3
const SEARCH_DEBOUNCE_DELAY = 300
const BLUR_DELAY = 200

export default {
  name: 'ExaminationTab',
  components: {
    SearchIcon,
    Plus,
    Trash2,
    ChevronDown,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  },
  props: {
    visitId: {
      type: String,
      required: true,
    },
  },
  emits: ['updated'],
  data() {
    return {
      visitItems: [],
      loading: false,
      searchQuery: '',
      searchResults: [],
      showSearchDropdown: false,
      selectedItem: null,
      addingItem: false,
      searchTimer: null,
      blurTimer: null,
      discountTypeOptions: [
        { value: 'AMOUNT', label: 'บาท' },
        { value: 'PERCENTAGE', label: '%' },
      ],
    }
  },
  watch: {
    visitId: {
      immediate: true,
      handler(newVisitId) {
        if (newVisitId) {
          this.loadVisitItems()
        }
      },
    },
  },
  methods: {
    async loadVisitItems() {
      if (!this.visitId) return

      this.loading = true
      try {
        const items = await visitItemService.list(this.visitId)
        // กำหนด discountType default เป็น AMOUNT สำหรับรายการที่ไม่มี
        this.visitItems = items.map((item) => ({
          ...item,
          discountType: item.discountType || 'AMOUNT',
        }))
      } catch (error) {
        console.error('Error loading visit items:', error)
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถโหลดรายการตรวจได้',
          toast: true,
          position: 'top-end',
          timer: 3000,
        })
        this.visitItems = []
      } finally {
        this.loading = false
      }
    },

    async onSearchInput() {
      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
      }

      // ไม่ clear selectedItem เมื่อแก้ไข text - ปุ่ม '+' ใช้ selectedItem ไม่ใช่ searchQuery
      // จะ clear เฉพาะเมื่อ input ว่างเปล่าเท่านั้น
      if (this.searchQuery.trim().length === 0) {
        this.selectedItem = null
      }

      if (this.searchQuery.trim()) {
        this.showSearchDropdown = true
      }

      // ค้นหาใหม่เฉพาะเมื่อไม่มี selectedItem หรือ text ไม่ตรงกับ selectedItem (ลด API calls)
      if (
        !this.selectedItem ||
        this.searchQuery.trim() !== this.getDisplayText(this.selectedItem)
      ) {
        this.searchTimer = setTimeout(() => {
          this.performSearch()
        }, SEARCH_DEBOUNCE_DELAY)
      }
    },

    async performSearch() {
      if (!this.searchQuery.trim() || this.searchQuery.trim().length < SEARCH_MIN_LENGTH) {
        this.searchResults = []
        this.showSearchDropdown = false
        if (this.searchQuery.trim().length === 0) {
          this.selectedItem = null
        }
        return
      }

      try {
        // ส่ง visitId ไปให้ backend กรองรายการที่เพิ่มไปแล้ว
        const items = await medicalItemService.searchForVisit(
          this.searchQuery.trim(),
          20,
          this.visitId,
        )
        this.searchResults = items
        // ไม่ clear selectedItem แม้ไม่เจอในผลลัพธ์ - ผู้ใช้อาจแก้ text แต่ยังต้องการเพิ่ม item ที่เลือกไว้
      } catch (error) {
        console.error('Error searching items:', error)
        this.searchResults = []
      }
    },

    handleSearchBlur() {
      this.blurTimer = setTimeout(() => {
        this.showSearchDropdown = false
      }, BLUR_DELAY)
    },

    selectItem(item) {
      this.selectedItem = item
      this.searchQuery = this.getDisplayText(item)
      this.showSearchDropdown = false
    },

    getDisplayText(item) {
      if (!item) return ''
      if (item.code && item.name) {
        return `${item.code} - ${item.name}`
      }
      return item.code || item.name || ''
    },

    async handleAddItem() {
      if (!this.selectedItem || !this.visitId) return

      this.addingItem = true
      try {
        // ใช้ค่า default เมื่อเพิ่มรายการ (แก้ไขได้ในตารางทีหลัง)
        const defaultQuantity = 1
        const defaultDiscount = 0
        const defaultDiscountType = 'AMOUNT'

        if (this.selectedItem.examType === 'PACKAGE') {
          await visitItemService.addPackage(this.visitId, {
            medicalItemId: this.selectedItem.id,
            quantity: defaultQuantity,
            discount: defaultDiscount,
            discountType: defaultDiscountType,
          })
        } else {
          await visitItemService.create(this.visitId, {
            medicalItemId: this.selectedItem.id,
            quantity: defaultQuantity,
            price: undefined, // ใช้ราคาจาก MedicalItem
            discount: defaultDiscount,
            discountType: defaultDiscountType,
          })
        }

        this.searchQuery = ''
        this.selectedItem = null
        this.searchResults = []

        await this.loadVisitItems()
        this.$emit('updated')

        Swal.fire({
          icon: 'success',
          title: 'เพิ่มสำเร็จ',
          text: 'เพิ่มรายการตรวจเรียบร้อยแล้ว',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        })
      } catch (error) {
        console.error('Error adding item:', error)
        
        // ตรวจสอบว่าเป็น error เกี่ยวกับแพคเกจว่างหรือไม่
        const errorMessage = error?.response?.data?.message || error.message || 'เกิดข้อผิดพลาด'
        const isPackageEmptyError = errorMessage.includes('ไม่มีรายการย่อย') || 
                                   errorMessage.includes('แพ็คเกจนี้ไม่มีรายการย่อย')

        Swal.fire({
          icon: isPackageEmptyError ? 'warning' : 'error',
          title: isPackageEmptyError ? 'ไม่สามารถเพิ่มแพคเกจได้' : 'เพิ่มไม่สำเร็จ',
          text: errorMessage,
          showConfirmButton: false,
          timerProgressBar: true,
          toast: true,
          position: 'top-end',
          timer: 3000,
        })
      } finally {
        this.addingItem = false
      }
    },

    async updateItem(item) {
      if (!item?.id) return

      try {
        await visitItemService.update(item.id, {
          quantity: item.quantity || 1,
          price: item.price || null,
          discount: item.discount || 0,
          discountType: item.discountType || 'AMOUNT',
        })

        // Reload items เพื่อแสดงข้อมูลล่าสุด
        await this.loadVisitItems()
        this.$emit('updated')
      } catch (error) {
        console.error('Error updating visit item:', error)
        Swal.fire({
          icon: 'error',
          title: 'แก้ไขไม่สำเร็จ',
          text: error?.response?.data?.message || error.message || 'เกิดข้อผิดพลาด',
          toast: true,
          position: 'top-end',
          timer: 3000,
        })
      }
    },

    async handleRemove(item) {
      if (!item?.id) return

      const result = await Swal.fire({
        icon: 'warning',
        title: 'ยืนยันการลบ?',
        text: `ต้องการลบรายการ "${item.medicalItem?.code || ''} - ${item.medicalItem?.name || ''}" หรือไม่?`,
        showCancelButton: true,
        confirmButtonText: 'ลบ',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
      })

      if (!result.isConfirmed) return

      try {
        await visitItemService.remove(item.id)
        await this.loadVisitItems()
        this.$emit('updated')

        Swal.fire({
          icon: 'success',
          title: 'ลบสำเร็จ',
          text: 'ลบรายการตรวจเรียบร้อยแล้ว',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        })
      } catch (error) {
        console.error('Error removing item:', error)
        Swal.fire({
          icon: 'error',
          title: 'ลบไม่สำเร็จ',
          text: error?.response?.data?.message || error.message || 'เกิดข้อผิดพลาด',
          toast: true,
          position: 'top-end',
          timer: 3000,
        })
      }
    },

    calculateTotal(item) {
      const price = Number(item.price) || 0
      const discount = Number(item.discount) || 0
      const quantity = Number(item.quantity) || 1
      const discountType = item.discountType || 'AMOUNT'

      let discountAmount = 0
      if (discountType === 'PERCENTAGE') {
        // ส่วนลดเป็นเปอร์เซ็นต์
        discountAmount = (price * discount) / 100
      } else {
        // ส่วนลดเป็นจำนวนเงิน
        discountAmount = discount
      }

      return (price - discountAmount) * quantity
    },

    formatCurrency(value) {
      const n = Number(value)
      if (Number.isNaN(n)) return '0.00'
      return n.toLocaleString('th-TH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    },
  },
  beforeUnmount() {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer)
    }
    if (this.blurTimer) {
      clearTimeout(this.blurTimer)
    }
  },
}
</script>

<style scoped></style>
