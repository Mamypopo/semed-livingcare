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
    <SearchableDropdown
      :model-value="null"
      :options="availableTags"
      placeholder="เลือกแท็ก..."
      search-placeholder="ค้นหาแท็ก..."
      display-key="name"
      value-key="id"
      :search-keys="['name']"
      @update:model-value="addTag"
      @search="handleTagSearch"
    >
      <template #option="{ item, selected }">
        <div class="flex items-center">
          <div
            class="w-4 h-4 rounded-full mr-3"
            :style="{ backgroundColor: item.color }"
          ></div>
          <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
            {{ item.name }}
          </span>
        </div>
      </template>
    </SearchableDropdown>
  </div>
</template>

<script>
import { X } from 'lucide-vue-next'
import SearchableDropdown from './SearchableDropdown.vue'

export default {
  name: 'TagSelector',
  components: {
    X,
    SearchableDropdown
  },
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    availableTags: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue', 'search'],
  computed: {
    selectedTags: {
      get() {
        return this.modelValue || []
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  methods: {
    addTag(tagId) {
      const tag = this.availableTags.find(t => t.id === tagId)
      if (tag && !this.selectedTags.find(t => t.id === tagId)) {
        this.selectedTags = [...this.selectedTags, tag]
      }
    },
    removeTag(tag) {
      this.selectedTags = this.selectedTags.filter(t => t.id !== tag.id)
    },
    handleTagSearch(query) {
      this.$emit('search', query)
    }
  }
}
</script>
