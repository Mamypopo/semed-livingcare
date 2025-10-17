<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-sm font-medium text-gray-700">{{ label }}</label>

    <div class="flex items-center space-x-2">
      <!-- Color Input -->
      <input
        v-model="colorValue"
        type="color"
        class="h-10 w-16 border border-gray-200 rounded-md cursor-pointer focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 hover:border-emerald-300"
        @input="onColorChange"
      />

      <!-- Text Input -->
      <input
        v-model="colorValue"
        type="text"
        :placeholder="placeholder"
        class="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 hover:border-emerald-300 focus:outline-none font-mono text-sm"
        @input="onTextChange"
      />

      <!-- Random Color Button -->
      <button
        type="button"
        @click="generateRandomColor"
        class="px-3 py-2 text-sm border border-gray-200 rounded-md bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
        v-tooltip:top="'สุ่มสี'"
      >
        <Shuffle class="w-4 h-4" />
      </button>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="text-xs text-red-600">{{ error }}</p>

    <!-- Color Preview -->
    <div v-if="showPreview" class="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div
            class="w-8 h-8 rounded-lg border-2 border-white shadow-md"
            :style="{ backgroundColor: colorValue }"
          ></div>
          <div>
            <div class="text-sm font-mono text-gray-800 font-semibold">{{ colorValue }}</div>
            <div class="text-xs text-gray-500">{{ getColorName(colorValue) }}</div>
          </div>
        </div>
        <div class="text-xs text-gray-400">ตัวอย่างสี</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Shuffle } from 'lucide-vue-next'

export default {
  name: 'ColorPicker',
  components: { Shuffle },
  props: {
    modelValue: {
      type: String,
      default: '#22C55E'
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '#22C55E'
    },
    showPreview: {
      type: Boolean,
      default: true
    },
    error: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      colorValue: this.modelValue
    }
  },
  watch: {
    modelValue(newValue) {
      this.colorValue = newValue
    }
  },
  methods: {
    onColorChange(event) {
      this.colorValue = event.target.value
      this.$emit('update:modelValue', this.colorValue)
    },

    onTextChange(event) {
      let value = event.target.value

      // Add # if missing
      if (value && !value.startsWith('#')) {
        value = '#' + value
      }

      // Validate hex color format
      if (value && /^#[0-9A-F]{6}$/i.test(value)) {
        this.colorValue = value.toUpperCase()
        this.$emit('update:modelValue', this.colorValue)
      } else {
        this.colorValue = value
      }
    },

    generateRandomColor() {
      // Generate random hex color
      const randomColor =
        '#' +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .toUpperCase()
          .padStart(6, '0')
      this.colorValue = randomColor
      this.$emit('update:modelValue', this.colorValue)
    },

    getColorName(hex) {
      // Common color names
      const colorNames = {
        '#FF0000': 'แดง',
        '#00FF00': 'เขียว',
        '#0000FF': 'น้ำเงิน',
        '#FFFF00': 'เหลือง',
        '#FF00FF': 'ม่วง',
        '#00FFFF': 'ฟ้า',
        '#000000': 'ดำ',
        '#FFFFFF': 'ขาว',
        '#808080': 'เทา',
        '#FFA500': 'ส้ม',
        '#800080': 'ม่วงเข้ม',
        '#008000': 'เขียวเข้ม',
        '#000080': 'น้ำเงินเข้ม',
        '#800000': 'แดงเข้ม',
        '#808000': 'เขียวเหลือง',
        '#C0C0C0': 'เงิน',
        '#FFC0CB': 'ชมพู',
        '#A52A2A': 'น้ำตาล',
        '#FFD700': 'ทอง',
        '#E6E6FA': 'ม่วงอ่อน'
      }

      return colorNames[hex] || 'สีกำหนดเอง'
    }
  }
}
</script>
