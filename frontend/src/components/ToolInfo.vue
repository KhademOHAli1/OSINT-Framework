<template>
  <div 
    class="tool-info-card bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    :class="{ 'hover:shadow-md': isInteractive }"
  >
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-start justify-between">
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {{ tool.name }}
          </h3>
          
          <!-- Tool Type Badge -->
          <div class="flex items-center mt-2 space-x-2">
            <span 
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
              :class="typeClasses"
            >
              <component :is="typeIcon" class="w-3 h-3 mr-1" />
              {{ toolTypeText }}
            </span>
            
            <!-- Status Badge -->
            <StatusBadge 
              :url="tool.url" 
              :compact="true"
              @check="handleStatusCheck"
            />
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex items-center space-x-2 ml-4">
          <button
            v-if="tool.url"
            @click="openTool"
            class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium
                   bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600
                   transition-colors"
            :title="`Open ${tool.name}`"
          >
            <ArrowTopRightOnSquareIcon class="w-4 h-4 mr-1" />
            Open
          </button>
          
          <button
            @click="copyUrl"
            class="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium
                   bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                   hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            :title="`Copy URL for ${tool.name}`"
            :disabled="!tool.url"
          >
            <ClipboardIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Content -->
    <div class="p-4">
      <!-- URL Display -->
      <div v-if="tool.url" class="mb-4">
        <div class="flex items-center space-x-2 text-sm">
          <LinkIcon class="w-4 h-4 text-gray-400" />
          <code class="flex-1 px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded text-xs font-mono truncate">
            {{ tool.url }}
          </code>
        </div>
      </div>
      
      <!-- Description -->
      <div v-if="tool.description" class="mb-4">
        <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {{ tool.description }}
        </p>
      </div>
      
      <!-- Tool Categories/Tags -->
      <div v-if="categories.length > 0" class="mb-4">
        <div class="flex flex-wrap gap-1">
          <span
            v-for="category in categories"
            :key="category"
            class="inline-block px-2 py-1 rounded-full text-xs font-medium
                   bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            {{ category }}
          </span>
        </div>
      </div>
      
      <!-- Metadata -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <!-- Tool Type -->
        <div class="flex items-center space-x-2">
          <InformationCircleIcon class="w-4 h-4 text-gray-400" />
          <span class="text-gray-600 dark:text-gray-400">Type:</span>
          <span class="font-medium">{{ toolTypeText }}</span>
        </div>
        
        <!-- Accessibility -->
        <div class="flex items-center space-x-2">
          <GlobeAltIcon class="w-4 h-4 text-gray-400" />
          <span class="text-gray-600 dark:text-gray-400">Access:</span>
          <span class="font-medium">{{ accessibilityText }}</span>
        </div>
      </div>
    </div>
    
    <!-- Footer Actions -->
    <div v-if="showActions" class="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <button
            @click="toggleFavorite"
            class="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium
                   transition-colors"
            :class="isFavorite 
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
            :title="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
          >
            <StarIcon :class="['w-4 h-4', isFavorite ? 'fill-current' : '']" />
          </button>
          
          <button
            @click="shareTool"
            class="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium
                   bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                   hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Share tool"
          >
            <ShareIcon class="w-4 h-4" />
          </button>
        </div>
        
        <div class="text-xs text-gray-500 dark:text-gray-400">
          Last updated: {{ lastUpdated }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useToolStatus } from '@/composables/useToolStatus'
import StatusBadge from './StatusBadge.vue'
import type { TreeNode } from '@/types'
import {
  ArrowTopRightOnSquareIcon,
  ClipboardIcon,
  LinkIcon,
  InformationCircleIcon,
  GlobeAltIcon,
  StarIcon,
  ShareIcon,
  CommandLineIcon,
  DocumentIcon,
  CogIcon
} from '@heroicons/vue/24/outline'

interface Props {
  tool: TreeNode
  categories?: string[]
  showActions?: boolean
  isInteractive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => [],
  showActions: true,
  isInteractive: true
})

const emit = defineEmits<{
  open: [tool: TreeNode]
  favorite: [tool: TreeNode, isFavorite: boolean]
  share: [tool: TreeNode]
}>()

const { checkUrlStatus } = useToolStatus()

// Local state
const isFavorite = ref(false)
const lastUpdated = ref('Unknown')

// Computed properties
const toolTypeText = computed(() => {
  if (props.tool.type === 'url') {
    // Determine if it's a tool, website, or document based on the name
    const name = props.tool.name.toLowerCase()
    if (name.includes('(t)')) return 'Tool/Software'
    if (name.includes('(d)')) return 'Document/Guide'
    if (name.includes('(r)')) return 'Restricted/Paid'
    if (name.includes('(m)')) return 'Manual Search'
    return 'Website/Service'
  }
  return 'Category'
})

const typeClasses = computed(() => {
  if (props.tool.type === 'url') {
    const name = props.tool.name.toLowerCase()
    if (name.includes('(t)')) return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200'
    if (name.includes('(d)')) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
    if (name.includes('(r)')) return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200'
    if (name.includes('(m)')) return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
    return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
  }
  return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200'
})

const typeIcon = computed(() => {
  if (props.tool.type === 'url') {
    const name = props.tool.name.toLowerCase()
    if (name.includes('(t)')) return CommandLineIcon
    if (name.includes('(d)')) return DocumentIcon
    return GlobeAltIcon
  }
  return CogIcon
})

const accessibilityText = computed(() => {
  const name = props.tool.name.toLowerCase()
  if (name.includes('(r)')) return 'Restricted/Paid'
  if (name.includes('(t)')) return 'Tool/Download'
  return 'Free/Open'
})

// Methods
const openTool = () => {
  if (props.tool.url) {
    window.open(props.tool.url, '_blank', 'noopener,noreferrer')
    emit('open', props.tool)
  }
}

const copyUrl = async () => {
  if (props.tool.url) {
    try {
      await navigator.clipboard.writeText(props.tool.url)
      // Could emit a toast notification here
    } catch (error) {
      console.warn('Failed to copy URL:', error)
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = props.tool.url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
  }
}

const handleStatusCheck = async (url: string) => {
  await checkUrlStatus(url)
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  emit('favorite', props.tool, isFavorite.value)
}

const shareTool = () => {
  emit('share', props.tool)
}
</script>

<style scoped>
.tool-info-card {
  transition: all 0.2s ease-in-out;
}

.tool-info-card:hover {
  transform: translateY(-1px);
}
</style>
