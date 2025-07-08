<template>
  <section class="relative">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-48 sm:min-h-96">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-6"></div>
        <p class="text-gray-600 dark:text-gray-300 text-lg">Loading OSINT Framework...</p>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-48 sm:min-h-96">
      <div class="text-center bg-red-50 dark:bg-red-900/20 p-8 rounded-lg border border-red-200 dark:border-red-800">
        <div class="text-red-500 text-4xl mb-4">⚠️</div>
        <h3 class="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">Error Loading Framework</h3>
        <p class="text-red-600 dark:text-red-400 mb-6">{{ error }}</p>
        <button 
          @click="retryLoad" 
          class="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
    
    <!-- Tree Framework Container -->
    <div v-else-if="data" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
      <div ref="treeContainer" class="tree-content w-full"></div>
    </div>
    
    <!-- No Data State -->
    <div v-else class="flex items-center justify-center min-h-48 sm:min-h-96">
      <div class="text-center">
        <div class="text-gray-400 text-4xl mb-4">📭</div>
        <p class="text-gray-500 dark:text-gray-400 text-lg">No data available</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAppStore } from '../../stores/app'
import { useD3Tree } from '../../composables/useD3Tree'
import { useAppData } from '../../composables/useAppData'

const appStore = useAppStore()
const { retryLoad } = useAppData()
const treeContainer = ref<HTMLElement>()

const { initializeTree, renderTree, resizeTree } = useD3Tree()

const isLoading = computed(() => appStore.isLoading)
const error = computed(() => appStore.error)
const data = computed(() => appStore.filteredData)

// Handle window resize for responsive tree
const handleResize = () => {
  if (treeContainer.value) {
    resizeTree(treeContainer.value)
  }
}

onMounted(() => {
  if (treeContainer.value) {
    initializeTree(treeContainer.value)
    
    if (data.value) {
      renderTree(data.value, treeContainer.value)
    }
  }
  
  // Add resize listener
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // Clean up resize listener
  window.removeEventListener('resize', handleResize)
})

// Watch for data changes
watch(data, (newData) => {
  if (newData && treeContainer.value) {
    renderTree(newData, treeContainer.value)
  }
}, { immediate: false })

// Manual refresh function to avoid reactive loops
const refreshTree = () => {
  if (data.value && treeContainer.value) {
    renderTree(data.value, treeContainer.value)
  }
}

// Expose refresh for parent components
defineExpose({ refreshTree })
</script>

<style scoped>
.tree-content {
  width: 100%;
  height: auto;
  min-height: auto;
  padding: 2em;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  transition: background 0.3s ease;
  overflow: hidden;
}

@media (min-width: 375px) {
  .tree-content {
    padding: 2.5em;
  }
}

@media (min-width: 640px) {
  .tree-content {
    padding: 3em;
  }
}

@media (min-width: 1024px) {
  .tree-content {
    padding: 3.5em;
  }
}

@media (min-width: 1280px) {
  .tree-content {
    padding: 4em;
  }
}

.dark .tree-content {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
}

/* Ensure SVG fits tightly */
.tree-content svg {
  display: block;
  max-width: 100%;
  height: auto;
}
</style>
