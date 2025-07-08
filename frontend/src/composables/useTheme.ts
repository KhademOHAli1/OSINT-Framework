import { watch, onMounted } from 'vue'
import { useAppStore } from '../stores/app'

export function useTheme() {
  const appStore = useAppStore()

  // Initialize theme on mount
  onMounted(() => {
    appStore.initializeDarkMode()
  })

  return {
    // Theme methods are handled by the store
  }
}
