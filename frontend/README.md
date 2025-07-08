# OSINT Framework Frontend

Modern Vue 3 + TypeScript frontend for the OSINT Framework.

## Architecture

### Components
- `App.vue` - Main application component
- `TreeContainer.vue` - D3 tree visualization wrapper
- `Header.vue` - Application header with navigation
- `Footer.vue` - Application footer

### Composables
- `useAppData.ts` - Data fetching and management
- `useD3Tree.ts` - D3 tree visualization logic

### Stores
- `app.ts` - Application state management with Pinia

### Core Files
- `d3-tree-renderer.ts` - D3.js tree rendering engine
- `types.ts` - TypeScript type definitions

## Development

### Mobile-First Approach
This application is built mobile-first with:
- Responsive breakpoints
- Touch-optimized interactions
- Dynamic content sizing
- No fixed height constraints
- Horizontal scrolling support

### Dark Mode
Full dark mode support with:
- System preference detection
- Manual toggle
- Persistent user preference
- High contrast optimization

### Performance
- Vite for fast development
- Tree-shaking for minimal bundles
- Dynamic imports for code splitting
- Optimized SVG rendering

## Building

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Styling

The project uses:
- **Tailwind CSS** for utility-first styling
- **Custom CSS** for D3 tree components
- **Em-based units** for accessibility
- **CSS custom properties** for theming

## Data Structure

The application expects OSINT data in the following format:

```typescript
interface OSINTNode {
  name: string;
  type: 'folder' | 'url';
  url?: string;
  children?: OSINTNode[];
}
```

Data is currently loaded from `src/data.json` but is structured to easily integrate with future API endpoints.

## Future Enhancements

- API integration for dynamic data
- Search and filtering
- User authentication
- Favorite tools
- Custom tool categories
- Export capabilities
