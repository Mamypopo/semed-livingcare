<template>
  <div class="grid grid-cols-5 gap-6">
    <!-- Left: Image/Template Area (2 cols) -->
    <div class="col-span-2 space-y-3">
      <div class="text-left text-sm text-gray-700">เลือกรูปพื้นหลัง (Template)</div>
      <div>
        <Listbox v-model="localChart.templateKey" as="div" class="relative w-full" @update:modelValue="emitUpdate">
          <div>
            <ListboxButton
              class="relative text-sm w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-9 text-left shadow-sm border border-gray-200 text-gray-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
            >
              <span class="block truncate">{{ templateLabel(localChart.templateKey) }}</span>
              <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown class="h-5 w-5 text-gray-400" />
              </span>
            </ListboxButton>
          </div>
          <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <ListboxOptions
              class="absolute z-50 mt-2 p-2 w-full bg-white rounded-xl border border-gray-100 shadow-xl focus:outline-none"
            >
              <ListboxOption :value="'main'" v-slot="{ active, selected }">
                <li
                  :class="[
                    'px-3 py-2 text-sm rounded-lg cursor-pointer flex items-center justify-between',
                    active ? 'bg-emerald-50 text-gray-900' : 'text-gray-700',
                  ]"
                >
                  <span>chart-template-01 (Main)</span>
                  <span v-if="selected" class="text-emerald-600 text-xs">เลือก</span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </Transition>
        </Listbox>
      </div>

      <div class="text-xs text-gray-500">คลิกเพื่อวางจุด</div>
      <div
        ref="canvasEl"
        class="relative border border-gray-200 rounded-lg bg-white overflow-hidden select-none"
        :style="{ width: '100%', height: '520px' }"
        @click="onCanvasClick"
      >
        <img
          :src="templateSrc"
          alt="body-template"
          class="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />

        <!-- Grid overlay -->
        <template v-for="(x, xi) in meta.splitX" :key="'vx-'+xi">
          <div
            v-if="xi > 0 && xi < meta.splitX.length - 1"
            class="absolute top-0 bottom-0 border-r border-dashed border-gray-300 pointer-events-none"
            :style="{ left: (x * 100) + '%' }"
          ></div>
        </template>
        <template v-for="(y, yi) in meta.splitY" :key="'hz-'+yi">
          <div
            v-if="yi > 0 && yi < meta.splitY.length - 1"
            class="absolute left-0 right-0 border-t border-dashed border-gray-300 pointer-events-none"
            :style="{ top: (y * 100) + '%' }"
          ></div>
        </template>

        

        <!-- Points -->
        <div
          v-for="(p, i) in localChart.points"
          :key="p.id || i"
          class="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          :style="pointStyle(p)"
          @mousedown.stop
        >
          <div
            class="w-5 h-5 rounded-full ring-2 ring-white shadow flex items-center justify-center"
            :style="{ backgroundColor: p.color || '#10b981' }"
            :title="`#${i + 1}`"
          >
            <span class="text-[10px] leading-none text-white font-semibold">{{ i + 1 }}</span>
          </div>
        </div>
      </div>
    </div>

   <!-- Right: Points editor (3 cols) -->
 <div class="col-span-3 bg-[#f5f5f7] text-gray-800 rounded-2xl p-6 relative min-h-[520px] shadow-inner">

  <div class="text-sm font-semibold mb-4 text-gray-700 tracking-wide flex items-center gap-2">
    <MapPin class="w-4 h-4 text-emerald-600" />
    พิกัดที่ทำเครื่องหมาย
  </div>

  <!-- Empty state -->
  <div v-if="!localChart.points.length" class="text-xs text-gray-400 italic mt-10 text-center">
    ยังไม่มีจุด — คลิกบนแผนภาพเพื่อเพิ่มจุดแรก
  </div>

  <!-- Points list -->
  <div class="max-h-[550px] overflow-y-auto p-1">
  <div
    v-for="(p, i) in localChart.points"
    :key="p.id || i"
    class="bg-white/70 backdrop-blur-md border border-gray-200 rounded-xl p-4 mb-4 shadow-sm hover:shadow-md transition-all duration-200"
  >
    <div class="flex items-center gap-3 mb-2">
      <span
        class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-xs font-semibold shadow-sm"
      >
        #{{ i + 1 }}
      </span>
      <span class="text-sm font-medium text-gray-600 bg-gray-100 rounded-md px-2 py-0.5">
        {{ quadrant(p) }}
      </span>
      <input
        type="color"
        v-model="p.color"
        @input="emitUpdate"
        class="ml-2 w-7 h-7 rounded overflow-hidden border border-gray-300 shadow-inner cursor-pointer"
      />
      <button
        class="ml-auto inline-flex items-center gap-1 text-red-500 hover:text-red-600 text-sm font-medium transition-colors"
        @click="removePoint(i)"
      >
        <Trash2 class="w-4 h-4" />
        ลบ
      </button>
    </div>

    <div class="text-[11px] text-gray-500 mb-1">รายละเอียด</div>
    <textarea
      v-model="p.label"
      @input="emitUpdate"
      rows="3"
      class="w-full text-sm text-gray-700 bg-white/60 border border-gray-200 rounded-lg px-3 py-2 
             outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent shadow-sm"
      placeholder="รายละเอียดของจุด #{{ i + 1 }}"
    ></textarea>
  </div>
  </div>
</div>

  </div>
  
</template>

<script>
import { MapPin, Trash2 } from 'lucide-vue-next'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { ChevronDown } from 'lucide-vue-next'
export default {
  name: 'ChartTab',
  components: { MapPin, Trash2, Listbox, ListboxButton, ListboxOptions, ListboxOption, ChevronDown },
  props: {
    chart: { type: Object, default: () => ({ templateKey: 'main', points: [] }) }
  },
  emits: ['update:chart', 'save'],
  data() {
    return {
      localChart: { templateKey: 'main', points: [] },
      // เส้นแบ่งกริดของ template (1 แถว 4 คอลัมน์: FRONT, LEFT, RIGHT, BACK)
      meta: {
        // 2x2 grid
        splitX: [0, 0.5, 1],
        splitY: [0, 0.5, 1]
      }
    }
  },
  computed: {
    templateSrc() {
      // ใช้รูปเดียวเป็นค่าเริ่มต้น (วางไฟล์ไว้ที่ public/chart/body-main.png)
      return '/chart/body-main.png'
    }
  },
  watch: {
    chart: {
      immediate: true,
      deep: true,
      handler(v) {
        this.localChart = v && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : { templateKey: 'main', points: [] }
      }
    }
  },
  methods: {
    templateLabel(key) {
      if (key === 'main') return 'chart-template-01 (Main)'
      return 'Unknown template'
    },
    emitUpdate() {
      this.$emit('update:chart', JSON.parse(JSON.stringify(this.localChart)))
    },
    onCanvasClick(e) {
      const el = this.$refs.canvasEl
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      const p = { id: (crypto?.randomUUID && crypto.randomUUID()) || String(Date.now()), x, y, color: this.randomColor(), label: '' }
      this.localChart.points.push(p)
      this.emitUpdate()
    },
    randomColor() {
      // พาเลตต์สีที่มองเห็นบนพื้นเข้มได้ดี
      const palette = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#14B8A6', '#E11D48']
      return palette[Math.floor(Math.random() * palette.length)]
    },
    pointStyle(p) {
      return { left: `${(p.x || 0) * 100}%`, top: `${(p.y || 0) * 100}%` }
    },
    colIndex(x) {
      const xs = this.meta.splitX
      for (let i = 0; i < xs.length - 1; i++) {
        if (x >= xs[i] && x <= xs[i + 1]) return i
      }
      return 0
    },
    rowIndex(y) {
      const ys = this.meta.splitY
      for (let i = 0; i < ys.length - 1; i++) {
        if (y >= ys[i] && y <= ys[i + 1]) return i
      }
      return 0
    },
  
    quadrant(p) {
      const x = p.x || 0, y = p.y || 0
      // Global 2x2 split across the whole image (APSX style)
      const xm = 0.5
      const ym = 0.5
      const v = y < ym ? 'T' : 'B'
      const h = x < xm ? 'L' : 'R'
      return v + h
    },
    removePoint(i) {
      this.localChart.points.splice(i, 1)
      this.emitUpdate()
    }
  }
}
</script>

<style scoped></style>


