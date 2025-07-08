/**
 * Advanced Pinia Store integrated with Application Orchestrator
 * Provides reactive state management with sophisticated orchestration
 */

import { defineStore } from 'pinia'
import { computed } from 'vue'
import { appOrchestrator } from '../core/ApplicationOrchestrator'
import type { TreeNode } from '../types'

export const useAppStore = defineStore('app', () => {
  // Initialize the orchestrator
  const orchestrator = appOrchestrator

  // Reactive state from orchestrator
  const state = orchestrator.state

  // Computed getters
  const data = computed(() => state.data)
  const filteredData = computed(() => state.filteredData)
  const searchTerm = computed(() => state.searchTerm)
  const selectedCategories = computed(() => state.selectedCategories)
  const isLoading = computed(() => state.isLoading)
  const error = computed(() => state.error)
  const isLegendVisible = computed(() => state.isLegendVisible)
  const isDarkMode = computed(() => state.isDarkMode)
  const treeState = computed(() => state.treeState)
  const ui = computed(() => state.ui)
  const performance = computed(() => state.performance)

  // Advanced computed properties
  const nodeCount = computed(() => {
    if (!data.value) return 0
    return countNodes(data.value)
  })

  const searchResults = computed(() => {
    if (!searchTerm.value || !data.value) return null
    return findNodes(data.value, searchTerm.value)
  })

  const analytics = computed(() => orchestrator.getAnalytics())

  // Actions that dispatch to orchestrator
  const actions = {
    async initialize() {
      await orchestrator.initialize()
    },

    async loadData() {
      await orchestrator.dispatch({ type: 'LOAD_DATA' })
    },

    async setSearchTerm(term: string) {
      await orchestrator.dispatch({
        type: 'SET_SEARCH_TERM',
        payload: term
      })
    },

    async toggleCategory(category: string) {
      await orchestrator.dispatch({
        type: 'TOGGLE_CATEGORY',
        payload: category
      })
    },

    async setLoading(loading: boolean) {
      await orchestrator.dispatch({
        type: 'SET_LOADING',
        payload: loading
      })
    },

    async setError(error: string | null) {
      await orchestrator.dispatch({
        type: 'SET_ERROR',
        payload: error
      })
    },

    toggleLegend() {
      orchestrator.dispatch({ type: 'TOGGLE_LEGEND' })
    },

    setLegendVisible(visible: boolean) {
      orchestrator.dispatch({
        type: 'TOGGLE_LEGEND',
        payload: visible
      })
    },

    async toggleDarkMode() {
      await orchestrator.dispatch({ type: 'TOGGLE_DARK_MODE' })
    },

    selectTreeNode(nodeId: string) {
      orchestrator.dispatch({
        type: 'TREE_NODE_SELECT',
        payload: nodeId
      })
    },

    expandTreeNode(nodeId: string) {
      orchestrator.dispatch({
        type: 'TREE_NODE_EXPAND',
        payload: nodeId
      })
    },

    zoomTree(level: number) {
      orchestrator.dispatch({
        type: 'TREE_ZOOM',
        payload: level
      })
    },

    panTree(offset: { x: number; y: number }) {
      orchestrator.dispatch({
        type: 'TREE_PAN',
        payload: offset
      })
    },

    showNotification(notification: {
      type: 'info' | 'success' | 'warning' | 'error'
      message: string
    }) {
      orchestrator.dispatch({
        type: 'UI_SHOW_NOTIFICATION',
        payload: notification
      })
    },

    dismissNotification(id: string) {
      orchestrator.dispatch({
        type: 'UI_DISMISS_NOTIFICATION',
        payload: id
      })
    },

    toggleSidebar() {
      orchestrator.dispatch({ type: 'UI_TOGGLE_SIDEBAR' })
    },

    setModal(modalId: string | null) {
      orchestrator.dispatch({
        type: 'UI_SET_MODAL',
        payload: modalId
      })
    },

    // Advanced orchestrator methods
    undo() {
      return orchestrator.undo()
    },

    redo() {
      return orchestrator.redo()
    },

    startTransaction() {
      orchestrator.startTransaction()
    },

    async commitTransaction(description?: string) {
      return await orchestrator.commitTransaction(description)
    },

    async rollbackTransaction() {
      await orchestrator.rollbackTransaction()
    },

    getHistory() {
      return orchestrator.getHistory()
    },

    getAnalytics() {
      return orchestrator.getAnalytics()
    }
  }

  // Utility functions
  function countNodes(node: TreeNode): number {
    let count = 1
    if (node.children) {
      count += node.children.reduce((sum, child) => sum + countNodes(child), 0)
    }
    return count
  }

  function findNodes(node: TreeNode, searchTerm: string): TreeNode[] {
    const results: TreeNode[] = []
    const term = searchTerm.toLowerCase()

    if (node.name.toLowerCase().includes(term)) {
      results.push(node)
    }

    if (node.children) {
      for (const child of node.children) {
        results.push(...findNodes(child, searchTerm))
      }
    }

    return results
  }

  return {
    // State
    data,
    filteredData,
    searchTerm,
    selectedCategories,
    isLoading,
    error,
    isLegendVisible,
    isDarkMode,
    treeState,
    ui,
    performance,
    
    // Computed
    nodeCount,
    searchResults,
    analytics,
    
    // Actions
    ...actions,
    
    // Direct orchestrator access for advanced use cases
    orchestrator
  }
})

export type AppStore = ReturnType<typeof useAppStore>
