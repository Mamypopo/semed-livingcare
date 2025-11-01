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
              class="w-[90vw] max-w-6xl transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all"
            >
              <!-- Header -->
              <div
                class="flex items-center justify-between px-6 pt-5 pb-4 rounded-t-2xl border-b border-slate-200/50 bg-white"
              >
                <DialogTitle as="h3" class="text-slate-800 text-lg font-semibold">
                  ข้อมูลรายการตรวจ
                </DialogTitle>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300 transition-all duration-200 shadow-sm hover:shadow"
                    @click="requestClose"
                  >
                    ปิด
                  </button>
                  <button
                    v-if="isPackageType"
                    type="button"
                    :disabled="addingComponent || !hasSelectedItems"
                    class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-white bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    @click="saveAll"
                  >
                    บันทึก
                  </button>
                </div>
              </div>

              <div class="px-6 py-5 space-y-6">
                <!-- Parent Item Details Section -->
                <div class="border border-slate-200 rounded-lg p-4 bg-white">
                  <div class="flex items-center gap-2 mb-4">
                    <div class="w-1 h-5 bg-emerald-500 rounded-full"></div>
                    <h3 class="text-sm font-semibold text-slate-800">รายละเอียดรายการตรวจ</h3>
                  </div>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-4" v-if="loadingParentItem">
                    <div class="space-y-2">
                      <div class="h-4 w-24 bg-gray-100 animate-pulse rounded"></div>
                      <div class="h-9 w-full bg-gray-100 animate-pulse rounded"></div>
                    </div>
                    <div class="space-y-2">
                      <div class="h-4 w-24 bg-gray-100 animate-pulse rounded"></div>
                      <div class="h-9 w-full bg-gray-100 animate-pulse rounded"></div>
                    </div>
                    <div class="space-y-2">
                      <div class="h-4 w-24 bg-gray-100 animate-pulse rounded"></div>
                      <div class="h-9 w-full bg-gray-100 animate-pulse rounded"></div>
                    </div>
                  </div>
                  <div v-else-if="parentItem" class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <!-- รหัสการตรวจ -->
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-1"
                        >รหัสการตรวจ <span class="text-red-500">*</span></label
                      >
                      <div class="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-slate-700 text-sm">
                        {{ parentItem.code || '-' }}
                      </div>
                    </div>
                    <!-- ชื่อรายการ -->
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-1"
                        >ชื่อรายการ <span class="text-red-500">*</span></label
                      >
                      <div class="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-slate-700 text-sm">
                        {{ parentItem.name || '-' }}
                      </div>
                    </div>
                    <!-- หมวดหมู่ -->
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-1">หมวดหมู่</label>
                      <div class="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-slate-700 text-sm">
                        {{ parentItem.category?.name || '-' }}
                      </div>
                    </div>
                    <!-- ราคา IPD -->
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-1">ราคา IPD</label>
                      <div class="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-slate-700 text-sm">
                        {{ formatPrice(parentItem.priceIpd) }}
                      </div>
                    </div>
                    <!-- ราคา OPD -->
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-1">ราคา OPD</label>
                      <div class="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-slate-700 text-sm">
                        {{ formatPrice(parentItem.priceOpd) }}
                      </div>
                    </div>
                    <!-- หน่วย -->
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-1">หน่วย</label>
                      <div class="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-slate-700 text-sm">
                        {{ parentItem.unit || '-' }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Components Table with Search -->
                <div class="border border-slate-200 rounded-lg ">
                  <div class="bg-emerald-50 px-4 py-3 border-b border-slate-200">
                    <h3 class="text-sm font-semibold text-slate-800">รายการตรวจ</h3>
                  </div>
                  <div >
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-slate-50">
                        <tr>
                          <th class="px-4 py-2 text-center text-xs font-semibold text-slate-600 uppercase tracking-wide w-16">
                            ลำดับ
                          </th>
                          <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                            รหัส
                          </th>
                          <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                            ชื่อรายการ
                          </th>
                          <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                            หน่วย
                          </th>
                          <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                            ราคา OPD
                          </th>
                          <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                            ราคา IPD
                          </th>
                          <th v-if="isPackageType" class="px-4 py-2 text-right text-xs font-semibold text-slate-600 uppercase tracking-wide w-12">
                            จัดการ
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-100">
                        <!-- Loading Skeleton -->
                        <template v-if="loadingComponents">
                          <tr v-for="n in 3" :key="'skeleton-' + n">
                            <td :colspan="isPackageType ? 7 : 6" class="px-4 py-3">
                              <div class="h-4 w-full bg-gray-100 animate-pulse rounded"></div>
                            </td>
                          </tr>
                        </template>

                        <!-- Existing Components -->
                        <template v-else>
                          <tr
                            v-for="(component, index) in visibleComponents"
                            :key="component.id"
                            :class="[
                              'hover:bg-slate-50',
                              component.isPending ? 'bg-amber-50 border-l-4 border-amber-400' : 'bg-white',
                              deletedComponentIds.includes(component.id) ? 'opacity-50 bg-red-50 border-l-4 border-red-400' : '',
                            ]"
                          >
                            <td class="px-4 py-2 text-center text-sm font-semibold text-slate-800 whitespace-nowrap">
                              {{ index + 1 }}
                            </td>
                            <td class="px-4 py-2 text-sm font-semibold text-slate-800 whitespace-nowrap">
                              {{ component.childItem?.code || '-' }}
                            </td>
                            <td class="px-4 py-2 text-sm text-slate-700">
                              {{ component.childItem?.name || '-' }}
                            </td>
                            <td class="px-4 py-2 text-sm text-slate-700 whitespace-nowrap">
                              {{ component.quantity || 1 }} {{ component.childItem?.unit || 'รายการ' }}
                            </td>
                            <td class="px-4 py-2 text-sm text-slate-700 whitespace-nowrap">
                              {{ formatPrice(component.priceOpd || component.childItem?.priceOpd) }}
                            </td>
                            <td class="px-4 py-2 text-sm text-slate-700 whitespace-nowrap">
                              {{ formatPrice(component.priceIpd || component.childItem?.priceIpd) }}
                            </td>
                            <td v-if="isPackageType" class="px-4 py-2 text-right">
                              <button
                                v-if="!component.isPending && !deletedComponentIds.includes(component.id)"
                                @click="markComponentForDeletion(component.id)"
                                class="w-7 h-7 flex items-center justify-center bg-red-500 text-white rounded hover:bg-red-600 transition-colors ml-auto"
                                title="ลบ"
                              >
                                <Trash2 class="w-4 h-4" />
                              </button>
                              <button
                                v-else-if="deletedComponentIds.includes(component.id)"
                                @click="unmarkComponentForDeletion(component.id)"
                                class="w-7 h-7 flex items-center justify-center bg-green-500 text-white rounded hover:bg-green-600 transition-colors ml-auto"
                                title="ยกเลิกการลบ"
                              >
                                <X class="w-4 h-4 rotate-45" />
                              </button>
                              <button
                                v-else
                                @click="removePendingComponent(component.id)"
                                class="w-7 h-7 flex items-center justify-center bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors ml-auto"
                                title="ยกเลิก"
                              >
                                <X class="w-4 h-4" />
                              </button>
                            </td>
                          </tr>

                          <!-- Search Rows (Only for PACKAGE type) -->
                          <template v-if="isPackageType">
                            <tr v-for="(row, rowIndex) in searchRows" :key="'search-' + rowIndex" class="hover:bg-slate-50">
                            <td class="px-4 py-2 text-center text-sm text-slate-400">
                              -
                            </td>
                            <td class="px-4 py-2" colspan="2">
                              <div class="relative" :ref="el => searchInputRefs[rowIndex] = el">
                                <SearchIcon
                                  class="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400"
                                />
                                <input
                                  v-model="row.searchQuery"
                                  @input="onRowSearchInput(rowIndex)"
                                  @focus="showSearchDropdown(rowIndex)"
                                  @blur="handleSearchBlur(rowIndex)"
                                  type="text"
                                  placeholder="รายการตรวจ"
                                  class="w-full pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-slate-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
                                />
                                <!-- Search Dropdown -->
                                <div
                                  v-if="row.showDropdown && row.searchResults.length > 0"
                                  class="absolute z-50 mt-1 w-full bg-white rounded-lg border border-gray-200 shadow-xl max-h-60 overflow-auto"
                                >
                                  <button
                                    v-for="item in row.searchResults"
                                    :key="item.id"
                                    @mousedown.prevent="selectItemForRow(rowIndex, item)"
                                    :disabled="isComponentAdded(item.id) || isSelectedInSearchRows(item.id)"
                                    :class="[
                                      'w-full text-left px-3 py-2 text-sm hover:bg-emerald-50 transition-colors',
                                      (isComponentAdded(item.id) || isSelectedInSearchRows(item.id)) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                                    ]"
                                  >
                                    <div class="font-medium text-slate-800">{{ item.code }}</div>
                                    <div class="text-xs text-slate-600">{{ item.name }}</div>
                                    <div v-if="isComponentAdded(item.id)" class="text-xs text-emerald-600 mt-1">
                                      เพิ่มแล้ว
                                    </div>
                                    <div v-else-if="isSelectedInSearchRows(item.id)" class="text-xs text-amber-600 mt-1">
                                      เลือกแล้ว
                                    </div>
                                  </button>
                                </div>
                                <div
                                  v-if="row.showDropdown && !row.loading && row.searchQuery.trim().length >= searchMinLength && row.searchResults.length === 0"
                                  class="absolute z-50 mt-1 w-full bg-white rounded-lg border border-gray-200 shadow-xl p-3 text-sm text-slate-500 text-center"
                                >
                                  ไม่พบรายการตรวจ
                                </div>
                                <div
                                  v-if="row.showDropdown && row.loading"
                                  class="absolute z-50 mt-1 w-full bg-white rounded-lg border border-gray-200 shadow-xl p-3 text-sm text-slate-500 text-center"
                                >
                                  กำลังค้นหา...
                                </div>
                                <div
                                  v-if="row.showDropdown && row.searchQuery.trim().length > 0 && row.searchQuery.trim().length < searchMinLength"
                                  class="absolute z-50 mt-1 w-full bg-white rounded-lg border border-gray-200 shadow-xl p-3 text-sm text-slate-400 text-center"
                                >
                                  กรุณาพิมพ์อย่างน้อย {{ searchMinLength }} ตัวอักษร
                                </div>
                              </div>
                            </td>
                            <td class="px-4 py-2">
                              <span v-if="row.selectedItem" class="text-sm text-slate-700">
                                {{ row.quantity || 1 }} {{ row.selectedItem.unit || 'รายการ' }}
                              </span>
                              <span v-else class="text-sm text-slate-400">-</span>
                            </td>
                            <td class="px-4 py-2">
                              <input
                                v-if="row.selectedItem"
                                v-model.number="row.priceOpd"
                                type="number"
                                step="0.01"
                                min="0"
                                class="w-full px-2 py-1 text-sm border border-gray-200 rounded text-gray-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300 focus:outline-none"
                                placeholder="0.00"
                              />
                              <span v-else class="text-sm text-slate-400">-</span>
                            </td>
                            <td class="px-4 py-2">
                              <input
                                v-if="row.selectedItem"
                                v-model.number="row.priceIpd"
                                type="number"
                                step="0.01"
                                min="0"
                                class="w-full px-2 py-1 text-sm border border-gray-200 rounded text-gray-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300 focus:outline-none"
                                placeholder="0.00"
                              />
                              <span v-else class="text-sm text-slate-400">-</span>
                            </td>
                            <td class="px-4 py-2 text-right">
                              <div v-if="row.selectedItem" class="flex items-center justify-end">
                                <button
                                  @click="addSingleComponent(rowIndex)"
                                  :disabled="addingComponent || isComponentAdded(row.selectedItem.id)"
                                  class="w-7 h-7 flex items-center justify-center bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="เพิ่มรายการ"
                                >
                                  <Plus class="w-4 h-4" />
                                </button>
                              </div>
                              <div v-else class="flex items-center justify-end">
                                <button
                                  v-if="rowIndex === searchRows.length - 1 && !row.searchQuery.trim()"
                                  @click="addRow"
                                  class="w-7 h-7 flex items-center justify-center bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
                                  title="เพิ่มแถว"
                                >
                                  <Plus class="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                            </tr>
                          </template>

                          <!-- Empty State -->
                          <tr v-if="visibleComponents.length === 0 && !isPackageType">
                            <td colspan="6" class="px-4 py-10 text-center text-slate-500 text-sm">
                              ไม่พบรายการตรวจ
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                  </div>
                  <!-- Summary Footer -->
                  <div
                    v-if="visibleComponents.length > 0"
                    class="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between text-sm"
                  >
                    <div class="text-slate-600">
                      <span class="font-medium text-slate-800">รายการตรวจ:</span>
                      <span class="ml-1">{{ visibleComponents.length }} รายการ</span>
                      <span v-if="deletedComponentIds.length > 0" class="ml-2 text-red-600">
                        (ถูกลบ {{ deletedComponentIds.length }} รายการ)
                      </span>
                    </div>
                    <div class="flex items-center gap-6">
                      <div class="text-slate-600">
                        <span class="font-medium text-slate-800">ราคารวม OPD:</span>
                        <span class="ml-1 text-emerald-600 font-semibold">{{ formatPrice(totalPriceOpd) }}</span>
                      </div>
                      <div class="text-slate-600">
                        <span class="font-medium text-slate-800">ราคารวม IPD:</span>
                        <span class="ml-1 text-emerald-600 font-semibold">{{ formatPrice(totalPriceIpd) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
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
} from '@headlessui/vue'
import { Plus, Search as SearchIcon, Trash2, X } from 'lucide-vue-next'
import medicalItemService from '@/services/medical-item.js'
import Swal from 'sweetalert2'

export default {
  name: 'PackageComponentsModal',
  components: {
    DialogModal,
    DialogPanel,
    DialogTitle,
    TransitionRoot,
    TransitionChild,
    Plus,
    SearchIcon,
    Trash2,
    X,
  },
  props: {
    modelValue: { type: Boolean, required: true },
    parentItemId: { type: String, default: null },
    examType: { type: String, default: null },
  },
  emits: ['update:modelValue', 'updated'],
  data() {
    return {
      parentItem: null,
      loadingParentItem: false,
      searchRows: [],
      searchInputRefs: [],
      searchTimers: {},
      deletedComponentIds: [],
      components: [],
      loadingComponents: false,
      addingComponent: false,
      isAddingRow: false,
      // Constants
      SEARCH_MIN_LENGTH: 4,
      SEARCH_DEBOUNCE_DELAY: 300,
      BLUR_DELAY: 200,
    }
  },
  computed: {
    totalPriceOpd() {
      return this.visibleComponents.reduce((sum, comp) => {
        const price = parseFloat(comp.priceOpd || comp.childItem?.priceOpd) || 0
        return sum + price * (comp.quantity || 1)
      }, 0)
    },
    totalPriceIpd() {
      return this.visibleComponents.reduce((sum, comp) => {
        const price = parseFloat(comp.priceIpd || comp.childItem?.priceIpd) || 0
        return sum + price * (comp.quantity || 1)
      }, 0)
    },
    hasSelectedItems() {
      // ตรวจสอบทั้งใน searchRows ที่เลือกรายการแล้ว
      // ใน components ที่เป็น pending (ยังไม่ได้บันทึก)
      // และใน deletedComponentIds (รายการที่ถูกลบ ยังไม่ได้บันทึก)
      const hasSelectedInRows = this.searchRows.some((row) => row.selectedItem && row.quantity >= 1)
      const hasPendingComponents = this.components.some((c) => c.isPending === true)
      const hasDeletedComponents = this.deletedComponentIds.length > 0
      return hasSelectedInRows || hasPendingComponents || hasDeletedComponents
    },
    pendingComponents() {
      // รายการที่ยังไม่ได้บันทึก (pending)
      return this.components.filter((c) => c.isPending === true)
    },
    savedComponents() {
      // รายการที่บันทึกแล้ว (มี id จริง ไม่ใช่ temp)
      return this.components.filter((c) => !c.isPending && !String(c.id).startsWith('temp-'))
    },
    visibleComponents() {
      return this.components.filter((c) => !this.deletedComponentIds.includes(c.id))
    },
    searchMinLength() {
      return this.SEARCH_MIN_LENGTH
    },
    isPackageType() {
      return this.examType === 'PACKAGE'
    },
  },
  watch: {
    modelValue(newValue) {
      if (newValue) {
        // Modal เปิด - มี input ค้นหาเริ่มต้น 1 แถว (เฉพาะ PACKAGE type)
        if (this.isPackageType) {
          this.searchRows = [{ searchQuery: '', selectedItem: null, quantity: 1, searchResults: [], showDropdown: false, loading: false }]
        } else {
          this.searchRows = []
        }
        this.deletedComponentIds = []
        
        // Load ข้อมูลเมื่อ modal เปิด - รอให้ parentItemId ถูก set ก่อน
        this.$nextTick(() => {
          if (this.parentItemId) {
            this.loadParentItem()
            this.loadComponents()
          }
        })
      } else {
        // Modal ปิด - cleanup
        this.parentItem = null
        this.searchRows = []
        this.searchInputRefs = []
        this.components = []
        this.deletedComponentIds = []
        this.clearAllTimers()
      }
    },
    parentItemId(newId) {
      if (newId && this.modelValue) {
        this.loadParentItem()
        this.loadComponents()
      }
    },
  },
  methods: {
    async loadParentItem() {
      if (!this.parentItemId) {
        this.parentItem = null
        this.loadingParentItem = false
        return
      }
      try {
        this.loadingParentItem = true
        const item = await medicalItemService.getById(this.parentItemId)
        this.parentItem = item || null
      } catch {
        this.parentItem = null
      } finally {
        this.loadingParentItem = false
      }
    },
    async loadComponents() {
      if (!this.parentItemId) {
        this.components = []
        return
      }
      // สำหรับ non-PACKAGE types ไม่มี components ให้โหลด
      if (!this.isPackageType) {
        this.components = []
        this.loadingComponents = false
        return
      }
      try {
        this.loadingComponents = true
        const components = await medicalItemService.getComponents(this.parentItemId)
        this.components = components || []
      } catch {
        this.components = []
      } finally {
        this.loadingComponents = false
      }
    },
    addRow() {
      // ป้องกันการเพิ่มแถวซ้ำ 
      if (this.isAddingRow) {
        return
      }
      
      // ป้องกันการเพิ่มแถวซ้ำ 
      const hasEmptyRow = this.searchRows.some((r) => !r.selectedItem && !r.searchQuery.trim())
      if (hasEmptyRow) {
        return
      }
      
      this.isAddingRow = true
      this.searchRows.push({
        searchQuery: '',
        selectedItem: null,
        quantity: 1,
        priceOpd: null,
        priceIpd: null,
        searchResults: [],
        showDropdown: false,
        loading: false,
      })
      this.$nextTick(() => {
        this.searchInputRefs.push(null)
        this.isAddingRow = false
      })
    },
    onRowSearchInput(index) {
      const row = this.searchRows[index]
      if (!row) return

      // Clear previous timer
      if (this.searchTimers[index]) {
        clearTimeout(this.searchTimers[index])
      }

      if (row.searchQuery.trim()) {
        row.showDropdown = true
      }

      if (!row.selectedItem || row.searchQuery.trim() !== this.getDisplayText(row.selectedItem)) {
        this.searchTimers[index] = setTimeout(() => {
          this.performRowSearch(index)
        }, this.SEARCH_DEBOUNCE_DELAY)
      }
    },
    async performRowSearch(index) {
      const row = this.searchRows[index]
      if (!row || !row.searchQuery.trim()) {
        row.searchResults = []
        row.loading = false
        return
      }

      if (row.searchQuery.trim().length < this.SEARCH_MIN_LENGTH) {
        row.searchResults = []
        row.loading = false
        return
      }

      try {
        row.loading = true
        const params = {
          search: row.searchQuery.trim(),
          limit: 20,
        }
        const items = await medicalItemService.getForPackage(params)
        // กรองรายการที่เพิ่มไปแล้วออก
        const addedItemIds = new Set(this.components.map((c) => c.childItemId))
        row.searchResults = items.filter((item) => !addedItemIds.has(item.id))
      } catch {
        row.searchResults = []
      } finally {
        row.loading = false
      }
    },
    selectItemForRow(index, item) {
      const row = this.searchRows[index]
      if (!row) {
        return
      }

      row.selectedItem = item
      row.searchQuery = this.getDisplayText(item)
      // ตั้งราคาเริ่มต้นจาก item
      row.priceOpd = item.priceOpd || null
      row.priceIpd = item.priceIpd || null
      row.showDropdown = false
    },
    showSearchDropdown(index) {
      const row = this.searchRows[index]
      if (row && row.searchQuery.trim()) {
        row.showDropdown = true
        if (row.searchResults.length === 0 && !row.loading) {
          this.performRowSearch(index)
        }
      }
    },
    handleSearchBlur(index) {
      setTimeout(() => {
        const row = this.searchRows[index]
        if (row) {
          row.showDropdown = false
        }
      }, this.BLUR_DELAY)
    },
    getDisplayText(item) {
      if (!item) return ''
      return item.code && item.name ? `${item.code} - ${item.name}` : (item.code || item.name || '')
    },
    isComponentAdded(itemId) {
      const visibleComponents = this.components.filter((c) => !this.deletedComponentIds.includes(c.id))
      const inComponents = visibleComponents.some((c) => c.childItemId === itemId)
      return inComponents
    },
    isSelectedInSearchRows(itemId) {
      const inSelectedRows = this.searchRows.some((row) => row.selectedItem && row.selectedItem.id === itemId)
      return inSelectedRows
    },
    async addSingleComponent(rowIndex) {
      const row = this.searchRows[rowIndex]
      if (!row || !this.parentItemId) {
        return
      }

      // ตรวจสอบว่ามี selectedItem หรือไม่
      if (!row.selectedItem) {
        Swal.fire({
          icon: 'warning',
          title: 'กรุณาเลือกรายการตรวจ',
          text: 'กรุณาค้นหาและเลือกรายการตรวจจากรายการก่อนกดปุ่ม +',
          toast: true,
          position: 'top-end',
          timer: 2500,
        })
        return
      }

      // ใช้ข้อมูลจาก selectedItem ที่เลือกไว้เสมอ
      // ไม่ต้องตรวจสอบว่าค่าใน input ตรงกับ selectedItem หรือไม่
      // เพื่อให้ผู้ใช้สามารถแก้ไข input เพื่อค้นหาใหม่ได้ แต่ถ้ากด + ให้ใช้ selectedItem เดิม

      // ตรวจสอบว่าถูกเพิ่มแล้วหรือยัง
      const isAdded = this.isComponentAdded(row.selectedItem.id)
      
      if (isAdded) {
        Swal.fire({
          icon: 'warning',
          title: 'รายการนี้ถูกเพิ่มแล้ว',
          text: 'กรุณาเลือกรายการตรวจอื่น',
          toast: true,
          position: 'top-end',
          timer: 2000,
        })
        return
      }


      const quantity = row.quantity || 1

      const selectedItemData = row.selectedItem
      
      const tempComponent = {
        id: `temp-${Date.now()}-${selectedItemData.id}`, // temporary id
        parentItemId: this.parentItemId,
        childItemId: selectedItemData.id,
        quantity: quantity,
        // ใช้ราคาจาก input (ถ้าไม่กรอกให้ใช้ราคาจาก item)
        priceOpd: row.priceOpd !== null && row.priceOpd !== undefined ? row.priceOpd : (selectedItemData.priceOpd || null),
        priceIpd: row.priceIpd !== null && row.priceIpd !== undefined ? row.priceIpd : (selectedItemData.priceIpd || null),
        childItem: {
          ...selectedItemData,
        },
        isPending: true, // ระบุว่านี่คือ pending component ที่ยังไม่ได้บันทึก
      }

      this.components.push(tempComponent)

      // เคลียร์แถวค้นหาเพื่อค้นหาใหม่
      this.searchRows[rowIndex] = {
        searchQuery: '',
        selectedItem: null,
        quantity: 1,
        priceOpd: null,
        priceIpd: null,
        searchResults: [],
        showDropdown: false,
        loading: false,
      }
      
      // เพิ่มแถวใหม่ถ้ายังไม่มีแถวว่าง
      const hasEmptyRow = this.searchRows.some((r) => !r.selectedItem && !r.searchQuery.trim())
      if (!hasEmptyRow) {
        this.addRow()
      }

    },
    async saveAll() {
      if (!this.parentItemId) {
        return
      }

      const pendingItems = this.pendingComponents.map((c) => ({
        childItemId: c.childItemId,
        quantity: c.quantity || 1,
        priceOpd: c.priceOpd !== undefined ? c.priceOpd : null,
        priceIpd: c.priceIpd !== undefined ? c.priceIpd : null,
      }))

      const deletedIds = [...this.deletedComponentIds]

      // ตรวจสอบว่ามีการเปลี่ยนแปลงหรือไม่
      if (pendingItems.length === 0 && deletedIds.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'ไม่มีรายการที่ต้องบันทึก',
          text: 'กรุณาเลือกรายการตรวจและกดปุ่ม + เพื่อเพิ่มรายการ หรือลบรายการตรวจ',
          toast: true,
          position: 'top-end',
          timer: 2000,
        })
        return
      }

      let confirmMessage = ''
      if (pendingItems.length > 0 && deletedIds.length > 0) {
        confirmMessage = `ต้องการบันทึกรายการตรวจ ${pendingItems.length} รายการ และลบ ${deletedIds.length} รายการหรือไม่`
      } else if (pendingItems.length > 0) {
        confirmMessage = `ต้องการบันทึกรายการตรวจ ${pendingItems.length} รายการหรือไม่`
      } else if (deletedIds.length > 0) {
        confirmMessage = `ต้องการลบรายการตรวจ ${deletedIds.length} รายการหรือไม่`
      }

      const result = await Swal.fire({
        icon: 'question',
        title: 'ยืนยันการบันทึก?',
        text: confirmMessage,
        showCancelButton: true,
        confirmButtonText: 'บันทึก',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#059669',
      })

      if (!result.isConfirmed) return

      try {
        this.addingComponent = true

        // เรียก API ลบรายการก่อน 
        if (deletedIds.length > 0) {
          await medicalItemService.removeComponents(this.parentItemId, deletedIds)
        }

        // เรียก API เพิ่มรายการ
        if (pendingItems.length > 0) {
          await medicalItemService.addComponents(this.parentItemId, pendingItems)
        }

        // ดึงข้อมูลล่าสุด
        await this.loadComponents()

        // Clear all search rows with selected items
        this.searchRows = this.searchRows.filter((row) => !row.selectedItem)
        
        // Clear deleted component ids
        this.deletedComponentIds = []
        
        // Add a new empty row if no rows exist
        if (this.searchRows.length === 0) {
          this.searchRows = [{ searchQuery: '', selectedItem: null, quantity: 1, priceOpd: null, priceIpd: null, searchResults: [], showDropdown: false, loading: false }]
        }

        // Emit updated event
        this.$emit('updated')

        // Show success message
        let successMessage = ''
        if (pendingItems.length > 0 && deletedIds.length > 0) {
          successMessage = `บันทึกรายการตรวจ ${pendingItems.length} รายการ และลบ ${deletedIds.length} รายการเรียบร้อยแล้ว`
        } else if (pendingItems.length > 0) {
          successMessage = `บันทึกรายการตรวจ ${pendingItems.length} รายการเรียบร้อยแล้ว`
        } else if (deletedIds.length > 0) {
          successMessage = `ลบรายการตรวจ ${deletedIds.length} รายการเรียบร้อยแล้ว`
        }

        Swal.fire({
          icon: 'success',
          title: 'บันทึกสำเร็จ',
          text: successMessage,
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        }).then(() => {
          // ปิด modal หลังจากแสดง success message
          this.requestClose()
        })
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'บันทึกไม่สำเร็จ',
          text: error?.response?.data?.message || error.message || 'เกิดข้อผิดพลาด',
          toast: true,
          position: 'top-end',
          timer: 3000,
        })
      } finally {
        this.addingComponent = false
      }
    },
    removePendingComponent(componentId) {
      // ลบ pending component จาก local state 
      const index = this.components.findIndex((c) => c.id === componentId && c.isPending)
      if (index !== -1) {
        this.components.splice(index, 1)
      }
    },
    markComponentForDeletion(componentId) {
      // ตรวจสอบว่าเป็น pending component หรือไม่
      const component = this.components.find((c) => c.id === componentId)
      if (component?.isPending) {
        // ถ้าเป็น pending ใช้ removePendingComponent แทน
        this.removePendingComponent(componentId)
        return
      }

      // เพิ่ม componentId เข้า deletedComponentIds 
      if (!this.deletedComponentIds.includes(componentId)) {
        this.deletedComponentIds.push(componentId)
      }
    },
    unmarkComponentForDeletion(componentId) {
      // ลบ componentId ออกจาก deletedComponentIds
      const index = this.deletedComponentIds.indexOf(componentId)
      if (index !== -1) {
        this.deletedComponentIds.splice(index, 1)
      }
    },
    formatPrice(price) {
      if (!price && price !== 0) return '0.00'
      return parseFloat(price).toFixed(2)
    },
    requestClose() {
      this.$emit('update:modelValue', false)
    },
    clearAllTimers() {
      Object.values(this.searchTimers).forEach((timer) => {
        if (timer) clearTimeout(timer)
      })
      this.searchTimers = {}
    },
  },
  beforeUnmount() {
    this.clearAllTimers()
  },
}
</script>

<style scoped></style>
