<template>
  <div class="flex items-center space-x-2">
    <!-- Status Badge -->
    <div
      v-if="displayStatus"
      :class="[
        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
        statusClasses
      ]"
      :title="statusTooltip"
    >
      <div
        :class="[
          'w-2 h-2 rounded-full mr-1',
          statusDotClasses
        ]"
      ></div>
      {{ statusText }}
    </div>

    <!-- Loading Indicator -->
    <div
      v-if="isChecking"
      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
      title="Checking status..."
    >
      <svg class="animate-spin -ml-0.5 mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Checking...
    </div>

    <!-- Check Button -->
    <button
      v-if="showCheckButton && !isChecking"
      @click="handleCheck"
      class="inline-flex items-center px-2 py-1 rounded text-xs font-medium
             bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300
             hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors
             border border-gray-300 dark:border-gray-600"
      title="Check tool status"
    >
      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
      </svg>
      Check
    </button>

    <!-- Last Checked Info -->
    <div
      v-if="lastChecked && !compact"
      class="text-xs text-gray-500 dark:text-gray-400"
      :title="`Last checked: ${lastCheckedDate.toLocaleString()}`"
    >
      {{ relativeTime }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToolStatus } from '@/composables/useToolStatus'
import type { ToolStatus } from '@/types'

interface Props {
  url?: string
  status?: ToolStatus | null
  showCheckButton?: boolean
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showCheckButton: true,
  compact: false
})

const emit = defineEmits<{
  check: [url: string]
}>()

const {
  getToolStatus,
  isCheckingUrl,
  getStatusBadgeColor,
  getStatusText
} = useToolStatus()

// Get current status
const currentStatus = computed(() => {
  if (props.status) return props.status
  if (props.url) return getToolStatus(props.url)
  return null
})

// Check if URL is being checked
const isChecking = computed(() => {
  return props.url ? isCheckingUrl(props.url) : false
})

// Display status (only show if we have a status or are checking)
const displayStatus = computed(() => {
  return currentStatus.value !== null
})

// Status styling
const statusClasses = computed(() => {
  const color = getStatusBadgeColor(currentStatus.value)
  const baseClasses = 'inline-flex items-center'
  
  switch (color) {
    case 'green':
      return `${baseClasses} bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200`
    case 'red':
      return `${baseClasses} bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200`
    case 'yellow':
      return `${baseClasses} bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200`
    default:
      return `${baseClasses} bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200`
  }
})

const statusDotClasses = computed(() => {
  const color = getStatusBadgeColor(currentStatus.value)
  
  switch (color) {
    case 'green':
      return 'bg-green-400 dark:bg-green-300'
    case 'red':
      return 'bg-red-400 dark:bg-red-300'
    case 'yellow':
      return 'bg-yellow-400 dark:bg-yellow-300'
    default:
      return 'bg-gray-400 dark:bg-gray-300'
  }
})

// Status text
const statusText = computed(() => {
  return getStatusText(currentStatus.value)
})

// Status tooltip
const statusTooltip = computed(() => {
  if (!currentStatus.value) return ''
  
  let tooltip = `Status: ${statusText.value}`
  
  if (currentStatus.value.lastChecked) {
    const date = new Date(currentStatus.value.lastChecked)
    tooltip += `\nLast checked: ${date.toLocaleString()}`
  }
  
  if (currentStatus.value.errorMessage) {
    tooltip += `\nError: ${currentStatus.value.errorMessage}`
  }
  
  return tooltip
})

// Last checked date
const lastChecked = computed(() => {
  return currentStatus.value?.lastChecked
})

const lastCheckedDate = computed(() => {
  return lastChecked.value ? new Date(lastChecked.value) : null
})

// Relative time display
const relativeTime = computed(() => {
  if (!lastCheckedDate.value) return ''
  
  const now = new Date()
  const diff = now.getTime() - lastCheckedDate.value.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) {
    return `${days}d ago`
  } else if (hours > 0) {
    return `${hours}h ago`
  } else if (minutes > 0) {
    return `${minutes}m ago`
  } else {
    return 'Just now'
  }
})

// Handle check button click
const handleCheck = () => {
  if (props.url) {
    emit('check', props.url)
  }
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
