// Performance optimization utilities

// Debounce function for search inputs and other frequent events
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function for scroll events and other high-frequency events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px 0px',
    threshold: 0.01,
    ...options,
  };
  
  return new IntersectionObserver(callback, defaultOptions);
}

// Preload critical resources
export function preloadResource(href: string, as: string = 'fetch'): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
}

// Prefetch non-critical resources
export function prefetchResource(href: string): void {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
}

// Image optimization utilities
export function optimizeImageUrl(
  url: string,
  width?: number,
  height?: number,
  quality: number = 80
): string {
  // This would integrate with your image optimization service
  // For now, return the original URL
  return url;
}

// Memory management utilities
export function cleanupEventListeners(): void {
  // Clean up any global event listeners
  window.removeEventListener('scroll', () => {});
  window.removeEventListener('resize', () => {});
}

// Performance monitoring
export function measurePerformance(name: string, fn: () => void): void {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
}

// Async function wrapper with timeout
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    ),
  ]);
}

// Batch DOM updates for better performance
export function batchDOMUpdates(updates: (() => void)[]): void {
  // Use requestAnimationFrame for smooth updates
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
}

// Virtual scrolling utilities
export function calculateVisibleItems(
  containerHeight: number,
  itemHeight: number,
  scrollTop: number,
  totalItems: number
): { startIndex: number; endIndex: number; visibleCount: number } {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, totalItems);
  
  return {
    startIndex: Math.max(0, startIndex - 5), // Buffer
    endIndex: Math.min(totalItems, endIndex + 5), // Buffer
    visibleCount,
  };
}

// Cache utilities
export class SimpleCache<T> {
  private cache = new Map<string, { data: T; timestamp: number }>();
  private maxAge: number;

  constructor(maxAgeMs: number = 5 * 60 * 1000) { // 5 minutes default
    this.maxAge = maxAgeMs;
  }

  set(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

// Export default utilities
const performanceUtils = {
  debounce,
  throttle,
  createIntersectionObserver,
  preloadResource,
  prefetchResource,
  optimizeImageUrl,
  cleanupEventListeners,
  measurePerformance,
  withTimeout,
  batchDOMUpdates,
  calculateVisibleItems,
  SimpleCache,
};

export default performanceUtils; 