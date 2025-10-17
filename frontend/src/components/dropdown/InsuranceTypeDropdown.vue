<template>
  <div class="relative">
    <Listbox v-model="selectedValue" @update:modelValue="handleSelection">
      <div class="relative">
        <ListboxButton
          class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-200 text-gray-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
          @click="showDropdown = !showDropdown"
        >
          <span class="block truncate">
            {{ selectedType ? selectedType.name : placeholder }}
          </span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDown
              class="h-5 w-5 text-gray-400 transition-transform duration-200"
              :class="{ 'rotate-180': showDropdown }"
            />
          </span>
        </ListboxButton>

        <ListboxOptions
          class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm transition-colors duration-200"
          @click-outside="showDropdown = false"
        >
          <!-- Search Input -->
          <div class="px-3 py-2 border-b border-gray-200">
            <input
              v-model="searchQuery"
              type="text"
              class="w-full px-2 py-1 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
              placeholder="ค้นหาประเภทสิทธิ์การรักษา..."
              @click.stop
            />
          </div>

          <!-- Options -->
          <ListboxOption
            v-for="type in filteredTypes"
            :key="type.id"
            :value="type.id"
            v-slot="{ active, selected }"
          >
            <li
              :class="[
                active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900',
                'relative cursor-default select-none py-2 pr-4',
                selected ? 'pl-10' : 'pl-3'
              ]"
            >
              <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                {{ type.name }}
              </span>
              <span
                v-if="selected"
                class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600"
              >
                <Check class="h-5 w-5" />
              </span>
            </li>
          </ListboxOption>

          <!-- No Results -->
          <div
            v-if="filteredTypes.length === 0"
            class="px-3 py-2 text-sm text-gray-500 text-center"
          >
            ไม่พบประเภทสิทธิ์การรักษา
          </div>
        </ListboxOptions>
      </div>
    </Listbox>
  </div>
</template>

<script>
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { ChevronDown, Check } from 'lucide-vue-next'
import insuranceTypeService from '@/services/insurance-type.js'

export default {
  name: 'InsuranceTypeDropdown',
  components: {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    ChevronDown,
    Check
  },
  props: {
    modelValue: {
      type: [String, Number],
      default: null
    },
    placeholder: {
      type: String,
      default: 'เลือกประเภทสิทธิ์การรักษา...'
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      searchQuery: '',
      insuranceTypes: [],
      searchTimeout: null,
      showDropdown: false
    }
  },
  computed: {
    selectedValue: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
    selectedType() {
      return this.insuranceTypes.find(type => type.id === this.modelValue)
    },
    filteredTypes() {
      return this.insuranceTypes
    }
  },
  watch: {
    searchQuery: {
      handler: 'debouncedSearch',
      immediate: false
    }
  },
  async mounted() {
    await this.loadInsuranceTypes()
  },
  methods: {
    async loadInsuranceTypes(query = '') {
      try {
        const response = await insuranceTypeService.getAllForDropdown(query, 50)
        this.insuranceTypes = response || []
      } catch (error) {
        console.error('Error loading insurance types:', error)
        this.insuranceTypes = []
      }
    },
    async searchTypes() {
      await this.loadInsuranceTypes(this.searchQuery)
    },
    debouncedSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      this.searchTimeout = setTimeout(() => {
        this.searchTypes()
      }, 300)
    },
    handleSelection(value) {
      this.selectedValue = value
      this.searchQuery = ''
      this.showDropdown = false
    }
  }
}
</script>
