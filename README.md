# OSINT Framework

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/KhademOHAli1/OSINT-Framework.svg)](https://github.com/KhademOHAli1/OSINT-Framework/stargazers)

A comprehensive Open Source Intelligence (OSINT) framework built with modern web technologies.

🔗 **Live Demo**: [https://khademohali1.github.io/OSINT-Framework](https://khademohali1.github.io/OSINT-Framework)

## ✨ Features

- 🌳 **Interactive D3 Tree Visualization** - Navigate OSINT tools with an intuitive tree interface
- 🌙 **Dark/Light Mode** - Automatic system detection with manual toggle
- 📱 **Mobile-First Design** - Fully responsive and touch-optimized
- ⚡ **Fast & Modern** - Built with Vue 3, TypeScript, and Vite
- 🔍 **Search & Filter** - Quick tool discovery and navigation
- 🎯 **Direct Access** - One-click links to OSINT tools
- ♿ **Accessible** - WCAG compliant with keyboard navigation
- 🚀 **Performance Optimized** - Fast loading and smooth animations

## 🏗️ Architecture

This is a **modern, refactored version** of the OSINT Framework, completely rebuilt with:

- **Vue 3** with Composition API and TypeScript
- **Tailwind CSS** for responsive, utility-first styling
- **D3.js** for interactive tree visualization
- **Pinia** for state management
- **Vite** for fast development and building

## 📁 Project Structure

```
OSINT-Framework/
├── frontend/                 # Vue 3 + TypeScript frontend application
│   ├── src/                 # Source code
│   │   ├── components/      # Vue components
│   │   ├── composables/     # Vue composition functions
│   │   ├── stores/          # Pinia state management
│   │   ├── styles/          # CSS/styling files
│   │   └── types.ts         # TypeScript type definitions
│   ├── public/              # Static assets and data
│   │   └── data.json        # OSINT tools data
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.ts       # Vite build configuration
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   └── tsconfig.json        # TypeScript configuration
├── docs/                    # Project documentation
├── .github/                 # GitHub templates and workflows
└── README.md               # This file
```

## 🚀 Quick Start

### Option 1: Use Online (Recommended)
Visit the live version: **[https://khademohali1.github.io/OSINT-Framework](https://khademohali1.github.io/OSINT-Framework)**

### Option 2: Local Development

1. **Clone the repository**:
```bash
git clone https://github.com/KhademOHAli1/OSINT-Framework.git
cd OSINT-Framework
```

2. **Install dependencies**:
```bash
cd frontend
npm install
```

3. **Start development server**:
```bash
npm run dev
```

4. **Open your browser** to `http://localhost:3000`

### Option 3: Production Build

```bash
cd frontend
npm run build
npm run preview
```

## 📱 Mobile Optimization

The application is fully optimized for mobile devices with:

- **Responsive design** that adapts to all screen sizes
- **Touch-friendly interface** with appropriate spacing
- **Auto-scaling tree visualization** that adjusts to screen size
- **Horizontal scrolling** for wide content
- **No content cutoff** - all nodes remain accessible

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Adding OSINT Tools

To add new tools, edit `frontend/public/data.json`:

```json
{
  "name": "Tool Name",
  "type": "url", 
  "url": "https://example.com"
}
```

## 📊 Available Scripts

| Command | Description |
|---------|-------------|
| `cd frontend && npm run dev` | Start development server |
| `cd frontend && npm run build` | Build for production |
| `cd frontend && npm run preview` | Preview production build |
| `cd frontend && npm run type-check` | Run TypeScript checking |
| `cd frontend && npm audit` | Run security audit |

## 🛡️ Security

Security is important to us. Please review our [Security Policy](SECURITY.md) for:
- Reporting vulnerabilities
- Security best practices
- Supported versions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built on the foundation of the original OSINT Framework
- Powered by [Vue.js](https://vuejs.org/) and [D3.js](https://d3js.org/)
- Inspired by the open source intelligence community

---

⭐ **Star this repository** if you find it useful!
