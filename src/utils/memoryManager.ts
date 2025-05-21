/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="es2021.weakref" />

import { useEffect, useRef } from 'react';

// Types of resources that can be pooled
type PoolableResource = 
  | ArrayBuffer
  | SharedArrayBuffer
  | Uint8Array
  | Float64Array
  | ImageBitmap
  | ImageData
  | WebGLBuffer
  | WebGLTexture;

interface ResourcePoolConfig<T extends PoolableResource> {
  // Initial pool size
  initialSize: number;
  // Maximum pool size
  maxSize: number;
  // Factory function to create new resources
  create: () => T | Promise<T>;
  // Reset function to clean up resource before reuse
  reset: (resource: T) => void;
  // Validate function to check if resource is still valid
  validate?: (resource: T) => boolean;
  // Optional disposal function
  dispose?: (resource: T) => void;
}

interface MemoryThresholds {
  // Warning threshold (percentage of total memory)
  warning: number;
  // Critical threshold (percentage of total memory)
  critical: number;
  // Maximum heap size in bytes
  maxHeapSize?: number;
}

interface MemoryManagerOptions {
  // Enable automatic garbage collection
  enableAutoGC?: boolean;
  // GC interval in milliseconds
  gcInterval?: number;
  // Memory thresholds
  thresholds?: MemoryThresholds;
  // Debug mode
  debug?: boolean;
  // Event callbacks
  onWarning?: (usage: MemoryUsage) => void;
  onCritical?: (usage: MemoryUsage) => void;
  onError?: (error: Error) => void;
}

interface MemoryUsage {
  // Total heap size
  totalHeapSize: number;
  // Used heap size
  usedHeapSize: number;
  // Usage percentage
  usagePercentage: number;
  // Number of active resources
  activeResources: number;
  // Resource pool statistics
  poolStats: {
    available: number;
    total: number;
    type: string;
  }[];
}

// Add type for performance.memory
interface MemoryInfo {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
}

interface Performance {
  memory?: MemoryInfo;
}

// Resource pool implementation
class ResourcePool<T extends PoolableResource> {
  private available: T[] = [];
  private inUse: Set<T> = new Set();
  private config: ResourcePoolConfig<T>;

  constructor(config: ResourcePoolConfig<T>) {
    this.config = config;
    void this.initialize();
  }

  private async initialize(): Promise<void> {
    for (let i = 0; i < this.config.initialSize; i++) {
      const resource = await this.config.create();
      this.available.push(resource);
    }
  }

  async acquire(): Promise<T> {
    // Try to get an available resource
    let resource = this.available.pop();

    // Create new if none available and under max size
    if (!resource && (this.size < this.config.maxSize)) {
      resource = await this.config.create();
    }

    // If still no resource, wait for one to be released
    if (!resource) {
      await new Promise<void>(resolve => {
        const checkInterval = setInterval(() => {
          if (this.available.length > 0) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      });
      resource = this.available.pop()!;
    }

    // Validate resource
    if (this.config.validate && !this.config.validate(resource)) {
      this.config.reset(resource);
    }

    this.inUse.add(resource);
    return resource;
  }

  release(resource: T): void {
    if (this.inUse.has(resource)) {
      this.inUse.delete(resource);
      this.config.reset(resource);
      this.available.push(resource);
    }
  }

  clear(): void {
    if (this.config.dispose) {
      [...this.available, ...this.inUse].forEach(resource => {
        this.config.dispose?.(resource);
      });
    }
    this.available = [];
    this.inUse.clear();
  }

  get size(): number {
    return this.available.length + this.inUse.size;
  }

  get stats() {
    return {
      available: this.available.length,
      total: this.size,
      type: this.available[0]?.constructor.name ?? 'Unknown',
    };
  }
}

// Memory manager implementation
export class MemoryManager {
  private options: Required<MemoryManagerOptions>;
  private pools: Map<string, ResourcePool<PoolableResource>> = new Map();
  private gcInterval?: NodeJS.Timeout;
  private weakRefs: Set<WeakRef<PoolableResource>> = new Set();
  private registry: FinalizationRegistry<string>;
  private disposed = false;

  constructor(options: Partial<MemoryManagerOptions> = {}) {
    this.options = {
      enableAutoGC: true,
      gcInterval: 30000,
      thresholds: {
        warning: 70,
        critical: 90,
      },
      debug: false,
      onWarning: () => {},
      onCritical: () => {},
      onError: () => {},
      ...options,
    };

    this.registry = new FinalizationRegistry((id: string) => {
      this.cleanupResource(id);
    });

    if (this.options.enableAutoGC) {
      this.startAutoGC();
    }
  }

  createPool<T extends PoolableResource>(
    id: string,
    config: ResourcePoolConfig<T>
  ): void {
    if (this.pools.has(id)) {
      throw new Error(`Pool ${id} already exists`);
    }

    const pool = new ResourcePool(config);
    this.pools.set(id, pool as unknown as ResourcePool<PoolableResource>);
  }

  async acquireResource<T extends PoolableResource>(
    poolId: string
  ): Promise<T> {
    const pool = this.pools.get(poolId);
    if (!pool) {
      throw new Error(`Pool ${poolId} not found`);
    }

    const resource = await (pool as unknown as ResourcePool<T>).acquire();
    
    const ref = new WeakRef(resource);
    this.weakRefs.add(ref as WeakRef<PoolableResource>);
    this.registry.register(resource, poolId);

    return resource;
  }

  releaseResource<T extends PoolableResource>(
    poolId: string,
    resource: T
  ): void {
    const pool = this.pools.get(poolId);
    if (!pool) return;

    (pool as unknown as ResourcePool<T>).release(resource);
  }

  private startAutoGC(): void {
    this.gcInterval = setInterval(() => {
      void this.runGarbageCollection();
    }, this.options.gcInterval);
  }

  private async runGarbageCollection(): Promise<void> {
    try {
      const usage = await this.getMemoryUsage();

      // Check thresholds
      if (usage.usagePercentage >= (this.options.thresholds?.critical ?? 90)) {
        this.options.onCritical?.(usage);
        this.forceClearPools();
      } else if (usage.usagePercentage >= (this.options.thresholds?.warning ?? 70)) {
        this.options.onWarning?.(usage);
        this.cleanupWeakRefs();
      }

      if (this.options.debug) {
        console.debug('Memory usage:', usage);
      }
    } catch (error) {
      this.options.onError?.(error as Error);
    }
  }

  private cleanupWeakRefs(): void {
    for (const ref of this.weakRefs) {
      if (!ref.deref()) {
        this.weakRefs.delete(ref);
      }
    }
  }

  private cleanupResource(poolId: string): void {
    const pool = this.pools.get(poolId);
    if (pool) {
      pool.clear();
    }
  }

  private forceClearPools(): void {
    this.pools.forEach(pool => pool.clear());
  }

  private async getMemoryUsage(): Promise<MemoryUsage> {
    // Use performance.memory if available (Chrome only)
    const memory = (performance as Performance).memory;
    const totalHeapSize = memory?.jsHeapSizeLimit || 0;
    const usedHeapSize = memory?.usedJSHeapSize || 0;

    const poolStats = Array.from(this.pools.entries()).map(([poolId, pool]) => ({
      ...pool.stats,
      id: poolId,
    }));

    return {
      totalHeapSize,
      usedHeapSize,
      usagePercentage: totalHeapSize > 0 ? (usedHeapSize / totalHeapSize) * 100 : 0,
      activeResources: Array.from(this.weakRefs).filter(ref => ref.deref()).length,
      poolStats,
    };
  }

  dispose(): void {
    if (this.disposed) return;

    if (this.gcInterval) {
      clearInterval(this.gcInterval);
    }

    this.forceClearPools();
    this.weakRefs.clear();
    this.disposed = true;
  }
}

// React hook for memory management
export function useMemoryManager(options: Partial<MemoryManagerOptions> = {}) {
  const managerRef = useRef<MemoryManager>();

  if (!managerRef.current) {
    managerRef.current = new MemoryManager(options);
  }

  useEffect(() => {
    const manager = managerRef.current!;
    return () => {
      manager.dispose();
    };
  }, []);

  return managerRef.current;
} 