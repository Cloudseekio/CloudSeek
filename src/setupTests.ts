import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import 'jest-canvas-mock';

// Configure testing-library
configure({
  testIdAttribute: 'data-testid',
});

// Add TextEncoder/TextDecoder polyfill
if (typeof TextEncoder === 'undefined') {
  // Simple polyfills for TextEncoder/TextDecoder
  class TextEncoderPolyfill {
    encode(input: string): Uint8Array {
      const utf8 = unescape(encodeURIComponent(input));
      const result = new Uint8Array(utf8.length);
      for (let i = 0; i < utf8.length; i++) {
        result[i] = utf8.charCodeAt(i);
      }
      return result;
    }
  }

  class TextDecoderPolyfill {
    decode(input?: Uint8Array): string {
      if (!input) return '';
      const bytes = new Uint8Array(input);
      let result = '';
      for (let i = 0; i < bytes.length; i++) {
        result += String.fromCharCode(bytes[i]);
      }
      return decodeURIComponent(escape(result));
    }
  }

  // @ts-expect-error - Polyfill
  global.TextEncoder = TextEncoderPolyfill;
  // @ts-expect-error - Polyfill
  global.TextDecoder = TextDecoderPolyfill;
}

// Mock HTMLCanvasElement.prototype.getContext
if (!HTMLCanvasElement.prototype.getContext) {
  HTMLCanvasElement.prototype.getContext = function() {
    return null;
  };
}

// Enhanced Mock IntersectionObserver
class IntersectionObserverMock {
  readonly root: Element | null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number>;
  
  // Static array to track instances for testing
  static __instances: IntersectionObserverMock[] = [];
  
  constructor(
    private callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ) {
    this.root = options?.root as Element | null || null;
    this.rootMargin = options?.rootMargin || '0px';
    this.thresholds = Array.isArray(options?.threshold) 
      ? options.threshold 
      : [options?.threshold || 0];
    
    // Register this instance
    IntersectionObserverMock.__instances.push(this);
  }
  
  // Track observed elements - making this protected for testing
  protected _observedElements = new Map<Element, IntersectionObserverEntry>();
  
  // Getter for testing purposes
  get observedElements(): Element[] {
    return Array.from(this._observedElements.keys());
  }
  
  observe = jest.fn((element: Element) => {
    // Create default entry for newly observed element (not intersecting by default)
    if (!this._observedElements.has(element)) {
      this._observedElements.set(element, this._createEntry(element, false));
    }
  });
  
  unobserve = jest.fn((element: Element) => {
    this._observedElements.delete(element);
  });
  
  disconnect = jest.fn(() => {
    this._observedElements.clear();
  });
  
  takeRecords = jest.fn(() => {
    return Array.from(this._observedElements.values());
  });
  
  // Helper to create IntersectionObserverEntry objects
  private _createEntry(
    element: Element, 
    isIntersecting: boolean, 
    ratio = isIntersecting ? 1.0 : 0.0
  ): IntersectionObserverEntry {
    const rect = element.getBoundingClientRect();
    return {
      boundingClientRect: rect,
      intersectionRatio: ratio,
      intersectionRect: isIntersecting ? rect : new DOMRectReadOnly(0, 0, 0, 0),
      isIntersecting,
      rootBounds: this.root ? this.root.getBoundingClientRect() : null,
      target: element,
      time: Date.now()
    };
  }
  
  // Helper method for tests to trigger intersection changes
  public simulateIntersection(element: Element, isIntersecting: boolean, ratio?: number) {
    if (this._observedElements.has(element)) {
      const entry = this._createEntry(element, isIntersecting, ratio);
      this._observedElements.set(element, entry);
      this.callback([entry], this);
    }
  }
  
  // Helper to simulate all elements becoming visible/invisible
  public simulateAllElementsIntersecting(isIntersecting: boolean) {
    const entries = Array.from(this._observedElements.keys()).map(element => 
      this._createEntry(element, isIntersecting)
    );
    
    if (entries.length > 0) {
      entries.forEach(entry => {
        this._observedElements.set(entry.target, entry);
      });
      this.callback(entries, this);
    }
  }
}

// Make DOMRectReadOnly available if not defined
if (typeof DOMRectReadOnly === 'undefined') {
  // @ts-expect-error - Polyfill
  global.DOMRectReadOnly = class DOMRectReadOnly {
    constructor(x: number, y: number, width: number, height: number) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.top = y;
      this.right = x + width;
      this.bottom = y + height;
      this.left = x;
    }
    
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly top: number;
    readonly right: number;
    readonly bottom: number;
    readonly left: number;
    
    toJSON() {
      return {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        top: this.top,
        right: this.right,
        bottom: this.bottom,
        left: this.left
      };
    }
  };
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock
});

// Export the IntersectionObserver mock so tests can access it
// Use unknown as an intermediate cast to avoid type errors
(global as unknown as { 
  __IntersectionObserverMock: typeof IntersectionObserverMock 
}).__IntersectionObserverMock = IntersectionObserverMock;

// Helper function to get the instance of IntersectionObserver created during tests
(global as unknown as {
  getIntersectionObserverMock: (element: Element) => IntersectionObserverMock | undefined
}).getIntersectionObserverMock = (element: Element): IntersectionObserverMock | undefined => {
  return IntersectionObserverMock.__instances.find(observer => 
    observer.observedElements.includes(element)
  );
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
class ResizeObserverMock {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserverMock
});

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});

// Mock window.fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
    status: 200,
    statusText: 'OK',
  })
) as jest.Mock;

// Mock Performance API
const performanceMock = {
  now: jest.fn().mockReturnValue(Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByName: jest.fn().mockReturnValue([]),
  getEntriesByType: jest.fn().mockReturnValue([]),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
  getEntries: jest.fn().mockReturnValue([]),
  timing: {
    navigationStart: Date.now(),
  },
};

Object.defineProperty(window, 'performance', {
  writable: true,
  value: performanceMock,
});

// Mock PerformanceObserver
class PerformanceObserverMock {
  constructor(callback: (list: PerformanceObserverEntryList) => void) {
    this.callback = callback;
  }
  
  callback: (list: PerformanceObserverEntryList) => void;
  observe = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn().mockReturnValue([]);
}

Object.defineProperty(window, 'PerformanceObserver', {
  writable: true,
  configurable: true,
  value: PerformanceObserverMock
});

// Mock requestAnimationFrame and cancelAnimationFrame
let rafId = 0;
window.requestAnimationFrame = jest.fn().mockImplementation(callback => {
  setTimeout(() => callback(Date.now()), 0);
  return ++rafId;
});

// Provide proper implementation to avoid unused parameter warning
// Using a eslint disable comment since we need to satisfy the function signature
window.cancelAnimationFrame = jest.fn().mockImplementation((
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  id: number
) => {
  // Basic implementation that just satisfies TypeScript
  return;
});

// Suppress specific React warnings
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
       args[0].includes('Warning: React.createFactory()') ||
       args[0].includes('Warning: React has detected a change in the order of Hooks'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
}); 