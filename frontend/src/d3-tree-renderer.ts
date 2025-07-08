import * as d3 from 'd3';
import { OSINTNode } from './types';

interface TreeNode {
  name: string;
  type: 'folder' | 'url';
  url?: string;
  children?: TreeNode[];
  _children?: TreeNode[];
  x?: number;
  y?: number;
  x0?: number;
  y0?: number;
  id?: number;
  parent?: TreeNode;
  depth?: number;
}

export class D3TreeRenderer {
  private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>;
  private g: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>;
  private tree: d3.TreeLayout<TreeNode>;
  private root: TreeNode | null = null;
  private duration = 750;
  private nodeId = 0;
  private expandedNodeNames = new Set<string>(); // Track expanded nodes by name
  private savedExpansionState = new Set<string>(); // Save state before search

  private width: number;
  private height: number;
  private margin = { top: 60, right: 180, bottom: 60, left: 180 };

  constructor(container: HTMLElement) {
    // Start with initial dimensions
    this.width = 1200 - this.margin.left - this.margin.right;
    this.height = 800 - this.margin.top - this.margin.bottom;

    // Clear container
    container.innerHTML = '';

    // Create SVG with responsive sizing
    this.svg = d3.select(container)
      .append('svg')
      .style('overflow', 'hidden')
      .style('width', '100%')
      .style('height', 'auto')
      .style('max-width', '100%')
      .style('display', 'block') as unknown as d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>;

    this.g = this.svg.append('g');

    // Create tree layout with initial size
    this.tree = d3.tree<TreeNode>()
      .size([800, 1000]) // Initial size that will be updated dynamically
      .separation((a, b) => (a.parent === b.parent ? 1 : 2));
  }

  public render(data: OSINTNode): void {
    // Convert OSINTNode to TreeNode
    this.root = this.convertToTreeNode(data);
    this.root.x0 = this.height / 2;
    this.root.y0 = 0;

    // If this is the first render and no expansion state exists, set default state
    if (this.expandedNodeNames.size === 0) {
      // Root is expanded by default to show the main categories
      this.expandedNodeNames.add(this.root.name);
    }

    // Apply the saved expansion state (this will handle proper expansion)
    this.applyExpansionState(this.root);

    this.update(this.root);
  }

  private convertToTreeNode(node: OSINTNode): TreeNode {
    const treeNode: TreeNode = {
      name: node.name,
      type: node.type,
      url: node.url,
      id: ++this.nodeId
    };

    if (node.children) {
      treeNode.children = node.children.map(child => this.convertToTreeNode(child));
    }

    return treeNode;
  }

  private collapse = (d: TreeNode): void => {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(this.collapse);
      d.children = undefined;
    }
  };

  private collapseAll = (d: TreeNode): void => {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(this.collapseAll);
      d.children = undefined;
    }
  };

  private click = (_event: MouseEvent, d: TreeNode): void => {
    if (d.children) {
      // Collapsing - remove from expanded set and hide children
      this.expandedNodeNames.delete(d.name);
      d._children = d.children;
      d.children = undefined;
    } else if (d._children) {
      // Expanding - add to expanded set and show immediate children only
      this.expandedNodeNames.add(d.name);
      d.children = d._children;
      d._children = undefined;
      
      // Ensure all children are collapsed (layer-by-layer expansion)
      if (d.children) {
        d.children.forEach(child => {
          if (child.children && !this.expandedNodeNames.has(child.name)) {
            child._children = child.children;
            child.children = undefined;
          }
        });
      }
    }
    this.update(d);
  };

  private update(source: TreeNode): void {
    if (!this.root) {
      return;
    }

    // Adjust margins based on viewport size (much larger values for maximum readability)
    const isMobile = window.innerWidth <= 768;
    const baseFontSize = 16; // Assume 16px base font size
    const dynamicMargin = isMobile 
      ? { top: 4 * baseFontSize, right: 8 * baseFontSize, bottom: 4 * baseFontSize, left: 8 * baseFontSize }
      : { top: 8 * baseFontSize, right: 16 * baseFontSize, bottom: 8 * baseFontSize, left: 16 * baseFontSize };

    // Create hierarchy from root
    const hierarchyRoot = d3.hierarchy(this.root, d => d.children);
    
    // Compute the new tree layout
    const treeData = this.tree(hierarchyRoot);
    const nodes = treeData.descendants();
    const links = treeData.descendants().slice(1);

    // Calculate bounds of the tree
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    // Calculate maximum depth for dynamic scaling
    const maxDepth = Math.max(...nodes.map(d => d.depth));
    
    // Dynamic spacing based on tree depth - shrink as depth increases
    const baseDepthSpacing = isMobile ? 14 * baseFontSize : 18 * baseFontSize;
    const depthScaleFactor = Math.max(0.4, 1 / Math.max(1, maxDepth * 0.3)); // Scale down for deeper trees
    const depthSpacing = baseDepthSpacing * depthScaleFactor;
    
    nodes.forEach(d => {
      d.y = d.depth * depthSpacing;
      minX = Math.min(minX, d.x);
      maxX = Math.max(maxX, d.x);
      minY = Math.min(minY, d.y);
      maxY = Math.max(maxY, d.y);
    });

    // Ensure we have reasonable bounds (much larger fallbacks)
    if (!isFinite(minX)) minX = 0;
    if (!isFinite(maxX)) maxX = isMobile ? 20 * baseFontSize : 36 * baseFontSize; // Increased from 16/30em
    if (!isFinite(minY)) minY = 0;
    if (!isFinite(maxY)) maxY = isMobile ? 32 * baseFontSize : 54 * baseFontSize; // Increased from 24/45em

    // Calculate required dimensions with mobile-first approach
    const treeContentWidth = maxY - minY;
    const treeContentHeight = maxX - minX;
    
    // For mobile, ensure we have enough space for all content without artificial constraints
    const containerElement = this.svg.node()?.parentElement;
    const containerWidth = containerElement?.clientWidth || 1200;
    
    const svgWidth = isMobile 
      ? Math.max(treeContentWidth + dynamicMargin.left + dynamicMargin.right, 32 * baseFontSize)
      : containerWidth;
    
    // For mobile, calculate height based on actual content needs without max constraints
    const baseHeightMultiplier = isMobile ? 4 : 8;
    const depthAdjustedPadding = baseHeightMultiplier * baseFontSize;
    const minContentHeight = isMobile ? 20 * baseFontSize : 28 * baseFontSize;
    const actualContentHeight = Math.max(treeContentHeight, minContentHeight);
    const svgHeight = actualContentHeight + depthAdjustedPadding;

    // Update SVG dimensions - remove max-height constraints on mobile for full content visibility
    this.svg
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
      .style('width', '100%')
      .style('height', 'auto')
      .style('max-height', isMobile ? 'none' : (54 * 1.8) + 'em') // Remove mobile height limits
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // Position tree from the left with proper margins
    const offsetX = dynamicMargin.left - minY;
    const offsetY = dynamicMargin.top - minX;
    
    this.g.attr('transform', `translate(${offsetX},${offsetY})`);

    // Update tree layout size with much larger dimensions
    const treeWidth = isMobile 
      ? Math.max(maxY - minY, 32 * baseFontSize) // Increased from 24em
      : Math.max(maxY - minY, 54 * baseFontSize); // Increased from 45em
    const treeHeight = isMobile 
      ? Math.max(maxX - minX, 20 * baseFontSize) // Increased from 16em
      : Math.max(maxX - minX, 36 * baseFontSize); // Increased from 30em
    this.tree.size([treeHeight, treeWidth]);

    // Update nodes
    const node = this.g.selectAll('g.node')
      .data(nodes, (d: any) => d.data.id);

    // Enter new nodes at parent's previous position
    const nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr('transform', `translate(${source.y0},${source.x0})`)
      .on('click', (event: MouseEvent, d: any) => this.click(event, d.data))
      .style('cursor', 'pointer');

    // Add simple, clean circles for nodes with dynamic sizing
    nodeEnter.append('circle')
      .attr('class', 'node-circle')
      .attr('r', 1e-6)
      .style('fill', (d: any) => {
        const isDark = document.documentElement.classList.contains('dark');
        if (d.data.type === 'url') {
          return isDark ? '#d8b4fe' : '#8b5cf6'; // Much brighter purple for dark mode
        } else if (d.data._children) {
          return isDark ? '#93c5fd' : '#2563eb'; // Much brighter blue for dark mode
        }
        return isDark ? '#e5e7eb' : '#6b7280'; // Much brighter gray for better visibility
      })
      .style('stroke', (d: any) => {
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
          // Much more visible strokes in dark mode
          if (d.data.type === 'url') return '#c084fc';
          if (d.data._children) return '#60a5fa';
          return '#d1d5db';
        } else {
          return 'rgba(0, 0, 0, 0.1)';
        }
      })
      .style('stroke-width', (d: any) => {
        // Dynamic stroke width based on depth
        const depthScale = Math.max(0.5, 1 - (d.depth * 0.1));
        const isDark = document.documentElement.classList.contains('dark');
        const baseWidth = isDark ? 0.25 : 0.1875; // Thicker strokes in dark mode
        return (baseWidth * depthScale) + 'em';
      })
      .style('cursor', 'pointer');

    // Add clean labels with dynamic sizing
    nodeEnter.append('text')
      .attr('class', 'node-label')
      .attr('dy', '.35em')
      .attr('x', (d: any) => {
        // Dynamic text offset based on circle size and depth
        const depthScale = Math.max(0.6, 1 - (d.depth * 0.1));
        const baseOffset = isMobile ? 14 : 16;
        const scaledOffset = baseOffset * depthScale;
        return d.data.children || d.data._children ? -scaledOffset : scaledOffset;
      })
      .attr('text-anchor', (d: any) => d.data.children || d.data._children ? 'end' : 'start')
      .text((d: any) => d.data.name)
      .style('fill', this.getColor('#374151', '#ffffff')) // Pure white text for dark mode
      .style('font-size', (d: any) => {
        // Dynamic font size based on depth
        const depthScale = Math.max(0.7, 1 - (d.depth * 0.08));
        const baseFontSize = isMobile ? 1.125 : 1.25;
        return (baseFontSize * depthScale) + 'em';
      })
      .style('font-family', '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif')
      .style('font-weight', (d: any) => {
        // Slightly lighter weight for deeper nodes
        return d.depth > 2 ? '400' : '500';
      })
      .style('fill-opacity', 1e-6)
      .style('cursor', 'pointer');

    // Style URL nodes differently
    nodeEnter.filter((d: any) => d.data.type === 'url')
      .select('.node-label')
      .style('fill', this.getColor('#8b5cf6', '#e9d5ff')) // Much brighter purple for dark mode
      .style('font-weight', '500')
      .on('click', (event: MouseEvent, d: any) => {
        event.stopPropagation();
        if (d.data.url) {
          window.open(d.data.url, '_blank', 'noopener,noreferrer');
        }
      });

    // Transition nodes to their new position
    const nodeUpdate = nodeEnter.merge(node as any);

    nodeUpdate.transition()
      .duration(this.duration)
      .attr('transform', (d: any) => `translate(${d.y},${d.x})`);

    // Update circles with dynamic sizing based on depth
    nodeUpdate.select('.node-circle')
      .transition()
      .duration(this.duration)
      .attr('r', (d: any) => {
        // Dynamic circle radius based on depth
        const depthScale = Math.max(0.5, 1 - (d.depth * 0.1));
        const baseRadius = isMobile ? 8 : 10;
        return baseRadius * depthScale;
      })
      .style('opacity', 1);

    // Update text
    nodeUpdate.select('.node-label')
      .transition()
      .duration(this.duration)
      .style('fill-opacity', 1);

    // Remove exiting nodes
    const nodeExit = node.exit().transition()
      .duration(this.duration)
      .attr('transform', `translate(${source.y},${source.x})`)
      .remove();

    nodeExit.select('.node-circle')
      .attr('r', 1e-6);

    nodeExit.select('.node-label')
      .style('fill-opacity', 1e-6);

    // Update links with clean styling
    const link = this.g.selectAll('path.link')
      .data(links, (d: any) => d.data.id);

    // Enter new links at parent's previous position with dynamic stroke width
    const linkEnter = link.enter().insert('path', 'g')
      .attr('class', 'link')
      .attr('d', () => {
        const o = { x: source.x0 || 0, y: source.y0 || 0 };
        return this.diagonal(o, o);
      })
      .style('fill', 'none')
      .style('stroke', this.getColor('#e5e7eb', '#9ca3af')) // Brighter stroke for dark mode
      .style('stroke-width', (d: any) => {
        // Dynamic stroke width based on target node depth
        const depthScale = Math.max(0.4, 1 - (d.depth * 0.1));
        return (0.1875 * depthScale) + 'em';
      })
      .style('opacity', 0.7);

    // Transition links to their new position
    const linkUpdate = linkEnter.merge(link as any);

    linkUpdate.transition()
      .duration(this.duration)
      .attr('d', (d: any) => this.diagonal(d, d.parent));

    // Remove exiting links
    link.exit().transition()
      .duration(this.duration)
      .attr('d', () => {
        const o = { x: source.x || 0, y: source.y || 0 };
        return this.diagonal(o, o);
      })
      .remove();

    // Store the old positions for transition
    nodes.forEach((d: any) => {
      d.data.x0 = d.x;
      d.data.y0 = d.y;
    });
  }

  private diagonal(s: { x: number; y: number }, d: { x: number; y: number }): string {
    return `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`;
  }

  public resize(): void {
    // The SVG now auto-sizes based on content, so just trigger an update
    if (this.root) {
      this.update(this.root);
    }
  }

  private applyExpansionState(node: TreeNode): void {
    // Always ensure we have the full children available first
    const allChildren = node.children || node._children;
    
    if (allChildren && allChildren.length > 0) {
      if (this.expandedNodeNames.has(node.name)) {
        // This node should be expanded - show its immediate children
        node.children = allChildren;
        node._children = undefined;
        
        // For each child, recursively apply their expansion state
        node.children.forEach(child => {
          this.applyExpansionState(child);
        });
      } else {
        // This node should be collapsed
        node._children = allChildren;
        node.children = undefined;
      }
    }
  }

  public saveCurrentExpansionState(): void {
    this.savedExpansionState = new Set(this.expandedNodeNames);
  }

  public restoreExpansionState(): void {
    this.expandedNodeNames = new Set(this.savedExpansionState);
  }

  public clearSavedState(): void {
    this.savedExpansionState.clear();
  }

  private saveExpansionState(node: TreeNode): void {
    if (node.children) {
      // This node is expanded
      this.expandedNodeNames.add(node.name);
      node.children.forEach(child => this.saveExpansionState(child));
    } else if (node._children) {
      // This node is collapsed, remove from expanded set
      this.expandedNodeNames.delete(node.name);
    }
  }

  public clearExpansionState(): void {
    this.expandedNodeNames.clear();
  }

  public resetToDefaultState(): void {
    this.expandedNodeNames.clear();
    if (this.root) {
      this.expandedNodeNames.add(this.root.name);
      this.render(this.convertTreeNodeToOSINT(this.root));
    }
  }

  private convertTreeNodeToOSINT(node: TreeNode): OSINTNode {
    const osintNode: OSINTNode = {
      name: node.name,
      type: node.type,
      url: node.url
    };

    // Get children from either expanded or collapsed state
    const children = node.children || node._children;
    if (children) {
      osintNode.children = children.map(child => this.convertTreeNodeToOSINT(child));
    }

    return osintNode;
  }

  public expandNode(nodeName: string): void {
    this.expandedNodeNames.add(nodeName);
  }

  public collapseNode(nodeName: string): void {
    this.expandedNodeNames.delete(nodeName);
  }

  private getColor(lightColor: string, darkColor: string): string {
    const isDark = document.documentElement.classList.contains('dark');
    return isDark ? darkColor : lightColor;
  }

  public refreshColors(): void {
    // Update link colors
    this.svg.selectAll('.link')
      .style('stroke', this.getColor('#e5e7eb', '#9ca3af')); // Brighter stroke for dark mode

    // Update node circle colors
    this.svg.selectAll('.node-circle')
      .style('fill', (d: any) => {
        const isDark = document.documentElement.classList.contains('dark');
        if (d.data.type === 'url') {
          return isDark ? '#d8b4fe' : '#8b5cf6'; // Much brighter purple
        } else if (d.data._children) {
          return isDark ? '#93c5fd' : '#2563eb'; // Much brighter blue
        }
        return isDark ? '#e5e7eb' : '#9ca3af'; // Much brighter gray
      })
      .style('stroke', (d: any) => {
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
          // Much more visible strokes in dark mode
          if (d.data.type === 'url') return '#c084fc';
          if (d.data._children) return '#60a5fa';
          return '#d1d5db';
        } else {
          return 'rgba(0, 0, 0, 0.1)';
        }
      });

    // Update text colors
    this.svg.selectAll('.node-label')
      .style('fill', (d: any) => {
        if (d.data.type === 'url') {
          return this.getColor('#8b5cf6', '#e9d5ff'); // Much brighter purple for dark mode
        }
        return this.getColor('#374151', '#ffffff'); // Pure white for dark mode
      });
  }
}
