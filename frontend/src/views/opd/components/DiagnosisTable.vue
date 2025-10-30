<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-emerald-50">
        <tr>
          <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">เลขที่</th>
          <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">วันที่/เวลา</th>
          <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">แพทย์ผู้ตรวจ</th>
          <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">การวินิจฉัยโรค</th>
          <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">ตัวเลือก</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-100">
        <template v-if="loading">
          <tr v-for="n in 5" :key="'skeleton-'+n">
            <td class="px-4 py-3"><div class="h-4 w-20 bg-gray-100 animate-pulse rounded"></div></td>
            <td class="px-4 py-3"><div class="h-4 w-40 bg-gray-100 animate-pulse rounded"></div></td>
            <td class="px-4 py-3"><div class="h-4 w-32 bg-gray-100 animate-pulse rounded"></div></td>
            <td class="px-4 py-3"><div class="h-4 w-full bg-gray-100 animate-pulse rounded"></div></td>
            <td class="px-4 py-3"><div class="h-8 w-16 bg-gray-100 animate-pulse rounded ml-auto"></div></td>
          </tr>
        </template>
        <tr v-else-if="!items || items.length === 0">
          <td colspan="5" class="px-6 py-6 text-center text-sm text-gray-500">ไม่มีข้อมูล</td>
        </tr>
        <tr v-else v-for="rec in items" :key="rec.id" class="hover:bg-gray-50">
          <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ rec.registration?.vnNumber || '-' }}</td>
          <td class="px-4 py-3 text-sm text-gray-700">{{ formatDateTime(rec.createdAt) }}</td>
          <td class="px-4 py-3 text-sm text-gray-700">{{ rec.doctor?.name || '-' }}</td>
          <td class="px-4 py-3 text-sm text-gray-700 whitespace-pre-line">{{ rec.dxText || '-' }}</td>
          <td class="px-4 py-3 text-sm text-right">
            <button @click="$emit('edit', rec)" class="text-emerald-600 hover:text-emerald-800">แก้ไข</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'DiagnosisTable',
  props: {
    items: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false }
  },
  emits: ['edit'],
  methods: {
    formatDateTime(iso) {
      if (!iso) return '-'
      const d = new Date(iso)
      return (
        d.toLocaleDateString('th-TH') +
        ' ' +
        d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      )
    }
  }
}
</script>

<style scoped></style>


