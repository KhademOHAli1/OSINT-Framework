import { onMounted } from 'vue'
import { useAppStore } from '../stores/app'

export function useAppData() {
  const appStore = useAppStore()

  const loadData = async () => {
    try {
      appStore.setLoading(true)
      appStore.setError(null)
      
      const response = await fetch('/data.json')
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid data format received')
      }
      
      appStore.setData(data)
      
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
    retryLoad
  }
}
