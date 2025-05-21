import { useEffect, useRef, useCallback } from 'react';

interface CleanupConfig {
  // Time after which unused data should be cleaned up (in ms)
  inactivityThreshold?: number;
  // Maximum items to keep in memory
  maxItems?: number;
  // Whether to clean up on component unmount
  cleanupOnUnmount?: boolean;
  // Custom cleanup function
  customCleanup?: () => void;
  // Debug mode
  debug?: boolean;
}

interface CleanupMetadata {
  lastAccessed: number;
  size: number;
  type: string;
}

class DataCleanupManager {
  private static instance: DataCleanupManager;
  private cleanupRegistry = new Map<string, CleanupMetadata>();
  private cleanupCallbacks = new Map<string, () => void>();
  private config: Required<CleanupConfig>;
  private cleanupInterval: NodeJS.Timeout | null = null;

  private constructor(config: CleanupConfig = {}) {
    this.config = {
      inactivityThreshold: config.inactivityThreshold ?? 5 * 60 * 1000, // 5 minutes
      maxItems: config.maxItems ?? 1000,
      cleanupOnUnmount: config.cleanupOnUnmount ?? true,
      customCleanup: config.customCleanup ?? (() => {}),
      debug: config.debug ?? false,
    };

    this.startCleanupInterval();
  }

  static getInstance(config?: CleanupConfig): DataCleanupManager {
    if (!DataCleanupManager.instance) {
      DataCleanupManager.instance = new DataCleanupManager(config);
    }
    return DataCleanupManager.instance;
  }

  private startCleanupInterval(): void {
    this.cleanupInterval = setInterval(() => {
      this.runCleanup();
    }, Math.min(this.config.inactivityThreshold / 2, 60000)); // Run at least every minute
  }

  registerData(
    key: string,
    metadata: Omit<CleanupMetadata, 'lastAccessed'>,
    cleanup?: () => void
  ): void {
    this.cleanupRegistry.set(key, {
      ...metadata,
      lastAccessed: Date.now(),
    });

    if (cleanup) {
      this.cleanupCallbacks.set(key, cleanup);
    }

    if (this.config.debug) {
      console.debug(`[DataCleanup] Registered data: ${key}`, metadata);
    }

    // Check if we need to clean up old items
    if (this.cleanupRegistry.size > this.config.maxItems) {
      this.runCleanup();
    }
  }

  accessData(key: string): void {
    const metadata = this.cleanupRegistry.get(key);
    if (metadata) {
      metadata.lastAccessed = Date.now();
      this.cleanupRegistry.set(key, metadata);
    }
  }

  private runCleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, metadata] of this.cleanupRegistry.entries()) {
      if (now - metadata.lastAccessed > this.config.inactivityThreshold) {
        this.cleanupData(key);
        cleanedCount++;
      }
    }

    if (this.config.debug && cleanedCount > 0) {
      console.debug(`[DataCleanup] Cleaned up ${cleanedCount} items`);
    }
  }

  private cleanupData(key: string): void {
    // Run custom cleanup if registered
    const cleanup = this.cleanupCallbacks.get(key);
    if (cleanup) {
      try {
        cleanup();
      } catch (error) {
        console.error(`[DataCleanup] Error cleaning up ${key}:`, error);
      }
    }

    // Remove from registry
    this.cleanupRegistry.delete(key);
    this.cleanupCallbacks.delete(key);

    if (this.config.debug) {
      console.debug(`[DataCleanup] Cleaned up data: ${key}`);
    }
  }

  dispose(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    // Run final cleanup
    for (const key of this.cleanupRegistry.keys()) {
      this.cleanupData(key);
    }

    if (this.config.debug) {
      console.debug('[DataCleanup] Disposed cleanup manager');
    }
  }
}

export function useDataCleanup<T>(key: string, config: CleanupConfig = {}) {
  const manager = DataCleanupManager.getInstance(config);
  const dataRef = useRef<T | null>(null);

  const registerData = useCallback((
    data: T,
    metadata: { size: number; type: string },
    cleanup?: () => void
  ) => {
    dataRef.current = data;
    manager.registerData(key, metadata, cleanup);
  }, [key, manager]);

  const accessData = useCallback(() => {
    manager.accessData(key);
    return dataRef.current;
  }, [key, manager]);

  // Cleanup on unmount if configured
  useEffect(() => {
    return () => {
      if (config.cleanupOnUnmount) {
        manager.dispose();
      }
    };
  }, [config.cleanupOnUnmount]);

  return {
    registerData,
    accessData,
  };
}

// Example usage:
// const { registerData, accessData } = useDataCleanup<BlogPost>('uniqueKey', {
//   inactivityThreshold: 300000, // 5 minutes
//   maxItems: 100,
//   cleanupOnUnmount: true,
//   debug: true,
// }); 