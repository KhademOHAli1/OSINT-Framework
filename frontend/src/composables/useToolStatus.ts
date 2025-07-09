import { ref, computed } from 'vue'
import type { TreeNode, ToolStatus } from '@/types'

export function useToolStatus() {
  const statusCache = ref<Map<string, ToolStatus>>(new Map())
  const checkingUrls = ref<Set<string>>(new Set())

  // Load status from localStorage
  const loadStatusCache = () => {
    try {
      const stored = localStorage.getItem('osint-tool-status')
      if (stored) {
        const data = JSON.parse(stored)
        statusCache.value = new Map(Object.entries(data))
      }
    } catch (error) {
      console.warn('Failed to load tool status cache:', error)
    }
  }

  // Save status to localStorage
  const saveStatusCache = () => {
    try {
      const data = Object.fromEntries(statusCache.value)
      localStorage.setItem('osint-tool-status', JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save tool status cache:', error)
    }
  }

  // Get status for a specific URL
  const getToolStatus = (url: string): ToolStatus | null => {
    return statusCache.value.get(url) || null
  }

  // Check if a URL is currently being checked
  const isCheckingUrl = (url: string): boolean => {
    return checkingUrls.value.has(url)
  }

  // Basic URL validation and availability check
  const checkUrlStatus = async (url: string): Promise<ToolStatus> => {
    if (checkingUrls.value.has(url)) {
      return getToolStatus(url) || { state: 'unknown' }
    }

    checkingUrls.value.add(url)
    const startTime = Date.now()

    try {
      // For demo purposes, we'll simulate checking
      // In a real implementation, this would use a backend service
      // to avoid CORS issues
      
      const status: ToolStatus = {
        state: 'active',
        lastChecked: new Date().toISOString(),
        responseTime: Date.now() - startTime
      }

      // Simulate different response times and statuses
      const randomDelay = Math.random() * 2000 + 500
      await new Promise(resolve => setTimeout(resolve, randomDelay))

      // Simulate some tools being offline (10% chance)
      if (Math.random() < 0.1) {
        status.state = 'inactive'
        status.errorMessage = 'Connection timeout'
      } else {
        status.responseTime = randomDelay
      }

      statusCache.value.set(url, status)
      saveStatusCache()
      
      return status
    } catch (error) {
      const status: ToolStatus = {
        state: 'inactive',
        lastChecked: new Date().toISOString(),
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      }
      
      statusCache.value.set(url, status)
      saveStatusCache()
      
      return status
    } finally {
      checkingUrls.value.delete(url)
    }
  }

  // Check multiple URLs in batch
  const checkMultipleUrls = async (urls: string[], maxConcurrent = 5): Promise<void> => {
    const chunks: string[][] = []
    for (let i = 0; i < urls.length; i += maxConcurrent) {
      chunks.push(urls.slice(i, i + maxConcurrent))
    }

    for (const chunk of chunks) {
      await Promise.allSettled(
        chunk.map((url: string) => checkUrlStatus(url))
      )
    }
  }

  // Extract all URLs from tree data
  const extractUrlsFromTree = (node: TreeNode): string[] => {
    const urls: string[] = []
    
    if (node.type === 'url' && node.url) {
      urls.push(node.url)
    }
    
    if (node.children) {
      for (const child of node.children) {
        urls.push(...extractUrlsFromTree(child))
      }
    }
    
    return urls
  }

  // Get status statistics
  const getStatusStats = computed(() => {
    const stats = {
      total: statusCache.value.size,
      active: 0,
      inactive: 0,
      deprecated: 0,
      unknown: 0,
      lastUpdated: null as string | null
    }

    let mostRecent = 0
    for (const [, status] of statusCache.value) {
      stats[status.state]++
      
      if (status.lastChecked) {
        const checkTime = new Date(status.lastChecked).getTime()
        if (checkTime > mostRecent) {
          mostRecent = checkTime
          stats.lastUpdated = status.lastChecked
        }
      }
    }

    return stats
  })

  // Clear old status entries (older than 24 hours)
  const clearOldStatus = () => {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000)
    
    for (const [url, status] of statusCache.value) {
      if (status.lastChecked) {
        const checkTime = new Date(status.lastChecked).getTime()
        if (checkTime < oneDayAgo) {
          statusCache.value.delete(url)
        }
      }
    }
    
    saveStatusCache()
  }

  // Get status badge color
  const getStatusBadgeColor = (status: ToolStatus | null): string => {
    if (!status) return 'gray'
    
    switch (status.state) {
      case 'active':
        return 'green'
      case 'inactive':
        return 'red'
      case 'deprecated':
        return 'yellow'
      default:
        return 'gray'
    }
  }

  // Get status display text
  const getStatusText = (status: ToolStatus | null): string => {
    if (!status) return 'Unknown'
    
    switch (status.state) {
      case 'active':
        return status.responseTime ? `Active (${status.responseTime}ms)` : 'Active'
      case 'inactive':
        return 'Offline'
      case 'deprecated':
        return 'Deprecated'
      default:
        return 'Unknown'
    }
  }

  // Initialize
  loadStatusCache()

  return {
    statusCache,
    checkingUrls,
    getToolStatus,
    isCheckingUrl,
    checkUrlStatus,
    checkMultipleUrls,
    extractUrlsFromTree,
    getStatusStats,
    clearOldStatus,
    getStatusBadgeColor,
    getStatusText,
    loadStatusCache,
    saveStatusCache
  }
}
