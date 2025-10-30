<template>
  <div class="rounded-xl border border-gray-100 bg-white">
    <table class="min-w-full">
      <thead class="bg-emerald-50 sticky top-0 z-10">
        <tr>
          <th class="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide w-24">เลขที่</th>
          <th class="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide w-48">วันที่/เวลา</th>
          <th class="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide w-40">แพทย์ผู้ตรวจ</th>
          <th class="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">การวินิจฉัยโรค</th>
          <th class="px-5 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wide w-44">ตัวเลือก</th>
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
          <td class="px-5 py-3 text-sm font-semibold text-gray-700 whitespace-nowrap w-24 truncate">
            {{ rec.registration?.opdNumber ? `${rec.registration.opdNumber}${rec.visitSeq ? '-' + rec.visitSeq : ''}` : (rec.registration?.vnNumber || '-') }}
          </td>
          <td class="px-5 py-3 text-sm text-gray-700">{{ formatDateTime(rec.createdAt) }}</td>
          <td class="px-5 py-3 text-sm text-gray-700">{{ rec.doctor?.name || '-' }}</td>
          <td class="px-5 py-3 text-sm text-gray-700">
            <div class="line-clamp-2 whitespace-pre-line">{{ rec.dxText || '-' }}</div>
          </td>
          <td class="px-5 py-3 text-sm text-right">
            <div class="inline-flex items-center gap-2">
              <button
                @click="$emit('edit', rec)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-md bg-white transition-colors border-sky-200 text-sky-700 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
                >
                <Pencil class="w-4 h-4" />
                แก้ไข
              </button>
              <Menu as="div" class="relative inline-block text-left">
                <MenuButton
                  class="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white text-gray-600 hover:text-gray-800 hover:border-gray-300 shadow-sm"
                >
                  <MoreVertical class="w-4 h-4" />
                </MenuButton>
                <Transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <MenuItems class="absolute right-0 z-50 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-xl ring-1 ring-black/5 focus:outline-none border border-gray-100">
                    <div class="p-1">
                      <MenuItem v-slot="{ active }">
                        <button
                          @click="$emit('open-opd', rec)"
                          :class="[active ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700','group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm']"
                        >
                          <FileText class="w-4 h-4" /> ใบ OPD
                        </button>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <button
                          @click="$emit('open-mc', rec)"
                          :class="[active ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700','group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm']"
                        >
                          <FileCheck2 class="w-4 h-4" /> ใบรับรองแพทย์
                        </button>
                      </MenuItem>
                      <div class="my-1 h-px bg-gray-100"></div>
                      <MenuItem v-slot="{ active }">
                        <button
                          @click="$emit('cancel', rec)"
                          :class="[active ? 'bg-red-50 text-red-700' : 'text-red-600','group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm']"
                        >
                          ยกเลิก Visit
                        </button>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Transition>
              </Menu>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { MoreVertical, Pencil, FileText, FileCheck2 } from 'lucide-vue-next'
export default {
  name: 'DiagnosisTable',
  components: { Menu, MenuButton, MenuItems, MenuItem, MoreVertical, Pencil, FileText, FileCheck2 },
  props: {
    items: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false }
  },
  emits: ['edit', 'open-opd', 'open-mc', 'cancel'],
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


