import { ref } from 'vue'
import type { TreeNode, OSINTNode } from '../types'
import { D3TreeRenderer, type ToolClickEvent } from '../d3-tree-renderer'

export function useD3Tree(onToolClick?: (data: ToolClickEvent) => void) {
  const renderer = ref<D3TreeRenderer | null>(null)

  const initializeTree = (container: HTMLElement) => {
    try {
      renderer.value = new D3TreeRenderer(container, onToolClick)
    } catch (error) {
      console.error('Failed to create D3TreeRenderer:', error)
    }
  }

  const renderTree = (data: TreeNode, container: HTMLElement) => {
    try {
      if (!renderer.value) {
        initializeTree(container)
      }
      
      if (renderer.value && data) {
        // TreeNode and OSINTNode are compatible, just cast it
        renderer.value.render(data as OSINTNode)
      }
    } catch (error) {
      console.error('Failed to render tree:', error)
    }
  }

  const resizeTree = (container: HTMLElement) => {
    try {
      if (renderer.value) {
        renderer.value.resize()
      }
    } catch (error) {
      console.error('❌ Failed to resize tree:', error)
    }
  }

  return {
    initializeTree,
    renderTree,
    resizeTree
  }
}
