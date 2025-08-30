import '@testing-library/jest-dom'

// Mock Mind-Elixir for tests
vi.mock('mind-elixir', () => {
  const MockMindElixir = vi.fn().mockImplementation(() => ({
    init: vi.fn(),
    destroy: vi.fn(),
    getData: vi.fn().mockReturnValue({ id: 'root', topic: 'Test', children: [] }),
    refresh: vi.fn(),
    findNodeById: vi.fn().mockReturnValue({ id: 'test' }),
    selectNode: vi.fn(),
    exportPng: vi.fn(),
    exportSvg: vi.fn(),
    bus: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
    },
  }))
  
  MockMindElixir.direction = { RIGHT: 0, LEFT: 1 }
  
  return {
    default: MockMindElixir,
  }
})

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
    })),
  })),
}))

// Mock CSS imports
vi.mock('mind-elixir/style.css', () => ({}))

// Global test utilities
window.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

window.matchMedia = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))

// Mock URL methods
window.URL.createObjectURL = vi.fn()
window.URL.revokeObjectURL = vi.fn()

// Mock Blob
window.Blob = vi.fn().mockImplementation((content, options) => ({
  content,
  options,
  size: content?.[0]?.length || 0,
  type: options?.type || '',
}))
