# Contributing to OSINT Framework

We welcome contributions to the OSINT Framework! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- Modern web browser

### Setting Up the Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/OSINT-Framework.git
   cd OSINT-Framework
   ```

3. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** to `http://localhost:3000`

## 🏗️ Project Structure

```
OSINT-Framework/
├── frontend/           # Vue 3 + TypeScript frontend
│   ├── src/           # Source code
│   │   ├── components/ # Vue components
│   │   ├── composables/ # Vue composition functions
│   │   ├── stores/     # Pinia state management
│   │   └── styles/     # CSS files
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
├── docs/              # Documentation
├── package.json       # Root project scripts
└── README.md          # Main documentation
```

## 🎯 How to Contribute

### 1. Adding New OSINT Tools

To add new tools to the framework:

1. **Update the data file**: Edit `frontend/public/data.json`
2. **Follow the data structure**:
   ```json
   {
     "name": "Tool Name",
     "type": "url",
     "url": "https://example.com"
   }
   ```

3. **For categories**, use:
   ```json
   {
     "name": "Category Name", 
     "type": "folder",
     "children": [...]
   }
   ```

### 2. Frontend Development

- **Components**: Add new Vue components in `frontend/src/components/`
- **Styling**: Use Tailwind CSS classes for consistency
- **State**: Use Pinia stores for global state management
- **Types**: Add TypeScript interfaces in `frontend/src/types.ts`

### 3. Documentation

- Update relevant documentation files in `docs/`
- Keep the main `README.md` current
- Document any new features or breaking changes

## 📋 Development Guidelines

### Code Style

- **TypeScript**: Use strict typing, avoid `any`
- **Vue 3**: Use Composition API with `<script setup>`
- **CSS**: Prefer Tailwind utilities over custom CSS
- **Naming**: Use descriptive variable and function names
- **Comments**: Document complex logic and business rules

### Commit Guidelines

Use conventional commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Examples:
```bash
git commit -m "feat: add search functionality to tree view"
git commit -m "fix: resolve mobile viewport issues"
git commit -m "docs: update installation instructions"
```

### Testing Your Changes

1. **Manual Testing**:
   - Test on desktop and mobile
   - Verify dark/light mode functionality
   - Test tree expansion and navigation
   - Check all OSINT tool links work

2. **Build Testing**:
   ```bash
   npm run build
   npm run preview
   ```

## 🐛 Reporting Issues

### Bug Reports

Include:
- **Environment**: OS, browser, device type
- **Steps to reproduce**: Clear, step-by-step instructions
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable

### Feature Requests

Include:
- **Use case**: Why is this needed?
- **Description**: What should it do?
- **Examples**: Similar features in other tools
- **Implementation ideas**: Technical suggestions (optional)

## 🔄 Pull Request Process

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the guidelines above

3. **Test thoroughly** on different devices and browsers

4. **Commit your changes** with descriptive messages

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** with:
   - Clear title and description
   - Reference any related issues
   - Screenshots/GIFs for UI changes
   - Test results summary

### Review Process

- Maintainers will review your PR
- Address any feedback or requested changes
- Once approved, your PR will be merged

## 🏷️ Adding OSINT Tools Guidelines

### Quality Standards

Tools should be:
- **Legitimate**: Real, working OSINT tools
- **Accessible**: Publicly available (free or paid)
- **Relevant**: Used for open source intelligence gathering
- **Working**: Links should be functional

### Categories

Organize tools into appropriate categories:
- **Search Engines**: Google, Bing, specialized search
- **Social Media**: Platform-specific tools
- **Domain/IP**: DNS, WHOIS, network analysis
- **People**: People search, background checks
- **Images**: Reverse image search, metadata
- **Documents**: File analysis, metadata extraction
- **And more...**

### Data Format

```json
{
  "name": "Category Name",
  "type": "folder", 
  "children": [
    {
      "name": "Tool Name",
      "type": "url",
      "url": "https://tool-website.com"
    }
  ]
}
```

## 🚀 Release Process

Releases follow semantic versioning (semver):
- **Major** (1.0.0): Breaking changes
- **Minor** (0.1.0): New features, backward compatible
- **Patch** (0.0.1): Bug fixes, backward compatible

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Documentation**: Check `docs/` for detailed guides

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in the project's acknowledgments. Thank you for helping make OSINT research more accessible!
