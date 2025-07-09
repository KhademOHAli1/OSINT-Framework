<template>
  <Teleport to="body">
    <!-- Modal Backdrop -->
    <Transition
      name="modal-backdrop"
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isVisible"
        class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click="closeModal"
      >
        <!-- Modal Content -->
        <Transition
          name="modal-content"
          enter-active-class="transition-all duration-300"
          leave-active-class="transition-all duration-200"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="isVisible"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            @click.stop
          >
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <component :is="toolIcon" class="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                    {{ tool.name }}
                  </h2>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ toolTypeText }}
                  </p>
                </div>
              </div>
              
              <button
                @click="closeModal"
                class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Close"
              >
                <XMarkIcon class="w-6 h-6" />
              </button>
            </div>
            
            <!-- Content -->
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
              <!-- Quick Actions -->
              <div class="flex flex-wrap gap-3 mb-6">
                <button
                  v-if="tool.url"
                  @click="openTool"
                  class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <ExternalLinkIcon class="w-4 h-4 mr-2" />
                  Open Tool
                </button>
                
                <button
                  @click="copyUrl"
                  class="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  :disabled="!tool.url"
                >
                  <ClipboardDocumentIcon class="w-4 h-4 mr-2" />
                  Copy URL
                </button>
                
                <button
                  @click="shareTool"
                  class="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <ShareIcon class="w-4 h-4 mr-2" />
                  Share
                </button>
              </div>
              
              <!-- Status Section -->
              <div class="mb-6">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Status</h3>
                <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <StatusBadge 
                    :url="tool.url" 
                    :show-check-button="true"
                    @check="handleStatusCheck"
                  />
                  
                  <button
                    v-if="tool.url"
                    @click="checkToolStatus"
                    :disabled="isCheckingStatus"
                    class="inline-flex items-center px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
                  >
                    <ArrowPathIcon :class="['w-4 h-4 mr-1', isCheckingStatus ? 'animate-spin' : '']" />
                    {{ isCheckingStatus ? 'Checking...' : 'Refresh Status' }}
                  </button>
                </div>
              </div>
              
              <!-- URL Section -->
              <div v-if="tool.url" class="mb-6">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">URL</h3>
                <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <code class="text-sm font-mono text-gray-700 dark:text-gray-300 break-all">
                    {{ tool.url }}
                  </code>
                </div>
              </div>
              
              <!-- Description Section -->
              <div v-if="tool.description" class="mb-6">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {{ tool.description }}
                </p>
              </div>
              
              <!-- Tool Information -->
              <div class="mb-6">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Information</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium mb-1">
                      Type
                    </div>
                    <div class="font-medium text-gray-900 dark:text-white">
                      {{ toolTypeText }}
                    </div>
                  </div>
                  
                  <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium mb-1">
                      Access
                    </div>
                    <div class="font-medium text-gray-900 dark:text-white">
                      {{ accessibilityText }}
                    </div>
                  </div>
                  
                  <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium mb-1">
                      Category
                    </div>
                    <div class="font-medium text-gray-900 dark:text-white">
                      {{ categoryPath }}
                    </div>
                  </div>
                  
                  <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium mb-1">
                      Last Updated
                    </div>
                    <div class="font-medium text-gray-900 dark:text-white">
                      {{ lastUpdated }}
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Usage Tips -->
              <div v-if="usageTips.length > 0" class="mb-6">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Usage Tips</h3>
                <ul class="space-y-2">
                  <li
                    v-for="(tip, index) in usageTips"
                    :key="index"
                    class="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-300"
                  >
                    <LightBulbIcon class="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>{{ tip }}</span>
                  </li>
                </ul>
              </div>
              
              <!-- Related Tools -->
              <div v-if="relatedTools.length > 0" class="mb-6">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Related Tools</h3>
                <div class="grid grid-cols-1 gap-2">
                  <button
                    v-for="relatedTool in relatedTools"
                    :key="relatedTool.name"
                    @click="$emit('openTool', relatedTool)"
                    class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <div>
                      <div class="font-medium text-gray-900 dark:text-white">{{ relatedTool.name }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">{{ getToolType(relatedTool) }}</div>
                    </div>
                    <ChevronRightIcon class="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <div class="flex items-center space-x-3">
                <button
                  @click="toggleFavorite"
                  class="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  :class="isFavorite 
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
                >
                  <StarIcon :class="['w-4 h-4 mr-2', isFavorite ? 'fill-current' : '']" />
                  {{ isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
                </button>
              </div>
              
              <button
                @click="closeModal"
                class="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useToolStatus } from '@/composables/useToolStatus'
import StatusBadge from './StatusBadge.vue'
import type { TreeNode } from '@/types'
import {
  XMarkIcon,
  ExternalLinkIcon,
  ClipboardDocumentIcon,
  ShareIcon,
  ArrowPathIcon,
  LightBulbIcon,
  ChevronRightIcon,
  StarIcon,
  CommandLineIcon,
  DocumentIcon,
  GlobeAltIcon,
  CogIcon
} from '@heroicons/vue/24/outline'

interface Props {
  tool: TreeNode
  isVisible: boolean
  categoryPath?: string
  relatedTools?: TreeNode[]
}

const props = withDefaults(defineProps<Props>(), {
  categoryPath: 'Unknown',
  relatedTools: () => []
})

const emit = defineEmits<{
  close: []
  openTool: [tool: TreeNode]
  favorite: [tool: TreeNode, isFavorite: boolean]
  share: [tool: TreeNode]
}>()

const { checkUrlStatus } = useToolStatus()

// Local state
const isCheckingStatus = ref(false)
const isFavorite = ref(false)
const lastUpdated = ref('Recently')

// Computed properties
const toolTypeText = computed(() => {
  if (props.tool.type === 'url') {
    const name = props.tool.name.toLowerCase()
    if (name.includes('(t)')) return 'Tool/Software'
    if (name.includes('(d)')) return 'Document/Guide'
    if (name.includes('(r)')) return 'Restricted/Paid'
    if (name.includes('(m)')) return 'Manual Search'
    return 'Website/Service'
  }
  return 'Category'
})

const accessibilityText = computed(() => {
  const name = props.tool.name.toLowerCase()
  if (name.includes('(r)')) return 'Restricted/Paid'
  if (name.includes('(t)')) return 'Tool/Download Required'
  return 'Free/Open Access'
})

const toolIcon = computed(() => {
  if (props.tool.type === 'url') {
    const name = props.tool.name.toLowerCase()
    if (name.includes('(t)')) return CommandLineIcon
    if (name.includes('(d)')) return DocumentIcon
    return GlobeAltIcon
  }
  return CogIcon
})

const usageTips = computed(() => {
  const tips = []
  const name = props.tool.name.toLowerCase()
  
  if (name.includes('(t)')) {
    tips.push('This is a downloadable tool that may require installation.')
  }
  
  if (name.includes('(r)')) {
    tips.push('This service may require registration or payment for full access.')
  }
  
  if (name.includes('(m)')) {
    tips.push('Manual search required - use specific search operators or techniques.')
  }
  
  if (props.tool.url && props.tool.url.includes('github.com')) {
    tips.push('This is an open-source project hosted on GitHub.')
  }
  
  if (props.tool.url && props.tool.url.startsWith('https://')) {
    tips.push('This site uses secure HTTPS encryption.')
  }
  
  return tips
})

// Methods
const closeModal = () => {
  emit('close')
}

const openTool = () => {
  if (props.tool.url) {
    window.open(props.tool.url, '_blank', 'noopener,noreferrer')
    emit('openTool', props.tool)
  }
}

const copyUrl = async () => {
  if (props.tool.url) {
    try {
      await navigator.clipboard.writeText(props.tool.url)
    } catch (error) {
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

const shareTool = () => {
  emit('share', props.tool)
}

const handleStatusCheck = async (url: string) => {
  isCheckingStatus.value = true
  try {
    await checkUrlStatus(url)
  } finally {
    isCheckingStatus.value = false
  }
}

const checkToolStatus = async () => {
  if (props.tool.url) {
    await handleStatusCheck(props.tool.url)
  }
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  emit('favorite', props.tool, isFavorite.value)
}

const getToolType = (tool: TreeNode): string => {
  if (tool.type === 'url') {
    const name = tool.name.toLowerCase()
    if (name.includes('(t)')) return 'Tool'
    if (name.includes('(d)')) return 'Document'
    if (name.includes('(r)')) return 'Restricted'
    return 'Website'
  }
  return 'Category'
}
</script>

<style scoped>
/* Modal animations */
.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

.modal-content-enter-active {
  transition: all 0.3s ease;
}

.modal-content-leave-active {
  transition: all 0.2s ease;
}

.modal-content-enter-from,
.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(1rem);
}
</style>
