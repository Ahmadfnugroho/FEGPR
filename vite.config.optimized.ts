import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Performance optimizations
  build: {
    // Code splitting strategy
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'ui-vendor': ['@headlessui/react', '@heroicons/react'],
          'animation-vendor': ['swiper'],
          'form-vendor': ['zod'],
          
          // App-specific chunks
          'components': [
            './src/components/ProductCard.tsx',
            './src/components/BrandCard.tsx',
            './src/components/BundlingCard.tsx'
          ],
          'pages-browse': [
            './src/pages/BrowseProduct.tsx',
            './src/pages/CategoryDetails.tsx',
            './src/pages/BrandDetails.tsx'
          ],
          'pages-product': [
            './src/pages/Details.tsx',
            './src/pages/BookProduct.tsx'
          ]
        }
      }
    },
    
    // Bundle size optimization
    chunkSizeWarningLimit: 1000,
    
    // Source maps for production debugging
    sourcemap: false,
    
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true
      }
    },
    
    // Asset optimization
    assetsInlineLimit: 4096, // Inline small assets as base64
  },
  
  // Development server optimizations
  server: {
    port: 5173,
    host: true, // Listen on all addresses
    cors: true,
    
    // HMR optimization
    hmr: {
      overlay: true
    }
  },
  
  // Preview server config
  preview: {
    port: 4173,
    host: true
  },
  
  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@types': resolve(__dirname, 'src/types'),
      '@api': resolve(__dirname, 'src/api'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@utils': resolve(__dirname, 'src/utils')
    }
  },
  
  // CSS optimization
  css: {
    modules: {
      localsConvention: 'camelCase'
    },
    preprocessorOptions: {
      // Add any CSS preprocessor options here
    }
  },
  
  // Asset optimization
  assetsInclude: ['**/*.webp', '**/*.avif'],
  
  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString())
  },
  
  // Optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'axios',
      'zod',
      'classnames'
    ],
    // Force pre-bundling of certain dependencies
    force: false
  },
  
  // ESBuild options for better performance
  esbuild: {
    // Remove unused imports
    treeShaking: true,
    
    // JSX optimization
    jsxInject: `import React from 'react'`,
    
    // Production optimizations
    ...(process.env.NODE_ENV === 'production' && {
      drop: ['console', 'debugger']
    })
  }
});
