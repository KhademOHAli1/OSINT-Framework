#!/bin/bash

# GitHub Deployment Preparation Script
# This script prepares the OSINT Framework for GitHub deployment

set -e

echo "🚀 Preparing OSINT Framework for GitHub deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the OSINT-Framework root directory"
    exit 1
fi

print_status "Checking prerequisites..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node --version)"
    exit 1
fi

print_success "Node.js version: $(node --version)"

# Check npm version
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

print_success "npm version: $(npm --version)"

# Clean previous builds
print_status "Cleaning previous builds..."
npm run clean:build 2>/dev/null || true

# Install dependencies
print_status "Installing dependencies..."
cd frontend
npm install

# Run security audit
print_status "Running security audit..."
npm audit --audit-level=high || {
    print_warning "Security audit found issues. Run 'npm audit fix' to resolve them."
}

# Run linting
print_status "Running linting checks..."
npm run lint || {
    print_error "Linting failed. Please fix the issues and try again."
    exit 1
}

# Run type checking
print_status "Running TypeScript type checking..."
npx vue-tsc --noEmit || {
    print_error "Type checking failed. Please fix the TypeScript errors and try again."
    exit 1
}

# Build for production
print_status "Building for production..."
npm run build || {
    print_error "Build failed. Please check the errors and try again."
    exit 1
}

cd ..

# Verify build output
if [ ! -d "dist" ]; then
    print_error "Build output directory 'dist' not found"
    exit 1
fi

BUILD_SIZE=$(du -sh dist | cut -f1)
print_success "Build completed successfully. Size: $BUILD_SIZE"

# Check for required GitHub files
print_status "Checking GitHub repository files..."

REQUIRED_FILES=(
    "README.md"
    "LICENSE"
    "CONTRIBUTING.md"
    "SECURITY.md"
    ".gitignore"
    ".github/workflows/ci-cd.yml"
    ".github/workflows/release.yml"
    ".github/ISSUE_TEMPLATE/bug_report.md"
    ".github/ISSUE_TEMPLATE/feature_request.md"
    ".github/ISSUE_TEMPLATE/osint_tool_request.md"
    ".github/pull_request_template.md"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_success "✓ $file"
    else
        print_warning "✗ $file (missing)"
    fi
done

# Generate deployment checklist
print_status "Generating deployment checklist..."

cat > DEPLOYMENT_CHECKLIST.md << 'EOF'
# GitHub Deployment Checklist

## 📋 Pre-Deployment Tasks

### Repository Setup
- [ ] Repository created on GitHub
- [ ] Repository visibility set (public/private)
- [ ] Repository description added
- [ ] Repository topics/tags added
- [ ] Default branch set to `main`

### Repository Settings
- [ ] GitHub Pages enabled (Settings > Pages)
- [ ] GitHub Pages source set to "GitHub Actions"
- [ ] Custom domain configured (if applicable)
- [ ] Branch protection rules set up for `main` branch
- [ ] Issue templates enabled
- [ ] Pull request template enabled

### GitHub Actions
- [ ] Actions enabled in repository settings
- [ ] Workflow permissions configured
- [ ] Secrets configured (if needed):
  - [ ] `SNYK_TOKEN` (for security scanning)
  - [ ] Custom deployment secrets (if applicable)

### Code Quality
- [ ] All tests passing
- [ ] Linting issues resolved
- [ ] TypeScript errors fixed
- [ ] Security audit clean
- [ ] Build successful

### Documentation
- [ ] README.md updated with correct URLs
- [ ] CONTRIBUTING.md reviewed
- [ ] SECURITY.md contact information updated
- [ ] License file present and correct
- [ ] All GitHub usernames/URLs updated in templates

## 🚀 Deployment Steps

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "feat: initial GitHub deployment"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to Repository Settings > Pages
   - Set source to "GitHub Actions"
   - Save settings

3. **Create First Release**:
   ```bash
   git tag v2.0.0
   git push origin v2.0.0
   ```

4. **Verify Deployment**:
   - [ ] GitHub Actions workflows running
   - [ ] GitHub Pages deployment successful
   - [ ] Live site accessible
   - [ ] All functionality working

## 📝 Post-Deployment Tasks

- [ ] Update social media links
- [ ] Add repository to project showcase
- [ ] Create announcement/blog post
- [ ] Update personal/organization website
- [ ] Share with OSINT community
- [ ] Monitor for issues and feedback

## 🔧 Maintenance

- [ ] Set up dependency updates (Dependabot)
- [ ] Configure issue/PR labels
- [ ] Set up project boards (if needed)
- [ ] Plan release schedule
- [ ] Monitor analytics and usage

---

Generated on: $(date)
EOF

print_success "Deployment checklist created: DEPLOYMENT_CHECKLIST.md"

# Final recommendations
echo ""
echo "🎉 GitHub deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Review DEPLOYMENT_CHECKLIST.md"
echo "2. Update all GitHub usernames in files (replace 'your-username')"
echo "3. Commit and push to GitHub:"
echo "   git add ."
echo "   git commit -m 'feat: prepare for GitHub deployment'"
echo "   git push origin main"
echo ""
echo "4. Enable GitHub Pages in repository settings"
echo "5. Create your first release with: git tag v2.0.0 && git push origin v2.0.0"
echo ""
print_success "🚀 Ready for GitHub deployment!"
