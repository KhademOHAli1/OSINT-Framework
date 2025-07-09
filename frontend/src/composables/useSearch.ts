import { ref, computed, type Ref } from 'vue'
import type { TreeNode } from '@/types'

export function useSearch() {
  const searchQuery = ref('')
  const isSearchActive = ref(false)

  // Filter tree nodes recursively based on search query
  const filterTreeNodes = (nodes: TreeNode[], query: string): TreeNode[] => {
    if (!query.trim()) return nodes

    const lowercaseQuery = query.toLowerCase()
    
    return nodes.reduce((filtered: TreeNode[], node) => {
      const matchesName = node.name.toLowerCase().includes(lowercaseQuery)
      const matchesUrl = node.url?.toLowerCase().includes(lowercaseQuery)
      
      let filteredChildren: TreeNode[] = []
      if (node.children) {
        filteredChildren = filterTreeNodes(node.children, query)
      }

      // Include node if it matches or has matching children
      if (matchesName || matchesUrl || filteredChildren.length > 0) {
        filtered.push({
          ...node,
          children: filteredChildren.length > 0 ? filteredChildren : node.children,
          // Mark as highlighted if it matches directly
          highlighted: matchesName || matchesUrl
        })
      }

      return filtered
    }, [])
  }

  // Get search results from tree data
  const getFilteredNodes = (treeData: Ref<TreeNode | null>) => {
    return computed(() => {
      if (!treeData.value || !searchQuery.value.trim()) {
        return treeData.value
      }

      const filtered = filterTreeNodes([treeData.value], searchQuery.value)
      return filtered.length > 0 ? filtered[0] : null
    })
  }

  // Search statistics
  const getSearchStats = (filteredData: Ref<TreeNode | null>) => {
    return computed(() => {
      if (!filteredData.value || !searchQuery.value.trim()) {
        return { totalResults: 0, toolCount: 0, categoryCount: 0 }
      }

      let toolCount = 0
      let categoryCount = 0

      const countNodes = (node: TreeNode) => {
        if (node.type === 'url') {
          toolCount++
        } else if (node.type === 'folder') {
          categoryCount++
        }

        if (node.children) {
          node.children.forEach(countNodes)
        }
      }

      countNodes(filteredData.value)

      return {
        totalResults: toolCount + categoryCount,
        toolCount,
        categoryCount
      }
    })
  }

  // Highlight search terms in text
  const highlightSearchTerm = (text: string, query: string): string => {
    if (!query.trim()) return text
    
    const regex = new RegExp(`(${query})`, 'gi')
    return text.replace(regex, '<mark class="bg-yellow-300 dark:bg-yellow-600 px-1 rounded">$1</mark>')
  }

  // Clear search
  const clearSearch = () => {
    searchQuery.value = ''
    isSearchActive.value = false
  }

  // Set search query
  const setSearchQuery = (query: string) => {
    searchQuery.value = query
    isSearchActive.value = !!query.trim()
  }

  return {
    searchQuery,
    isSearchActive,
    getFilteredNodes,
    getSearchStats,
    highlightSearchTerm,
    clearSearch,
    setSearchQuery
  }
}

// Search history management
export function useSearchHistory() {
  const searchHistory = ref<string[]>([])
  const maxHistoryItems = 10

  // Load search history from localStorage
  const loadSearchHistory = () => {
    try {
      const stored = localStorage.getItem('osint-search-history')
      if (stored) {
        searchHistory.value = JSON.parse(stored)
      }
    } catch (error) {
      console.warn('Failed to load search history:', error)
    }
  }

  // Save search history to localStorage
  const saveSearchHistory = () => {
    try {
      localStorage.setItem('osint-search-history', JSON.stringify(searchHistory.value))
    } catch (error) {
      console.warn('Failed to save search history:', error)
    }
  }

  // Add search term to history
  const addToHistory = (query: string) => {
    if (!query.trim()) return

    // Remove existing entry if it exists
    const index = searchHistory.value.indexOf(query)
    if (index > -1) {
      searchHistory.value.splice(index, 1)
    }

    // Add to beginning
    searchHistory.value.unshift(query)

    // Limit history size
    if (searchHistory.value.length > maxHistoryItems) {
      searchHistory.value = searchHistory.value.slice(0, maxHistoryItems)
    }

    saveSearchHistory()
  }

  // Clear search history
  const clearHistory = () => {
    searchHistory.value = []
    saveSearchHistory()
  }

  // Initialize
  loadSearchHistory()

  return {
    searchHistory,
    addToHistory,
    clearHistory
  }
}
