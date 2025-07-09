import { ref, computed } from 'vue'
import type { TreeNode } from '../types'

export interface ToolModalState {
  isOpen: boolean
  tool: TreeNode | null
}

// Global modal state
const modalState = ref<ToolModalState>({
  isOpen: false,
  tool: null
})

export function useToolModal() {
  const isOpen = computed(() => modalState.value.isOpen)
  const currentTool = computed(() => modalState.value.tool)

  const openToolModal = (tool: TreeNode) => {
    modalState.value = {
      isOpen: true,
      tool
    }
  }

  const closeToolModal = () => {
    modalState.value = {
      isOpen: false,
      tool: null
    }
  }

  const openToolDirectly = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return {
    isOpen,
    currentTool,
    openToolModal,
    closeToolModal,
    openToolDirectly
  }
}
