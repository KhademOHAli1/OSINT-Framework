export interface TreeNode {
  name: string;
  type: 'folder' | 'url';
  url?: string;
  description?: string;
  children?: TreeNode[];
  highlighted?: boolean; // For search highlighting
  status?: ToolStatus; // For status monitoring
  lastChecked?: string; // ISO date string
  responseTime?: number; // in milliseconds
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
