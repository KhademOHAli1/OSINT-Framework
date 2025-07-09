import { ref, computed } from 'vue'
import type { Tool, ToolGuide, Review } from '../types'
import { useGraphQLData } from './useGraphQLData'

export function useEnhancedToolModal() {
  const isVisible = ref(false)
  const currentTool = ref<Tool | null>(null)
  const currentGuides = ref<ToolGuide[]>([])
  const currentReviews = ref<Review[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const activeTab = ref<'overview' | 'guides' | 'reviews' | 'contribute'>('overview')

  const { loadToolDetails } = useGraphQLData()

  // Get tool guides query
  const GET_TOOL_GUIDES = `
    query GetToolGuides($toolId: ID!) {
      toolGuides(where: { tool: { id: { equals: $toolId } }, isPublished: { equals: true } }) {
        id
        title
        type
        content
        author {
          name
        }
        prerequisites
        learningObjectives
        difficultyLevel
        estimatedTime
        viewCount
        helpfulCount
        createdAt
      }
    }
  `

  // Get tool reviews query
  const GET_TOOL_REVIEWS = `
    query GetToolReviews($toolId: ID!) {
      reviews(where: { tool: { id: { equals: $toolId } } }, orderBy: { createdAt: desc }) {
        id
        rating
        title
        content
        isVerified
        isHelpful
        user {
          name
        }
        createdAt
        updatedAt
      }
    }
  `

  const averageRating = computed(() => {
    if (!currentReviews.value.length) return 0
    const sum = currentReviews.value.reduce((acc, review) => acc + review.rating, 0)
    return sum / currentReviews.value.length / 10 // Convert to 5-star scale
  })

  const ratingDistribution = computed(() => {
    if (!currentReviews.value.length) return [0, 0, 0, 0, 0]
    
    const distribution = [0, 0, 0, 0, 0]
    currentReviews.value.forEach(review => {
      const starRating = Math.ceil(review.rating / 10) - 1 // Convert to 0-4 index
      if (starRating >= 0 && starRating < 5) {
        distribution[starRating]++
      }
    })
    return distribution
  })

  const guidesByType = computed(() => {
    const grouped: Record<string, ToolGuide[]> = {}
    currentGuides.value.forEach(guide => {
      if (!grouped[guide.type]) {
        grouped[guide.type] = []
      }
      grouped[guide.type].push(guide)
    })
    return grouped
  })

  const openModal = async (tool: Tool) => {
    try {
      isVisible.value = true
      currentTool.value = tool
      activeTab.value = 'overview'
      isLoading.value = true
      error.value = null

      // Load detailed tool information
      const detailedTool = await loadToolDetails(tool.slug)
      currentTool.value = detailedTool

      // Load guides and reviews in parallel
      await Promise.all([
        loadToolGuides(tool.id),
        loadToolReviews(tool.id)
      ])

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load tool details'
    } finally {
      isLoading.value = false
    }
  }

  const closeModal = () => {
    isVisible.value = false
    currentTool.value = null
    currentGuides.value = []
    currentReviews.value = []
    error.value = null
    activeTab.value = 'overview'
  }

  const setActiveTab = (tab: typeof activeTab.value) => {
    activeTab.value = tab
  }

  const loadToolGuides = async (toolId: string) => {
    try {
      // Implementation would use GraphQL client
      // For now, mock the data structure
      currentGuides.value = []
    } catch (err) {
      console.error('Failed to load tool guides:', err)
    }
  }

  const loadToolReviews = async (toolId: string) => {
    try {
      // Implementation would use GraphQL client
      // For now, mock the data structure
      currentReviews.value = []
    } catch (err) {
      console.error('Failed to load tool reviews:', err)
    }
  }

  const submitReview = async (reviewData: {
    rating: number
    title: string
    content: string
  }) => {
    try {
      // Implementation would use GraphQL mutation
      console.log('Submitting review:', reviewData)
      // Reload reviews after submission
      if (currentTool.value) {
        await loadToolReviews(currentTool.value.id)
      }
    } catch (err) {
      console.error('Failed to submit review:', err)
      throw err
    }
  }

  const reportIssue = async (issueData: {
    type: string
    description: string
  }) => {
    try {
      // Implementation would use GraphQL mutation to create Contribution
      console.log('Reporting issue:', issueData)
    } catch (err) {
      console.error('Failed to report issue:', err)
      throw err
    }
  }

  const suggestUpdate = async (updateData: {
    field: string
    currentValue: string
    suggestedValue: string
    reason: string
  }) => {
    try {
      // Implementation would use GraphQL mutation
      console.log('Suggesting update:', updateData)
    } catch (err) {
      console.error('Failed to suggest update:', err)
      throw err
    }
  }

  return {
    // State
    isVisible: computed(() => isVisible.value),
    currentTool: computed(() => currentTool.value),
    currentGuides: computed(() => currentGuides.value),
    currentReviews: computed(() => currentReviews.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    activeTab: computed(() => activeTab.value),
    
    // Computed
    averageRating,
    ratingDistribution,
    guidesByType,
    
    // Actions
    openModal,
    closeModal,
    setActiveTab,
    submitReview,
    reportIssue,
    suggestUpdate,
  }
}
