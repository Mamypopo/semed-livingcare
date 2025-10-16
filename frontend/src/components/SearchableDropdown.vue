<template>
  <div class="relative">
    <Listbox v-model="selectedValue" @update:modelValue="handleSelection">
      <div class="relative">
        <ListboxButton class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <span class="block truncate">
            <slot name="display" :selected="selectedItem">
              {{ selectedItem ? getDisplayText(selectedItem) : placeholder }}
            </slot>
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
              class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              :placeholder="searchPlaceholder"
              @click.stop
            />
          </div>
          
          <!-- Options -->
          <ListboxOption
            v-for="item in filteredOptions"
            :key="getItemKey(item)"
            :value="getItemValue(item)"
            v-slot="{ active, selected }"
          >
            <li :class="[active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
              <slot name="option" :item="item" :active="active" :selected="selected">
                <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                  {{ getDisplayText(item) }}
                </span>
              </slot>
              <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                <Check class="h-5 w-5" />
              </span>
            </li>
          </ListboxOption>
          
          <!-- No Results -->
          <div v-if="filteredOptions.length === 0" class="px-3 py-2 text-sm text-gray-500 text-center">
            ไม่พบข้อมูล
          </div>
        </ListboxOptions>
      </div>
    </Listbox>
  </div>
</template>

<script>
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { ChevronDown, Check } from 'lucide-vue-next'

export default {
  name: 'SearchableDropdown',
  components: {
    Listbox, ListboxButton, ListboxOptions, ListboxOption,
    ChevronDown, Check
  },
  props: {
    modelValue: {
      type: [String, Number, Array],
      default: null
    },
    options: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: 'เลือก...'
    },
    searchPlaceholder: {
      type: String,
      default: 'ค้นหา...'
    },
    displayKey: {
      type: String,
      default: 'name'
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    searchKeys: {
      type: Array,
      default: () => ['name']
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'search'],
  data() {
    return {
      searchQuery: ''
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
    selectedItem() {
      if (this.multiple) {
        return this.options.filter(item => 
          this.modelValue && this.modelValue.includes(this.getItemValue(item))
        )
      }
      return this.options.find(item => this.getItemValue(item) === this.modelValue)
    },
    filteredOptions() {
      if (!this.searchQuery) {
        return this.options
      }
      
      const query = this.searchQuery.toLowerCase()
      return this.options.filter(item => {
        return this.searchKeys.some(key => {
          const value = this.getNestedValue(item, key)
          return value && value.toString().toLowerCase().includes(query)
        })
      })
    }
  },
  watch: {
    searchQuery(newQuery) {
      this.$emit('search', newQuery)
    }
  },
  methods: {
    getItemKey(item) {
      return this.getItemValue(item)
    },
    getItemValue(item) {
      return this.getNestedValue(item, this.valueKey)
    },
    getDisplayText(item) {
      return this.getNestedValue(item, this.displayKey) || ''
    },
    getNestedValue(obj, path) {
      return path.split('.').reduce((current, key) => current?.[key], obj)
    },
    handleSelection(value) {
      this.selectedValue = value
      // Clear search after selection
      this.searchQuery = ''
    }
  }
}
</script>
