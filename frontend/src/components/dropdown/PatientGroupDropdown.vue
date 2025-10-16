<template>
  <div class="relative">
    <Listbox v-model="selectedValue" @update:modelValue="handleSelection">
      <div class="relative">
        <ListboxButton class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-200 text-gray-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400">
          <span class="block truncate">
            <div v-if="selectedGroup" class="flex items-center">
              <div v-if="selectedGroup.color" class="w-4 h-4 rounded-full mr-3" :style="{ backgroundColor: selectedGroup.color }"></div>
              <span>{{ selectedGroup.name }}</span>
            </div>
            <span v-else>{{ placeholder }}</span>
          </span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDown class="h-5 w-5 text-gray-400" />
          </span>
        </ListboxButton>
        
        <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          <!-- Search Input -->
          <div class="px-3 py-2 border-b border-gray-200">
            <input
              v-model="searchQuery"
              type="text"
              class="w-full px-2 py-1 text-sm border border-gray-200 rounded-lg shadow-sm 
                     bg-white text-gray-700 placeholder-gray-400 
                     focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80
                     focus:outline-none transition-colors duration-200 hover:border-emerald-400"
              placeholder="ค้นหากลุ่มลูกค้า..."
              @click.stop
            />
          </div>
          
          <!-- Options -->
          <ListboxOption
            v-for="group in filteredGroups"
            :key="group.id"
            :value="group.id"
            v-slot="{ active, selected }"
          >
            <li :class="[active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pr-4', selected ? 'pl-10' : 'pl-3']">
              <div class="flex items-center">
                <div v-if="group.color" class="w-4 h-4 rounded-full mr-3" :style="{ backgroundColor: group.color }"></div>
                <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                  {{ group.name }}
                </span>
              </div>
              <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                <Check class="h-5 w-5" />
              </span>
            </li>
          </ListboxOption>
          
          <!-- No Results -->
          <div v-if="filteredGroups.length === 0" class="px-3 py-2 text-sm text-gray-500 text-center">
            ไม่พบกลุ่มลูกค้า
          </div>
        </ListboxOptions>
      </div>
    </Listbox>
  </div>
</template>

<script>
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { ChevronDown, Check } from 'lucide-vue-next'
import patientGroupService from '@/services/patient-group.js'

export default {
  name: 'PatientGroupDropdown',
  components: {
    Listbox, ListboxButton, ListboxOptions, ListboxOption,
    ChevronDown, Check
  },
  props: {
    modelValue: {
      type: [String, Number],
      default: null
    },
    placeholder: {
      type: String,
      default: 'เลือกกลุ่มลูกค้า...'
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      searchQuery: '',
      patientGroups: [],
      searchTimeout: null
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
    selectedGroup() {
      return this.patientGroups.find(group => group.id === this.modelValue)
    },
    filteredGroups() {
      return this.patientGroups
    }
  },
  watch: {
    searchQuery: {
      handler: 'debouncedSearch',
      immediate: false
    }
  },
  async mounted() {
    await this.loadPatientGroups()
  },
  methods: {
    async loadPatientGroups(query = '') {
      try {
        const response = await patientGroupService.getAllForDropdown(query, 50)
        this.patientGroups = response || []
      } catch (error) {
        console.error('Error loading patient groups:', error)
        this.patientGroups = []
      }
    },
    async searchGroups() {
      await this.loadPatientGroups(this.searchQuery)
    },
    debouncedSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      this.searchTimeout = setTimeout(() => {
        this.searchGroups()
      }, 300)
    },
    handleSelection(value) {
      this.selectedValue = value
      this.searchQuery = ''
    }
  }
}
</script>
