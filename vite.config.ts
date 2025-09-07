import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath, URL } from 'node:url';

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
        }
      }
    },
    
    // Bundle size optimization
    chunkSizeWarningLimit: 1000,
    
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
  
  // Path resolution
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@types': fileURLToPath(new URL('./src/types', import.meta.url)),
      '@api': fileURLToPath(new URL('./src/api', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url))
    }
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
    ]
  },
  
  // ESBuild options for better performance
  esbuild: {
    // Remove unused imports
    treeShaking: true
  },
  
  // Environment-based configuration
  define: {
    'process.env': {}
  }
});
