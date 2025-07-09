import { onMounted } from 'vue'
import { useAppStore } from '../stores/app'
import { useGraphQLData } from './useGraphQLData'

export function useAppData() {
  const appStore = useAppStore()
  const { loadTreeData, isLoading, error } = useGraphQLData()

  const loadData = async () => {
    try {
      appStore.setLoading(true)
      appStore.setError(null)
      
      const treeData = await loadTreeData()
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
