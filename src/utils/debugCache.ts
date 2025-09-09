// src/utils/debugCache.ts
/**
 * Debug utilities for clearing cache during development
 * Useful for fresh migrate testing and debugging data issues
 */

/**
 * Clear all browser storage and cache
 */
export const clearAllCache = (): void => {
  console.log('🧹 Clearing all cache and storage...');
  
  try {
    // Clear localStorage
    if (typeof Storage !== 'undefined') {
      const localStorageKeys = Object.keys(localStorage);
      console.log('📦 Clearing localStorage keys:', localStorageKeys);
      localStorage.clear();
    }
    
    // Clear sessionStorage  
    if (typeof sessionStorage !== 'undefined') {
      const sessionStorageKeys = Object.keys(sessionStorage);
      console.log('📦 Clearing sessionStorage keys:', sessionStorageKeys);
      sessionStorage.clear();
    }
    
    // Clear debug logs if they exist
    if (typeof Storage !== 'undefined') {
      localStorage.removeItem('api_debug_logs');
    }
    
    console.log('✅ Cache cleared successfully');
    
    // Reload page to ensure fresh start
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        console.log('🔄 Reloading page for fresh start...');
        window.location.reload();
      }, 1000);
    }
    
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
  }
};

/**
 * Clear React Query cache specifically
 */
export const clearReactQueryCache = (queryClient?: any): void => {
  console.log('🗑️ Clearing React Query cache...');
  
  try {
    if (queryClient) {
      queryClient.clear();
      console.log('✅ React Query cache cleared');
    } else {
      console.warn('⚠️ QueryClient not provided');
    }
  } catch (error) {
    console.error('❌ Error clearing React Query cache:', error);
  }
};

/**
 * Get cache information for debugging
 */
export const getCacheInfo = (): {
  localStorage: string[];
  sessionStorage: string[];
  userAgent: string;
  timestamp: string;
} => {
  return {
    localStorage: typeof Storage !== 'undefined' ? Object.keys(localStorage) : [],
    sessionStorage: typeof sessionStorage !== 'undefined' ? Object.keys(sessionStorage) : [],
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    timestamp: new Date().toISOString()
  };
};

/**
 * Force hard reload (bypasses cache)
 */
export const forceHardReload = (): void => {
  console.log('🔄 Forcing hard reload...');
  
  if (typeof window !== 'undefined') {
    // Try different methods for hard reload
    try {
      // Method 1: location.reload with force
      (window.location as any).reload(true);
    } catch {
      try {
        // Method 2: Replace current location
        window.location.replace(window.location.href);
      } catch {
        // Method 3: Standard reload
        window.location.reload();
      }
    }
  }
};

/**
 * Check if data is likely from cache
 */
export const isCachedData = (data: any, maxAge: number = 60000): boolean => {
  // Simple heuristic - if data appears immediately, it's likely cached
  const loadTime = performance.now();
  return loadTime < maxAge;
};

/**
 * Add cache-busting query parameter
 */
export const addCacheBuster = (url: string): string => {
  const separator = url.includes('?') ? '&' : '?';
  const timestamp = Date.now();
  return `${url}${separator}_cb=${timestamp}`;
};

/**
 * Console commands for debugging (attach to window in development)
 */
export const attachDebugCommands = (queryClient?: any): void => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    (window as any).debugCache = {
      clear: clearAllCache,
      clearReactQuery: () => clearReactQueryCache(queryClient),
      info: getCacheInfo,
      hardReload: forceHardReload,
      help: () => {
        console.log(`
🛠️ Debug Cache Commands:
- debugCache.clear() - Clear all cache and storage
- debugCache.clearReactQuery() - Clear React Query cache only  
- debugCache.info() - Get cache information
- debugCache.hardReload() - Force hard reload
- debugCache.help() - Show this help
        `);
      }
    };
    
    console.log('🛠️ Debug cache commands attached to window.debugCache');
    console.log('💡 Type debugCache.help() for available commands');
  }
};
