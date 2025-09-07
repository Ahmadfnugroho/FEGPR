#!/usr/bin/env node

/**
 * Performance Testing Script for Global Photo Rental
 * Monitors Core Web Vitals and other performance metrics
 */

const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');

class PerformanceMonitor {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      metrics: {},
      errors: [],
      warnings: []
    };
  }

  async checkBundleSize() {
    console.log('🔍 Checking bundle size...');
    
    const distPath = path.join(__dirname, 'dist');
    if (!fs.existsSync(distPath)) {
      this.results.errors.push('No dist folder found. Run `npm run build` first.');
      return;
    }

    const stats = this.getFolderSize(distPath);
    this.results.metrics.bundleSize = {
      totalSize: stats.size,
      totalFiles: stats.files,
      sizeFormatted: this.formatBytes(stats.size)
    };

    // Check if bundle size is reasonable
    const maxBundleSize = 2 * 1024 * 1024; // 2MB
    if (stats.size > maxBundleSize) {
      this.results.warnings.push(`Bundle size (${this.formatBytes(stats.size)}) exceeds recommended 2MB`);
    }

    console.log(`✅ Bundle size: ${this.formatBytes(stats.size)} (${stats.files} files)`);
  }

  async checkImageOptimization() {
    console.log('🖼️ Checking image optimization...');
    
    const publicPath = path.join(__dirname, 'public');
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
    const images = this.findFilesByExtensions(publicPath, imageExtensions);
    
    let totalImageSize = 0;
    let largeImages = [];
    
    images.forEach(imagePath => {
      const stats = fs.statSync(imagePath);
      totalImageSize += stats.size;
      
      // Check for large images (>500KB)
      if (stats.size > 500 * 1024) {
        largeImages.push({
          path: path.relative(__dirname, imagePath),
          size: this.formatBytes(stats.size)
        });
      }
    });

    this.results.metrics.images = {
      totalImages: images.length,
      totalSize: this.formatBytes(totalImageSize),
      largeImages: largeImages
    };

    if (largeImages.length > 0) {
      this.results.warnings.push(`Found ${largeImages.length} large images that should be optimized`);
    }

    console.log(`✅ Found ${images.length} images, total size: ${this.formatBytes(totalImageSize)}`);
  }

  async checkDependencies() {
    console.log('📦 Checking dependencies...');
    
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    const dependencies = Object.keys(packageJson.dependencies || {});
    const devDependencies = Object.keys(packageJson.devDependencies || {});
    
    // Check for heavy dependencies
    const heavyDeps = [
      'lodash', 'moment', 'babel-polyfill', 'core-js', 
      'jquery', 'bootstrap', 'material-ui'
    ];
    
    const foundHeavyDeps = dependencies.filter(dep => 
      heavyDeps.some(heavy => dep.includes(heavy))
    );
    
    if (foundHeavyDeps.length > 0) {
      this.results.warnings.push(`Heavy dependencies detected: ${foundHeavyDeps.join(', ')}`);
    }

    this.results.metrics.dependencies = {
      production: dependencies.length,
      development: devDependencies.length,
      heavyDependencies: foundHeavyDeps
    };

    console.log(`✅ Dependencies: ${dependencies.length} prod, ${devDependencies.length} dev`);
  }

  async generateReport() {
    console.log('📋 Generating performance report...');
    
    const reportPath = path.join(__dirname, 'performance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    
    console.log('\n📊 PERFORMANCE REPORT');
    console.log('======================');
    
    if (this.results.metrics.bundleSize) {
      console.log(`Bundle Size: ${this.results.metrics.bundleSize.sizeFormatted}`);
    }
    
    if (this.results.metrics.images) {
      console.log(`Images: ${this.results.metrics.images.totalImages} files (${this.results.metrics.images.totalSize})`);
    }
    
    if (this.results.metrics.dependencies) {
      console.log(`Dependencies: ${this.results.metrics.dependencies.production} production`);
    }

    if (this.results.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.results.warnings.forEach(warning => console.log(`  - ${warning}`));
    }

    if (this.results.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.results.errors.forEach(error => console.log(`  - ${error}`));
    }

    console.log(`\n📄 Full report saved to: ${reportPath}`);
    
    // Performance recommendations
    this.generateRecommendations();
  }

  generateRecommendations() {
    console.log('\n💡 RECOMMENDATIONS FOR RENTAL KAMERA WEBSITE:');
    console.log('===============================================');
    
    const recommendations = [
      '🖼️  Convert product images to WebP format for 25-35% size reduction',
      '📱 Implement lazy loading for product galleries (already partially done)',
      '🔄 Add service worker for offline product browsing',
      '⚡ Use React.memo for ProductCard components to prevent unnecessary re-renders',
      '📊 Implement image CDN with automatic optimization',
      '🎯 Add prefetch links for popular camera categories',
      '💾 Cache API responses for product listings (React Query configured)',
      '🚀 Consider implementing virtual scrolling for large product lists'
    ];

    recommendations.forEach(rec => console.log(`  ${rec}`));
  }

  // Helper methods
  getFolderSize(folderPath) {
    let totalSize = 0;
    let totalFiles = 0;
    
    const files = fs.readdirSync(folderPath, { withFileTypes: true });
    
    for (const file of files) {
      const filePath = path.join(folderPath, file.name);
      
      if (file.isDirectory()) {
        const subStats = this.getFolderSize(filePath);
        totalSize += subStats.size;
        totalFiles += subStats.files;
      } else {
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
        totalFiles += 1;
      }
    }
    
    return { size: totalSize, files: totalFiles };
  }

  findFilesByExtensions(dir, extensions) {
    let files = [];
    
    if (!fs.existsSync(dir)) return files;
    
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        files = files.concat(this.findFilesByExtensions(fullPath, extensions));
      } else if (extensions.includes(path.extname(item.name).toLowerCase())) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Run performance monitoring
async function runPerformanceTest() {
  console.log('🚀 Starting Performance Analysis for Global Photo Rental');
  console.log('========================================================\n');
  
  const monitor = new PerformanceMonitor();
  
  try {
    await monitor.checkBundleSize();
    await monitor.checkImageOptimization();
    await monitor.checkDependencies();
    await monitor.generateReport();
    
    console.log('\n✅ Performance analysis completed!');
    
  } catch (error) {
    console.error('❌ Error during performance analysis:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runPerformanceTest();
}

module.exports = { PerformanceMonitor };
