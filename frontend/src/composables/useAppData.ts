import { onMounted } from 'vue'
import { useAppStore } from '../stores/app'
import { useGraphQLData } from './useGraphQLData'
import type { TreeNode } from '../types'

export function useAppData() {
  const appStore = useAppStore()
  const { loadTreeData, isLoading, error } = useGraphQLData()

  const loadStaticData = async (): Promise<TreeNode> => {
    // Fallback to static JSON data
    const response = await fetch('/data.json')
    if (!response.ok) {
      throw new Error('Failed to load static data')
    }
    const data = await response.json()
    
    // Transform the static data to TreeNode format
    const transformData = (node: any, level = 0): TreeNode => {
      return {
        id: node.name || 'unknown',
        name: node.name,
        type: node.type === 'folder' ? 'folder' : 'url',
        url: node.url,
        description: node.description || '',
        level,
        children: node.children?.map((child: any) => transformData(child, level + 1))
      }
    }

    return transformData(data)
  }

  const loadData = async () => {
    try {
      appStore.setLoading(true)
      appStore.setError(null)
      
      // Try GraphQL first, fallback to static data
      let treeData: TreeNode
      try {
        treeData = await loadTreeData()
      } catch (graphqlError) {
        console.warn('GraphQL failed, falling back to static data:', graphqlError)
        treeData = await loadStaticData()
      }
      
      appStore.setData(treeData)
      
    } catch (error) {
      appStore.setError(error instanceof Error ? error.message : 'Failed to load data')
    } finally {
      appStore.setLoading(false)
    }
  }

  const retryLoad = () => {
    loadData()
  }

  // Auto-load data on mount
  onMounted(() => {
    if (!appStore.data) { // Only load if no data exists
      loadData()
    }
  })

  return {
    loadData,
    retryLoad,
    isLoading,
    error
  }
}
