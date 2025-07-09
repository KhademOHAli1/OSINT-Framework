<template>
  <div class="search-container">
    <!-- Search Input -->
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon class="h-5 w-5 text-gray-400" />
      </div>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search OSINT tools and categories..."
        class="search-input w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
               bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
               focus:ring-2 focus:ring-blue-500 focus:border-transparent
               placeholder-gray-500 dark:placeholder-gray-400
               transition-all duration-200"
        @input="handleSearchInput"
        @keydown.escape="clearSearch"
        @keydown.enter="addToSearchHistory"
      />
      <div 
        v-if="searchQuery" 
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <button
          @click="clearSearch"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Clear search"
        >
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Search Stats -->
    <div 
      v-if="isSearchActive && searchStats" 
      class="mt-2 text-sm text-gray-600 dark:text-gray-400"
    >
      Found {{ searchStats.totalResults }} results 
      ({{ searchStats.toolCount }} tools, {{ searchStats.categoryCount }} categories)
    </div>

    <!-- Search History Dropdown -->
    <div 
      v-if="showHistory && searchHistory.length > 0" 
      class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 
             border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50
             max-h-48 overflow-y-auto"
    >
      <div class="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
        Recent Searches
      </div>
      <button
        v-for="(term, index) in searchHistory"
        :key="index"
        @click="selectHistoryItem(term)"
        class="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 
               hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
               flex items-center justify-between group"
      >
        <span>{{ term }}</span>
        <ClockIcon class="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
      </button>
      <div class="px-3 py-2 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="clearHistory"
          class="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
        >
          Clear History
        </button>
      </div>
    </div>

    <!-- Quick Filters -->
    <div 
      v-if="showQuickFilters" 
      class="mt-3 flex flex-wrap gap-2"
    >
      <button
        v-for="filter in quickFilters"
        :key="filter.name"
        @click="applyQuickFilter(filter.query)"
        class="px-3 py-1 text-xs font-medium rounded-full 
               bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300
               hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        {{ filter.name }}
      </button>
    </div>

    <!-- Search Suggestions -->
    <div 
      v-if="showSuggestions && suggestions?.length" 
      class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 
             border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50
             max-h-48 overflow-y-auto"
    >
      <div class="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
        Suggestions
      </div>
      <button
        v-for="(suggestion, index) in suggestions"
        :key="index"
        @click="selectSuggestion(suggestion)"
        class="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 
               hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        v-html="highlightSearchTerm(suggestion, searchQuery)"
      >
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSearch, useSearchHistory } from '@/composables/useSearch'
import { 
  MagnifyingGlassIcon as SearchIcon,
  XMarkIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

interface SearchStats {
  totalResults: number
  toolCount: number
  categoryCount: number
}

interface QuickFilter {
  name: string
  query: string
}

// Props
const props = defineProps<{
  searchStats?: SearchStats | null
  showQuickFilters?: boolean
  showHistory?: boolean
  showSuggestions?: boolean
  suggestions?: string[]
}>()

// Emits
const emit = defineEmits<{
  search: [query: string]
  clear: []
}>()

// Composables
const { 
  searchQuery, 
  isSearchActive, 
  highlightSearchTerm, 
  clearSearch: clearSearchQuery,
  setSearchQuery 
} = useSearch()

const { 
  searchHistory, 
  addToHistory, 
  clearHistory 
} = useSearchHistory()

// Local state
const showHistory = ref(false)
const showSuggestions = ref(false)

// Quick filters for common searches
const quickFilters: QuickFilter[] = [
  { name: 'Social Media', query: 'social' },
  { name: 'Email', query: 'email' },
  { name: 'Username', query: 'username' },
  { name: 'Phone', query: 'phone' },
  { name: 'IP Address', query: 'ip' },
  { name: 'Domain', query: 'domain' },
  { name: 'Image', query: 'image' },
  { name: 'People', query: 'people' }
]

// Methods
const handleSearchInput = () => {
  emit('search', searchQuery.value)
  showSuggestions.value = searchQuery.value.length > 0 && Boolean(props.suggestions?.length)
  showHistory.value = false
}

const clearSearch = () => {
  clearSearchQuery()
  emit('clear')
  showHistory.value = false
  showSuggestions.value = false
}

const addToSearchHistory = () => {
  if (searchQuery.value.trim()) {
    addToHistory(searchQuery.value.trim())
    showHistory.value = false
  }
}

const selectHistoryItem = (term: string) => {
  setSearchQuery(term)
  emit('search', term)
  showHistory.value = false
}

const selectSuggestion = (suggestion: string) => {
  setSearchQuery(suggestion)
  emit('search', suggestion)
  showSuggestions.value = false
}

const applyQuickFilter = (query: string) => {
  setSearchQuery(query)
  emit('search', query)
}

// Handle clicks outside to close dropdowns
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  const searchContainer = target.closest('.search-container')
  if (!searchContainer) {
    showHistory.value = false
    showSuggestions.value = false
  }
}

// Handle focus to show history
const handleFocus = () => {
  if (props.showHistory && searchHistory.value.length > 0 && !searchQuery.value) {
    showHistory.value = true
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.search-input {
  transition: all 0.2s ease-in-out;
}

.search-input:focus {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.search-container {
  position: relative;
  z-index: 10;
}

/* Ensure dropdowns appear above other content */
.search-container > div[class*="absolute"] {
  z-index: 50;
}
</style>
