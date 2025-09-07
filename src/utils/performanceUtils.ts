// Performance optimization utilities

/**
 * Throttle function execution
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;
  let previous = 0;
  
  return function executedFunction(this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const remaining = wait - (now - previous);
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(this, args);
    } else if (!timeout) {
      timeout = window.setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func.apply(this, args);
      }, remaining);
    }
  };
}

/**
 * Intersection Observer for lazy loading
 */
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
}

/**
 * Image preloader
 */
export function preloadImage(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Batch process items to avoid blocking UI
 */
export function batchProcess<T>(
  items: T[],
  processor: (item: T, index: number) => void,
  batchSize = 10,
  delay = 10
): Promise<void> {
  return new Promise((resolve) => {
    let index = 0;
    
    function processBatch() {
      const endIndex = Math.min(index + batchSize, items.length);
      
      for (let i = index; i < endIndex; i++) {
        processor(items[i], i);
      }
      
      index = endIndex;
      
      if (index < items.length) {
        setTimeout(processBatch, delay);
      } else {
        resolve();
      }
    }
    
    processBatch();
  });
}

/**
 * Memory-efficient cache with automatic cleanup
 */
export class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private maxSize: number;
  
  constructor(maxSize = 50) {
    this.maxSize = maxSize;
  }
  
  get(key: K): V | undefined {
    if (this.cache.has(key)) {
      // Move to end (most recently used)
      const value = this.cache.get(key)!;
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return undefined;
  }
  
  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  size(): number {
    return this.cache.size;
  }
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Optimize scroll performance
 */
export function optimizeScroll(
  element: HTMLElement,
  callback: () => void
): () => void {
  let ticking = false;
  
  function handleScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        callback();
        ticking = false;
      });
      ticking = true;
    }
  }
  
  element.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => {
    element.removeEventListener('scroll', handleScroll);
  };
}

/**
 * Virtual scrolling helper
 */
export function calculateVisibleRange(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan = 5
): { start: number; end: number } {
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleItems = Math.ceil(containerHeight / itemHeight);
  const end = Math.min(totalItems - 1, start + visibleItems + overscan * 2);
  
  return { start, end };
}
