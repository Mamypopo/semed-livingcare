<template>
  <div class="relative">
    <Listbox v-model="selectedValue" @update:modelValue="handleSelection">
      <div class="relative">
        <ListboxButton
          class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-200 text-gray-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
        >
          <div class="flex items-center gap-2">
            <span class="block truncate">{{
              selectedBranch ? selectedBranch.name : placeholder
            }}</span>
            <span
              v-if="selectedBranch?.code"
              class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md font-medium whitespace-nowrap"
            >
              {{ selectedBranch.code }}
            </span>
          </div>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDown class="h-5 w-5 text-gray-400" />
          </span>
        </ListboxButton>

        <ListboxOptions
          class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <!-- Search Input -->
          <div class="px-3 py-2 border-b border-gray-200">
            <input
              v-model="searchQuery"
              type="text"
              class="w-full px-2 py-1 text-sm border border-gray-200 rounded-lg shadow-sm bg-white text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
              placeholder="ค้นหาสาขา..."
              @click.stop
            />
          </div>

          <!-- Options -->
          <ListboxOption
            v-for="branch in filteredBranches"
            :key="branch.id"
            :value="branch.id"
            v-slot="{ active, selected }"
          >
            <li
              :class="[
                active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900',
                'relative cursor-default select-none py-2 pr-4',
                selected ? 'pl-10' : 'pl-3'
              ]"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                    {{ branch.name }}
                  </span>
                  <span
                    v-if="branch.code"
                    class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md font-medium whitespace-nowrap"
                  >
                    {{ branch.code }}
                  </span>
                </div>
                <span v-if="selected" class="text-emerald-600">
                  <Check class="h-4 w-4" />
                </span>
              </div>
            </li>
          </ListboxOption>

          <!-- No Results -->
          <div
            v-if="filteredBranches.length === 0"
            class="px-3 py-2 text-sm text-gray-500 text-center"
          >
            ไม่พบสาขา
          </div>
        </ListboxOptions>
      </div>
    </Listbox>
  </div>
</template>

<script>
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { ChevronDown, Check } from 'lucide-vue-next'
import { branchService } from '@/services/branch.js'

export default {
  name: 'BranchDropdown',
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
      default: 'เลือกสาขา...'
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      searchQuery: '',
      branches: [],
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
    selectedBranch() {
      return this.branches.find(branch => branch.id === this.modelValue)
    },
    filteredBranches() {
      return this.branches
    }
  },
  watch: {
    searchQuery: {
      handler: 'debouncedSearch',
      immediate: false
    }
  },
  async mounted() {
    await this.loadBranches()
  },
  methods: {
    async loadBranches() {
      try {
        const response = await branchService.getAllForDropdown('', 50)
        this.branches = response || []
      } catch (error) {
        console.error('Error loading branches:', error)
        this.branches = []
      }
    },
    async searchBranches() {
      try {
        const response = await branchService.getAllForDropdown(this.searchQuery, 50)
        this.branches = response || []
      } catch (error) {
        console.error('Error searching branches:', error)
        this.branches = []
      }
    },
    debouncedSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      this.searchTimeout = setTimeout(() => {
        this.searchBranches()
      }, 300)
    },
    handleSelection(value) {
      this.selectedValue = value
      this.searchQuery = ''
    }
  }
}
</script>
