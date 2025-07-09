import { ref, computed } from 'vue'
import type { TreeNode, Tool, Category } from '../types'

// GraphQL client configuration
const GRAPHQL_ENDPOINT = 'http://localhost:4000/api/graphql'

interface GraphQLResponse<T> {
  data?: T
  errors?: Array<{ message: string }>
}

interface CategoriesResponse {
  categories: Array<{
    id: string
    name: string
    slug: string
    description: string
    color: string
    icon: string
    parentCategory?: { id: string }
    subCategories: Array<{
      id: string
      name: string
      slug: string
    }>
    tools: Array<{
      id: string
      name: string
      slug: string
      description: string
      url: string
      type: string
      status: string
      isPaid: boolean
      requiresRegistration: boolean
      rating: number
      usageCount: number
      isFeatured: boolean
      isVerified: boolean
    }>
  }>
}

interface ToolResponse {
  tool: {
    id: string
    name: string
    slug: string
    description: string
    longDescription: any
    url: string
    alternativeUrls: string[]
    type: string
    status: string
    isPaid: boolean
    requiresRegistration: boolean
    supportedRegions: string[]
    rating: number
    usageCount: number
    lastChecked: string
    lastUpdated: string
    isFeatured: boolean
    isVerified: boolean
    categories: Array<{
      id: string
      name: string
      slug: string
    }>
    tags: Array<{
      id: string
      name: string
      slug: string
    }>
    reviews: Array<{
      id: string
      rating: number
      title: string
      content: string
      isVerified: boolean
      user: {
        name: string
      }
      createdAt: string
    }>
    metadata: any
  }
}

const graphqlQuery = async <T>(query: string, variables?: any): Promise<T> => {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const result: GraphQLResponse<T> = await response.json()
  
  if (result.errors?.length) {
    throw new Error(result.errors[0].message)
  }

  if (!result.data) {
    throw new Error('No data returned from GraphQL')
  }

  return result.data
}

export function useGraphQLData() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Query to get all categories and tools in a hierarchical structure
  const GET_TREE_DATA = `
    query GetTreeData {
      categories(where: { parentCategory: { equals: null } }) {
        id
        name
        slug
        description
        color
        icon
        subCategories {
          id
          name
          slug
          description
          color
          icon
          subCategories {
            id
            name
            slug
            description
            color
            icon
            tools {
              id
              name
              slug
              description
              url
              type
              status
              isPaid
              requiresRegistration
              rating
              usageCount
              isFeatured
              isVerified
            }
          }
          tools {
            id
            name
            slug
            description
            url
            type
            status
            isPaid
            requiresRegistration
            rating
            usageCount
            isFeatured
            isVerified
          }
        }
        tools {
          id
          name
          slug
          description
          url
          type
          status
          isPaid
          requiresRegistration
          rating
          usageCount
          isFeatured
          isVerified
        }
      }
    }
  `

  // Query to get detailed tool information
  const GET_TOOL_DETAILS = `
    query GetToolDetails($slug: String!) {
      tool(where: { slug: $slug }) {
        id
        name
        slug
        description
        longDescription
        url
        alternativeUrls
        type
        status
        isPaid
        requiresRegistration
        supportedRegions
        rating
        usageCount
        lastChecked
        lastUpdated
        isFeatured
        isVerified
        categories {
          id
          name
          slug
        }
        tags {
          id
          name
          slug
        }
        reviews(orderBy: { createdAt: desc }) {
          id
          rating
          title
          content
          isVerified
          user {
            name
          }
          createdAt
        }
        metadata
      }
    }
  `

  const loadTreeData = async (): Promise<TreeNode> => {
    try {
      isLoading.value = true
      error.value = null

      const response = await graphqlQuery<CategoriesResponse>(GET_TREE_DATA)
      
      // Transform the flat GraphQL response into a hierarchical tree structure
      const transformToTreeNode = (category: any, level = 0): TreeNode => {
        const tools = category.tools?.map((tool: any) => ({
          id: tool.id,
          name: tool.name,
          description: tool.description,
          url: tool.url,
          type: tool.type || 'website',
          status: tool.status || 'active',
          isPaid: tool.isPaid,
          requiresRegistration: tool.requiresRegistration,
          rating: tool.rating,
          usageCount: tool.usageCount,
          isFeatured: tool.isFeatured,
          isVerified: tool.isVerified,
        })) || []

        const children: TreeNode[] = []
        
        // Add subcategories
        if (category.subCategories) {
          children.push(...category.subCategories.map((sub: any) => 
            transformToTreeNode(sub, level + 1)
          ))
        }

        // Add tools as leaf nodes
        tools.forEach((tool: any) => {
          children.push({
            id: tool.id,
            name: tool.name,
            description: tool.description,
            url: tool.url,
            type: 'tool',
            level: level + 1,
            toolData: tool,
          })
        })

        return {
          id: category.id,
          name: category.name,
          description: category.description,
          type: 'category',
          level,
          children: children.length > 0 ? children : undefined,
          categoryData: {
            slug: category.slug,
            color: category.color,
            icon: category.icon,
          },
        }
      }

      // Create root node
      const rootNode: TreeNode = {
        id: 'root',
        name: 'OSINT Framework',
        description: 'Open Source Intelligence Tools and Resources',
        type: 'root',
        level: 0,
        children: response.categories.map(cat => transformToTreeNode(cat, 1)),
      }

      return rootNode

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load data'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const loadToolDetails = async (slug: string) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await graphqlQuery<ToolResponse>(GET_TOOL_DETAILS, { slug })
      return response.tool

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load tool details'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    loadTreeData,
    loadToolDetails,
  }
}
