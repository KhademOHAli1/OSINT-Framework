# Mobile Viewport Fixes & Project Restructure

## Mobile Issues Fixed

### Problem
- On mobile devices, when expanding nodes like "People Search Engine", child nodes were only half visible
- Fixed height constraints were cutting off content
- SVG viewBox wasn't properly adapting to expanded content on mobile

### Solution
1. **Removed Fixed Height Constraints**
   - Removed `min-height` restrictions from `.tree-container` and `.tree-svg` on mobile
   - Changed from `min-height: 500px` and `min-height: 400px` to `min-height: auto`

2. **Improved Viewport Handling**
   - Removed `max-height` constraints on mobile SVG elements
   - Changed from restrictive height limits to `max-height: none`
   - Added `overflow-x: auto` for horizontal scrolling when needed

3. **Enhanced D3 Renderer**
   - Removed artificial viewport width constraints on mobile
   - Eliminated `maxAllowedWidth` restrictions that were cutting off content
   - Simplified height calculations without depth-based multipliers
   - Removed `max-height` style constraints for mobile SVG elements

4. **Container Improvements**
   - Changed base container from `overflow: hidden` to `overflow: auto`
   - Reduced mobile padding to maximize content area
   - Ensured zoom controls stay above scrollable content with higher z-index

## Project Structure Reorganization

### New Structure
```
OSINT-Framework/
├── frontend/                 # Complete Vue 3 + TypeScript frontend
│   ├── src/                 # All source code
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.ts       # Build configuration
│   └── ...                  # All frontend configs
├── docs/                    # Project documentation
├── dist/                    # Built assets (generated)
├── package.json            # Root project scripts
└── README.md               # Project overview
```

### Benefits
1. **Clean Separation**: Frontend completely isolated for future backend integration
2. **CMS Ready**: Structure prepared for future CMS-based backend
3. **Scalable**: Clear boundaries between frontend and future backend concerns
4. **Maintainable**: Each part has its own dependencies and configuration

### Mobile Responsiveness
- **No content cutoff**: All expanded nodes fully visible
- **Horizontal scrolling**: Wide content can be scrolled horizontally
- **Adaptive sizing**: SVG and containers adapt to actual content size
- **Touch-friendly**: Proper spacing and sizing for mobile interactions

### Key Mobile Improvements
- Removed all artificial height limits that were cutting off expanded nodes
- Implemented content-driven sizing instead of fixed viewport constraints
- Added proper scrolling behavior for wide tree structures
- Maintained performance while ensuring full content visibility

The application now provides a seamless mobile experience where users can expand any node (like "People Search Engine") and see all child nodes without any visibility issues.
