import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TreeNode } from '../types'

export const useAppStore = defineStore('app', () => {
  // State
  const isDarkMode = ref(false)
  const searchTerm = ref('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<TreeNode | null>(null)
  const expandedNodes = ref<Set<string>>(new Set())
  const isLegendVisible = ref(false)

  // Computed
  const filteredData = computed(() => {
    if (!data.value) return null
    if (!searchTerm.value.trim()) return data.value
    
    try {
      return filterTreeData(data.value, searchTerm.value.toLowerCase())
    } catch (error) {
      console.error('Error filtering data:', error)
      return data.value
    }
  })

  const hasSearchResults = computed(() => {
    return searchTerm.value.trim() !== '' && filteredData.value !== null
  })

  // Helper function for dark mode
  const updateDocumentClass = () => {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Initialize dark mode from localStorage
  const initializeDarkMode = () => {
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      isDarkMode.value = JSON.parse(saved)
    } else {
      // Check system preference
      isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    updateDocumentClass()
  }

  // Updated toggle function with persistence
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode.value))
    updateDocumentClass()
  }

  const setSearchTerm = (term: string) => {
    searchTerm.value = term
  }

  const clearSearch = () => {
    searchTerm.value = ''
  }

  const setData = (newData: TreeNode) => {
    data.value = newData
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setError = (errorMessage: string | null) => {
    error.value = errorMessage
  }

  const setLegendVisible = (visible: boolean) => {
    isLegendVisible.value = visible
  }

  const toggleNode = (nodeId: string) => {
    if (expandedNodes.value.has(nodeId)) {
      expandedNodes.value.delete(nodeId)
    } else {
      expandedNodes.value.add(nodeId)
    }
  }

  const expandNode = (nodeId: string) => {
    expandedNodes.value.add(nodeId)
  }

  const collapseNode = (nodeId: string) => {
    expandedNodes.value.delete(nodeId)
  }

  const isNodeExpanded = (nodeId: string) => {
    return expandedNodes.value.has(nodeId)
  }

  const toggleLegend = () => {
    isLegendVisible.value = !isLegendVisible.value
  }

  // Helper function for filtering tree data
  const filterTreeData = (node: TreeNode, searchTerm: string): TreeNode | null => {
    const matchesSearch = node.name.toLowerCase().includes(searchTerm)
    
    let filteredChildren: TreeNode[] = []
    if (node.children) {
      filteredChildren = node.children
        .map(child => filterTreeData(child, searchTerm))
        .filter(child => child !== null) as TreeNode[]
    }

    if (matchesSearch || filteredChildren.length > 0) {
      return {
        ...node,
        children: filteredChildren.length > 0 ? filteredChildren : node.children
      }
    }

    return null
  }

  return {
    // State
    isDarkMode,
    searchTerm,
    isLoading,
    error,
    data,
    expandedNodes,
    isLegendVisible,
    // Computed
    filteredData,
    hasSearchResults,
    // Actions
    toggleDarkMode,
    setSearchTerm,
    clearSearch,
    setData,
    setLoading,
    setError,
    setLegendVisible,
    toggleNode,
    expandNode,
    collapseNode,
    isNodeExpanded,
    toggleLegend,
    initializeDarkMode
  }
})
