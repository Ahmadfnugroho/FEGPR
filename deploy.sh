#!/bin/bash

echo "🚀 Deploying GPR Frontend Application"
echo "======================================"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install optional dev dependencies if they don't exist
if ! npm list @types/node &> /dev/null; then
    echo "📝 Installing TypeScript node types (optional)..."
    npm install --save-dev @types/node || echo "⚠️  Warning: Could not install @types/node, continuing without it..."
fi

# Update browser database
echo "🌐 Updating browser compatibility data..."
npx update-browserslist-db@latest

# Run TypeScript check
echo "🔍 Running TypeScript check..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo ""
    echo "📊 Build Statistics:"
    echo "- Bundle optimized with code splitting"
    echo "- Production build ready in ./dist/"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Copy ./dist/ contents to your web server"
    echo "2. Configure web server to serve index.html for all routes"
    echo "3. Set up API endpoints (see BACKEND_API_INTEGRATION.md)"
    echo ""
    echo "🌍 Local preview: npm run preview"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
