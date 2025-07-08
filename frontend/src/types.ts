export interface TreeNode {
  name: string;
  type: 'folder' | 'url';
  url?: string;
  description?: string;
  children?: TreeNode[];
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

export type Theme = 'light' | 'dark';
