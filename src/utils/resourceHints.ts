import { performanceMonitor } from './performanceMonitoring';

interface ResourceHint {
  url: string;
  type: 'preload' | 'prefetch' | 'preconnect' | 'dns-prefetch';
  as?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
}

interface ResourceHintsOptions {
  /**
   * Maximum number of concurrent resource loads
   */
  maxConcurrentLoads?: number;
  /**
   * Priority levels for different resource types
   */
  priorities?: Record<string, number>;
  /**
   * Whether to automatically remove hints after they're used
   */
  autoCleanup?: boolean;
}

class ResourceHintsManager {
  private hints: Set<ResourceHint> = new Set();
  private loadingResources: Set<string> = new Set();
  private options: Required<ResourceHintsOptions>;

  constructor(options: ResourceHintsOptions = {}) {
    this.options = {
      maxConcurrentLoads: options.maxConcurrentLoads ?? 6,
      priorities: {
        preload: 3,
        preconnect: 2,
        prefetch: 1,
        'dns-prefetch': 0,
        ...options.priorities
      },
      autoCleanup: options.autoCleanup ?? true
    };

    this.observeResourceTiming();
  }

  /**
   * Adds a resource hint
   */
  addHint(hint: ResourceHint): void {
    this.hints.add(hint);
    this.processHints();
  }

  /**
   * Adds multiple resource hints
   */
  addHints(hints: ResourceHint[]): void {
    hints.forEach(hint => this.hints.add(hint));
    this.processHints();
  }

  /**
   * Removes a resource hint
   */
  removeHint(hint: ResourceHint): void {
    this.hints.delete(hint);
  }

  /**
   * Clears all resource hints
   */
  clearHints(): void {
    this.hints.clear();
  }

  /**
   * Gets all current resource hints
   */
  getHints(): ResourceHint[] {
    return Array.from(this.hints);
  }

  /**
   * Processes resource hints based on priority and concurrency limits
   */
  private processHints(): void {
    if (this.loadingResources.size >= this.options.maxConcurrentLoads) {
      return;
    }

    const sortedHints = Array.from(this.hints)
      .sort((a, b) => {
        const priorityA = this.options.priorities[a.type] ?? 0;
        const priorityB = this.options.priorities[b.type] ?? 0;
        return priorityB - priorityA;
      })
      .slice(0, this.options.maxConcurrentLoads - this.loadingResources.size);

    sortedHints.forEach(hint => {
      if (!this.loadingResources.has(hint.url)) {
        this.applyHint(hint);
      }
    });
  }

  /**
   * Applies a resource hint by creating the appropriate link element
   */
  private applyHint(hint: ResourceHint): void {
    const link = document.createElement('link');
    link.rel = hint.type;
    link.href = hint.url;

    if (hint.as) {
      link.as = hint.as;
    }

    if (hint.crossOrigin) {
      link.crossOrigin = hint.crossOrigin;
    }

    this.loadingResources.add(hint.url);
    document.head.appendChild(link);

    performanceMonitor.record(
      'resource.hint.applied',
      1,
      'count',
      { type: hint.type, url: hint.url }
    );
  }

  /**
   * Observes resource timing entries to track loading performance
   */
  private observeResourceTiming(): void {
    const observer = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        const url = entry.name;
        
        if (this.loadingResources.has(url)) {
          performanceMonitor.recordResourceTiming(entry as PerformanceResourceTiming);
          
          if (this.options.autoCleanup) {
            this.hints.forEach(hint => {
              if (hint.url === url) {
                this.removeHint(hint);
              }
            });
          }

          this.loadingResources.delete(url);
          this.processHints();
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  /**
   * Preloads critical resources for a route
   */
  preloadRoute(resources: ResourceHint[]): Promise<void[]> {
    const criticalResources = resources.filter(r => r.type === 'preload');
    this.addHints(criticalResources);

    const promises = criticalResources.map(resource => {
      return new Promise<void>((resolve, reject) => {
        performanceMonitor
          .measure(
            'resource.preload',
            () => {
              const link = document.createElement('link');
              link.rel = 'preload';
              link.href = resource.url;
              if (resource.as) {
                link.as = resource.as;
              }
              if (resource.crossOrigin) {
                link.crossOrigin = resource.crossOrigin;
              }

              link.onload = () => resolve();
              link.onerror = () => reject(new Error(`Failed to preload: ${resource.url}`));

              document.head.appendChild(link);
            },
            { url: resource.url }
          )
          .catch(error => {
            performanceMonitor.record(
              'resource.preload.error',
              1,
              'count',
              { url: resource.url, error: error instanceof Error ? error.message : String(error) }
            );
            throw error;
          });
      });
    });

    // Add non-critical resources after critical ones
    const nonCriticalResources = resources.filter(r => r.type !== 'preload');
    setTimeout(() => this.addHints(nonCriticalResources), 0);

    return Promise.all(promises);
  }
}

// Create a singleton instance
export const resourceHints = new ResourceHintsManager();

// Export types and class for testing or custom instances
export type { ResourceHint, ResourceHintsOptions };
export { ResourceHintsManager };

/**
 * Utilities for implementing resource hints (preload, preconnect, etc.)
 * to improve loading performance.
 */

type ResourceType = 'style' | 'script' | 'font' | 'image' | 'fetch' | 'document';

interface ResourceHintOptions {
  /**
   * The relationship type (preload, prefetch, preconnect, etc.)
   */
  rel: 'preload' | 'prefetch' | 'preconnect' | 'dns-prefetch';
  
  /**
   * The resource URL
   */
  href: string;
  
  /**
   * Resource type (for preload and prefetch)
   */
  as?: ResourceType;
  
  /**
   * Whether the resource should use crossorigin
   */
  crossOrigin?: boolean;
  
  /**
   * Mimetype of the resource (optional)
   */
  type?: string;
  
  /**
   * Media query for conditional loading
   */
  media?: string;
  
  /**
   * Fetch priority for the resource
   */
  fetchPriority?: 'high' | 'low' | 'auto';
  
  /**
   * Whether an existing hint with the same href should be replaced
   */
  replace?: boolean;
  
  /**
   * Id for the link element
   */
  id?: string;
}

/**
 * Dynamically add a resource hint to the document head
 */
export function addResourceHint(options: ResourceHintOptions): HTMLLinkElement | null {
  if (!document) return null;
  
  const {
    rel,
    href,
    as,
    crossOrigin = false,
    type,
    media,
    fetchPriority,
    replace = false,
    id
  } = options;
  
  // Check if a link with this href and rel already exists
  const existingLink = document.querySelector(`link[rel="${rel}"][href="${href}"]`);
  
  if (existingLink) {
    if (replace) {
      existingLink.remove();
    } else {
      return existingLink as HTMLLinkElement;
    }
  }
  
  // Create the link element
  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;
  
  if (as && (rel === 'preload' || rel === 'prefetch')) {
    link.setAttribute('as', as);
  }
  
  if (crossOrigin) {
    link.crossOrigin = 'anonymous';
  }
  
  if (type) {
    link.type = type;
  }
  
  if (media) {
    link.media = media;
  }
  
  if (fetchPriority) {
    link.setAttribute('fetchpriority', fetchPriority);
  }
  
  if (id) {
    link.id = id;
  }
  
  // Add to the head
  document.head.appendChild(link);
  
  return link;
}

/**
 * Preload a resource
 */
export function preload(
  href: string,
  as: ResourceType,
  options: Partial<ResourceHintOptions> = {}
): HTMLLinkElement | null {
  return addResourceHint({
    rel: 'preload',
    href,
    as,
    ...options
  });
}

/**
 * Prefetch a resource for future use
 */
export function prefetch(
  href: string,
  as: ResourceType,
  options: Partial<ResourceHintOptions> = {}
): HTMLLinkElement | null {
  return addResourceHint({
    rel: 'prefetch',
    href,
    as,
    ...options
  });
}

/**
 * Preconnect to a domain to speed up future requests
 */
export function preconnect(
  href: string,
  options: Partial<ResourceHintOptions> = {}
): HTMLLinkElement | null {
  return addResourceHint({
    rel: 'preconnect',
    href,
    ...options
  });
}

/**
 * DNS prefetch for a domain
 */
export function dnsPrefetch(
  href: string,
  options: Partial<ResourceHintOptions> = {}
): HTMLLinkElement | null {
  return addResourceHint({
    rel: 'dns-prefetch',
    href,
    ...options
  });
}

/**
 * Preload critical fonts
 */
export function preloadFont(
  href: string,
  options: Partial<ResourceHintOptions> = {}
): HTMLLinkElement | null {
  return preload(href, 'font', { crossOrigin: true, ...options });
}

/**
 * Preload critical CSS
 */
export function preloadCSS(
  href: string,
  options: Partial<ResourceHintOptions> = {}
): HTMLLinkElement | null {
  return preload(href, 'style', options);
}

/**
 * Preload critical JavaScript
 */
export function preloadScript(
  href: string,
  options: Partial<ResourceHintOptions> = {}
): HTMLLinkElement | null {
  return preload(href, 'script', options);
}

/**
 * Preload critical images
 */
export function preloadImage(
  href: string,
  options: Partial<ResourceHintOptions> = {}
): HTMLLinkElement | null {
  return preload(href, 'image', options);
}

/**
 * Setup common resource hints for the application
 */
export function setupCriticalResourceHints(): void {
  // Preconnect to important domains
  preconnect('https://fonts.googleapis.com');
  preconnect('https://fonts.gstatic.com', { crossOrigin: true });
  
  // Preload critical assets
  // Example usage: preloadCSS('/assets/css/critical.css', { fetchPriority: 'high' });
}

// Auto-setup when imported in the main file
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    // Wait for page load to avoid competing with critical resources
    setTimeout(() => {
      setupCriticalResourceHints();
    }, 1000);
  });
} 