export interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'url' | 'category' | 'tool' | 'root';
  url?: string;
  description?: string;
  children?: TreeNode[];
  level?: number;
  highlighted?: boolean; // For search highlighting
  status?: ToolStatus; // For status monitoring
  lastChecked?: string; // ISO date string
  responseTime?: number; // in milliseconds
  toolData?: Tool; // Extended tool information
  categoryData?: Category; // Extended category information
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: any; // Rich content from Keystone
  url: string;
  alternativeUrls?: string[];
  type: string;
  status: string;
  isPaid: boolean;
  requiresRegistration: boolean;
  supportedRegions?: string[];
  rating?: number;
  usageCount?: number;
  lastChecked?: string;
  lastUpdated?: string;
  isFeatured: boolean;
  isVerified: boolean;
  categories?: Category[];
  tags?: Tag[];
  reviews?: Review[];
  metadata?: any;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color?: string;
  icon?: string;
  parentCategory?: Category;
  subCategories?: Category[];
  tools?: Tool[];
  sortOrder?: number;
  isActive: boolean;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string;
  color?: string;
  usageCount?: number;
}

export interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  isVerified: boolean;
  isHelpful?: number;
  user?: User;
  createdAt: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  role: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: any; // Rich content
  author?: User;
  category: string;
  relatedTools?: Tool[];
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ToolStatus {
  state: 'active' | 'inactive' | 'deprecated' | 'unknown';
  lastChecked?: string;
  responseTime?: number;
  errorMessage?: string;
}

// Alias for backward compatibility
export interface OSINTNode extends TreeNode {}

export interface AppState {
  searchTerm: string;
  expandedNodes: Set<string>;
  isDarkMode: boolean;
  filteredData: TreeNode | null;
}

export interface TreeState {
  expandedNodes: Set<string>;
  selectedNode: string | null;
  hoveredNode: string | null;
}

export interface SearchStats {
  totalResults: number;
  toolCount: number;
  categoryCount: number;
}

export type Theme = 'light' | 'dark';

export interface ToolGuide {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: any; // Rich content from Keystone
  type: string; // Guide type (tutorial, quickstart, advanced, etc.)
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: number; // in minutes
  prerequisites?: string[];
  tool?: Tool;
  author?: User;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
  tags?: Tag[];
  metadata?: any;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: any; // Rich content
  author?: User;
  category: string;
  relatedTools?: Tool[];
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
  tags?: Tag[];
  metadata?: any;
}

export interface LearningPath {
  id: string;
  name: string;
  slug: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration?: number; // in hours
  prerequisites?: string[];
  learningObjectives?: string[];
  creator?: User;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
  tools?: Tool[];
  guides?: ToolGuide[];
  articles?: Article[];
  tags?: Tag[];
  metadata?: any;
}

export interface MediaFile {
  id: string;
  filename: string;
  originalFilename: string;
  mimetype: string;
  encoding: string;
  url: string;
  size?: number;
  width?: number;
  height?: number;
  altText?: string;
  caption?: string;
  uploadedBy?: User;
  createdAt: string;
  metadata?: any;
}

export interface Contribution {
  id: string;
  title: string;
  description: string;
  type: 'tool_addition' | 'tool_update' | 'guide_creation' | 'bug_report' | 'feature_request';
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  content?: any; // Rich content
  attachments?: MediaFile[];
  contributor?: User;
  reviewedBy?: User;
  submittedAt: string;
  reviewedAt?: string;
  completedAt?: string;
  metadata?: any;
}
