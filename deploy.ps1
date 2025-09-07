# PowerShell deployment script for GPR Frontend

Write-Host "🚀 Deploying GPR Frontend Application" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed. Please install Node.js and npm first." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Install optional dev dependencies if they don't exist
try {
    npm list @types/node 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "📝 Installing TypeScript node types (optional)..." -ForegroundColor Yellow
        npm install --save-dev @types/node
        if ($LASTEXITCODE -ne 0) {
            Write-Host "⚠️  Warning: Could not install @types/node, continuing without it..." -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "⚠️  Warning: Could not check @types/node, continuing..." -ForegroundColor Yellow
}

# Update browser database
Write-Host "🌐 Updating browser compatibility data..." -ForegroundColor Yellow
npx update-browserslist-db@latest

# Run TypeScript check and build
Write-Host "🔍 Running TypeScript check and build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Build Statistics:" -ForegroundColor Cyan
    Write-Host "- Bundle optimized with code splitting" -ForegroundColor White
    Write-Host "- Production build ready in ./dist/" -ForegroundColor White
    Write-Host ""
    Write-Host "🎯 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Copy ./dist/ contents to your web server" -ForegroundColor White
    Write-Host "2. Configure web server to serve index.html for all routes" -ForegroundColor White
    Write-Host "3. Set up API endpoints (see BACKEND_API_INTEGRATION.md)" -ForegroundColor White
    Write-Host ""
    Write-Host "🌍 Local preview: npm run preview" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed! Please check the errors above." -ForegroundColor Red
    exit 1
}
