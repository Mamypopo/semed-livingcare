<template>
  <div class="p-6">
    <div class="rounded-xl border border-gray-100 bg-white">
      <table class="min-w-full">
        <thead class="bg-emerald-50 sticky top-0 z-10">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide w-16">#</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide w-32">รหัส</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">รายการ</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide w-24">จำนวน</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide w-24">หน่วย</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide w-32">ราคา/หน่วย</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide w-32">ส่วนลด/หน่วย</th>
            <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wide w-32">ยอดรวม</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100">
          <!-- Loading State -->
          <template v-if="loading">
            <tr v-for="n in 5" :key="'skeleton-'+n">
              <td class="px-4 py-3"><div class="h-4 w-8 bg-gray-100 animate-pulse rounded"></div></td>
              <td class="px-4 py-3"><div class="h-4 w-24 bg-gray-100 animate-pulse rounded"></div></td>
              <td class="px-4 py-3"><div class="h-4 w-full bg-gray-100 animate-pulse rounded"></div></td>
              <td class="px-4 py-3"><div class="h-4 w-16 bg-gray-100 animate-pulse rounded"></div></td>
              <td class="px-4 py-3"><div class="h-4 w-16 bg-gray-100 animate-pulse rounded"></div></td>
              <td class="px-4 py-3"><div class="h-4 w-24 bg-gray-100 animate-pulse rounded"></div></td>
              <td class="px-4 py-3"><div class="h-4 w-24 bg-gray-100 animate-pulse rounded"></div></td>
              <td class="px-4 py-3"><div class="h-4 w-24 bg-gray-100 animate-pulse rounded ml-auto"></div></td>
            </tr>
          </template>
          <!-- Summary Items -->
          <template v-else-if="items.length > 0">
            <tr v-for="(item, index) in items" :key="item.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm text-gray-700 text-center">{{ index + 1 }}</td>
              <td class="px-4 py-3 text-sm font-medium text-gray-700">{{ item.medicalItem?.code || '-' }}</td>
              <td class="px-4 py-3 text-sm text-gray-700">
                <div class="flex items-center gap-2 flex-wrap">
                  <span>{{ item.medicalItem?.name || '-' }}</span>
                  <span
                    v-if="item.medicalItem?.examType === 'PACKAGE'"
                    class="inline-flex px-2 py-0.5 rounded-md bg-green-50 text-green-700 text-xs font-medium"
                  >
                    โปรแกรม
                  </span>
                  <span
                    v-if="item.parentPackage"
                    class="text-[10px] bg-teal-100 text-teal-700 font-medium rounded-md px-1.5 py-0.5"
                  >
                    {{ item.parentPackage.name }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ item.quantity || 1 }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ item.medicalItem?.unit || 'ครั้ง' }}</td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ formatCurrency(item.price || 0) }}</td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ formatCurrency(item.discount || 0) }}</td>
              <td class="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                {{ formatCurrency(calculateItemTotal(item)) }}
              </td>
            </tr>
          </template>
          <!-- Empty State -->
          <tr v-else>
            <td colspan="8" class="px-4 py-10 text-center text-slate-500 text-sm">
              ไม่พบรายการ
            </td>
          </tr>
        </tbody>
        <!-- Footer with Total -->
        <tfoot v-if="items.length > 0" class="bg-slate-50 border-t border-slate-200">
          <tr>
            <td colspan="7" class="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
              รวมทั้งสิ้น:
            </td>
            <td class="px-4 py-3 text-sm font-bold text-emerald-600 text-right">
              {{ formatCurrency(calculateGrandTotal()) }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script>
import visitItemService from '@/services/visit-item.js'

export default {
  name: 'SummaryTab',
  props: {
    visitId: {
      type: String,
      required: true
    }
  },
  emits: ['updated'],
  data() {
    return {
      items: [],
      loading: false
    }
  },
  watch: {
    visitId: {
      immediate: true,
      handler(newVisitId) {
        if (newVisitId) {
          this.loadItems()
        } else {
          this.items = []
        }
      }
    }
  },
  mounted() {
    if (this.visitId) {
      this.loadItems()
    }
  },
  methods: {
    async loadItems() {
      if (!this.visitId) {
        this.items = []
        return
      }

      this.loading = true
      try {
        this.items = await visitItemService.list(this.visitId)
      } catch (error) {
        console.error('Error loading summary items:', error)
        this.items = []
      } finally {
        this.loading = false
      }
    },

    calculateItemTotal(item) {
      const price = Number(item.price) || 0
      const discount = Number(item.discount) || 0
      const quantity = Number(item.quantity) || 1
      return (price - discount) * quantity
    },

    calculateGrandTotal() {
      return this.items.reduce((total, item) => {
        return total + this.calculateItemTotal(item)
      }, 0)
    },

    formatCurrency(value) {
      const n = Number(value)
      if (Number.isNaN(n)) return '0.00'
      return n.toLocaleString('th-TH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }
  }
}
</script>

<style scoped>
</style>

