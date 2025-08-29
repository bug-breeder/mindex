import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, vi } from 'vitest'

// Global test setup
beforeAll(() => {
  // Mock window.matchMedia for responsive design tests
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })

  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))

  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))

  // Mock crypto for UUID generation
  Object.defineProperty(global, 'crypto', {
    value: {
      randomUUID: vi.fn(() => 'test-uuid-' + Math.random().toString(36).substr(2, 9)),
      getRandomValues: vi.fn((arr) => {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Math.floor(Math.random() * 256)
        }
        return arr
      }),
    },
  })

  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn((key: string) => {
      return localStorageMock.store[key] || null
    }),
    setItem: vi.fn((key: string, value: string) => {
      localStorageMock.store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete localStorageMock.store[key]
    }),
    clear: vi.fn(() => {
      localStorageMock.store = {}
    }),
    store: {} as Record<string, string>,
  }

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  })

  // Mock sessionStorage
  Object.defineProperty(window, 'sessionStorage', {
    value: localStorageMock,
  })

  // Mock URL.createObjectURL
  try {
    if (!global.URL.createObjectURL) {
      global.URL.createObjectURL = vi.fn(() => 'mocked-object-url')
    } else {
      // Clear any existing spy first
      if (vi.isMockFunction(global.URL.createObjectURL)) {
        global.URL.createObjectURL.mockClear()
      } else {
        vi.spyOn(global.URL, 'createObjectURL').mockReturnValue('mocked-object-url')
      }
    }
  } catch (error) {
    // If we can't mock it, create a fallback
    Object.defineProperty(global, 'URL', {
      value: {
        ...global.URL,
        createObjectURL: vi.fn(() => 'mocked-object-url'),
        revokeObjectURL: vi.fn()
      },
      writable: true
    })
  }
  // Mock revokeObjectURL if not already defined
  try {
    if (!global.URL.revokeObjectURL) {
      global.URL.revokeObjectURL = vi.fn()
    } else if (!vi.isMockFunction(global.URL.revokeObjectURL)) {
      vi.spyOn(global.URL, 'revokeObjectURL').mockImplementation(() => {})
    }
  } catch (error) {
    // Fallback already handled in createObjectURL section
  }

  // Mock Blob constructor
  global.Blob = vi.fn().mockImplementation((content, options) => ({
    size: content ? content.reduce((acc, part) => acc + part.length, 0) : 0,
    type: options?.type || '',
  }))

  // Simple error suppression for React Aria TreeWalker issues
  // Override TreeWalker.prototype.currentNode setter to handle invalid nodes gracefully
  if (global.TreeWalker && global.TreeWalker.prototype) {
    const originalCurrentNodeDescriptor = Object.getOwnPropertyDescriptor(
      global.TreeWalker.prototype, 
      'currentNode'
    ) || Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(global.TreeWalker.prototype), 
      'currentNode'
    )
    
    if (originalCurrentNodeDescriptor && originalCurrentNodeDescriptor.set) {
      const originalSetter = originalCurrentNodeDescriptor.set
      Object.defineProperty(global.TreeWalker.prototype, 'currentNode', {
        get: originalCurrentNodeDescriptor.get,
        set: function(node) {
          try {
            // Only set valid nodes
            if (node && (node.nodeType !== undefined || node === this.root)) {
              originalSetter.call(this, node)
            }
          } catch (error) {
            // Silently ignore TreeWalker currentNode errors
          }
        },
        configurable: true,
        enumerable: false
      })
    }
  }

  // Suppress React Aria focus errors
  const originalConsoleError = console.error
  console.error = (...args) => {
    const message = args[0]
    if (typeof message === 'string' && (
      message.includes('TreeWalker') ||
      message.includes('currentNode') ||
      message.includes('FocusScope')
    )) {
      return // Suppress React Aria focus errors in tests
    }
    originalConsoleError.apply(console, args)
  }

  // Mock dispatchEvent to prevent React Aria dispatchEvent errors
  const originalDispatchEvent = global.EventTarget.prototype.dispatchEvent
  global.EventTarget.prototype.dispatchEvent = function(event) {
    try {
      return originalDispatchEvent.call(this, event)
    } catch (error) {
      if (error.message && error.message.includes('parameter 1 is not of type \'Event\'')) {
        // Suppress invalid event dispatch errors from React Aria
        return true
      }
      throw error
    }
  }

  // Mock timers to prevent React Aria timing issues
  global.requestAnimationFrame = vi.fn(cb => setTimeout(cb, 16))
  global.cancelAnimationFrame = vi.fn(id => clearTimeout(id))

  // Mock HTMLCanvasElement.getContext for screenshot functionality
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    drawImage: vi.fn(),
    getImageData: vi.fn(() => ({
      data: new Uint8ClampedArray(4),
    })),
    canvas: {
      toDataURL: vi.fn(() => 'data:image/png;base64,mock-image-data'),
    },
  })) as any

  // Mock window.requestAnimationFrame
  global.requestAnimationFrame = vi.fn((cb) => {
    setTimeout(cb, 16)
    return 1
  })

  // Mock window.cancelAnimationFrame
  global.cancelAnimationFrame = vi.fn()

  // Mock fetch for API calls
  global.fetch = vi.fn()

  // Mock console methods to reduce noise in tests
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})

  // Set default viewport for responsive tests
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,
  })
  
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 768,
  })

  // Mock Touch events for mobile testing
  global.TouchEvent = class TouchEvent extends Event {
    constructor(type: string, eventInitDict?: TouchEventInit) {
      super(type, eventInitDict)
    }
  } as any

  // Mock PointerEvent for modern touch interactions
  global.PointerEvent = class PointerEvent extends Event {
    constructor(type: string, eventInitDict?: PointerEventInit) {
      super(type, eventInitDict)
    }
  } as any
})

// Cleanup after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  
  // Reset localStorage
  if (window.localStorage && window.localStorage.clear) {
    window.localStorage.clear()
  }
  
  // Reset viewport
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,
  })
  
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 768,
  })
})

// Global utilities for tests
declare global {
  interface Window {
    __TEST_UTILS__: {
      setMobileViewport: () => void
      setDesktopViewport: () => void
      setTabletViewport: () => void
      triggerResize: () => void
    }
  }
}

// Test utilities
window.__TEST_UTILS__ = {
  setMobileViewport: () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 667,
    })
    window.dispatchEvent(new Event('resize'))
  },
  
  setTabletViewport: () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1024,
    })
    window.dispatchEvent(new Event('resize'))
  },
  
  setDesktopViewport: () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    })
    window.dispatchEvent(new Event('resize'))
  },
  
  triggerResize: () => {
    window.dispatchEvent(new Event('resize'))
  },
}

// Mock HeroUI providers and components
vi.mock('@heroui/system', () => ({
  NextUIProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Polyfill for tests that might need it
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.IS_REACT_ACT_ENVIRONMENT = true
}
