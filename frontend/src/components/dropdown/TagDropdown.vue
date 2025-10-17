<template>
  <div class="space-y-2">
    <!-- Selected Tags Display -->
    <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-2">
      <span
        v-for="tag in selectedTags"
        :key="tag.id"
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        :style="{ backgroundColor: tag.color + '20', color: tag.color }"
      >
        {{ tag.name }}
        <button
          type="button"
          @click="removeTag(tag)"
          class="ml-1.5 inline-flex h-4 w-4 rounded-full p-0.5 hover:bg-gray-200"
        >
          <X class="h-3 w-3" />
        </button>
      </span>
    </div>

    <!-- Searchable Dropdown -->
    <div class="relative">
      <Listbox v-model="selectedValue" @update:modelValue="handleSelection">
        <div class="relative">
          <ListboxButton
            class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-200 text-gray-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300/80 focus:outline-none transition-colors duration-200 hover:border-emerald-400"
          >
            <span class="block truncate">
              {{ placeholder }}
            </span>
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
                placeholder="ค้นหาแท็ก..."
                @click.stop
              />
            </div>

            <!-- Options -->
            <ListboxOption
              v-for="tag in filteredTags"
              :key="tag.id"
              :value="tag.id"
              v-slot="{ active, selected }"
            >
              <li
                :class="[
                  active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900',
                  'relative cursor-default select-none py-2 pr-4',
                  selected ? 'pl-10' : 'pl-3'
                ]"
              >
                <div class="flex items-center">
                  <div
                    class="w-4 h-4 rounded-full mr-3"
                    :style="{ backgroundColor: tag.color }"
                  ></div>
                  <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                    {{ tag.name }}
                  </span>
                </div>
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
              v-if="filteredTags.length === 0"
              class="px-3 py-2 text-sm text-gray-500 text-center"
            >
              ไม่พบแท็ก
            </div>
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  </div>
</template>

<script>
import { X, ChevronDown, Check } from 'lucide-vue-next'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import tagService from '@/services/tag.js'

export default {
  name: 'TagDropdown',
  components: {
    X,
    ChevronDown,
    Check,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption
  },
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: 'เลือกแท็ก...'
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      searchQuery: '',
      availableTags: [],
      searchTimeout: null
    }
  },
  computed: {
    selectedTags: {
      get() {
        return this.modelValue || []
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
    selectedValue: {
      get() {
        return null // ไม่มีค่า selected เพราะเป็น multi-select
      },
      set(value) {
        // ไม่ต้องทำอะไร เพราะเป็น multi-select
      }
    },
    filteredTags() {
      return this.availableTags
    }
  },
  watch: {
    searchQuery: {
      handler: 'debouncedSearch',
      immediate: false
    }
  },
  async mounted() {
    await this.loadTags()
  },
  methods: {
    async loadTags(query = '') {
      try {
        const response = await tagService.getAllForDropdown(query, 50)
        this.availableTags = response || []
      } catch (error) {
        console.error('Error loading tags:', error)
        this.availableTags = []
      }
    },
    async searchTags() {
      try {
        const response = await tagService.getAllForDropdown(this.searchQuery, 50)
        this.availableTags = response || []
      } catch (error) {
        console.error('Error searching tags:', error)
        this.availableTags = []
      }
    },
    debouncedSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      this.searchTimeout = setTimeout(() => {
        this.searchTags()
      }, 300)
    },
    handleSelection(tagId) {
      this.addTag(tagId)
      this.searchQuery = ''
    },
    addTag(tagId) {
      const tag = this.availableTags.find(t => t.id === tagId)
      if (tag && !this.selectedTags.find(t => t.id === tagId)) {
        this.selectedTags = [...this.selectedTags, tag]
      }
    },
    removeTag(tag) {
      this.selectedTags = this.selectedTags.filter(t => t.id !== tag.id)
    }
  }
}
</script>
