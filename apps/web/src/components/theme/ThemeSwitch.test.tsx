import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeSwitch } from './ThemeSwitch'
import { useUIStore } from '@/stores/uiStore'

// Mock the store
vi.mock('@/stores/uiStore')

describe('ThemeSwitch', () => {
  const mockSetTheme = vi.fn()

  beforeEach(() => {
    vi.mocked(useUIStore).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
      sidebarOpen: true,
      inspectorOpen: false,
      canvasZoom: 1,
      canvasPan: { x: 0, y: 0 },
      setSidebarOpen: vi.fn(),
      setInspectorOpen: vi.fn(),
      setCanvasZoom: vi.fn(),
      setCanvasPan: vi.fn(),
      resetCanvasView: vi.fn(),
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render theme switch', () => {
    render(<ThemeSwitch />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeInTheDocument()
  })

  it('should show light theme as unselected', () => {
    vi.mocked(useUIStore).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
      sidebarOpen: true,
      inspectorOpen: false,
      canvasZoom: 1,
      canvasPan: { x: 0, y: 0 },
      setSidebarOpen: vi.fn(),
      setInspectorOpen: vi.fn(),
      setCanvasZoom: vi.fn(),
      setCanvasPan: vi.fn(),
      resetCanvasView: vi.fn(),
    })

    render(<ThemeSwitch />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).not.toBeChecked()
  })

  it('should show dark theme as selected', () => {
    vi.mocked(useUIStore).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
      sidebarOpen: true,
      inspectorOpen: false,
      canvasZoom: 1,
      canvasPan: { x: 0, y: 0 },
      setSidebarOpen: vi.fn(),
      setInspectorOpen: vi.fn(),
      setCanvasZoom: vi.fn(),
      setCanvasPan: vi.fn(),
      resetCanvasView: vi.fn(),
    })

    render(<ThemeSwitch />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeChecked()
  })

  it('should call setTheme when toggled to dark', async () => {
    const user = userEvent.setup()
    
    render(<ThemeSwitch />)
    
    const switchElement = screen.getByRole('switch')
    await user.click(switchElement)
    
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('should call setTheme when toggled to light', async () => {
    const user = userEvent.setup()
    
    vi.mocked(useUIStore).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
      sidebarOpen: true,
      inspectorOpen: false,
      canvasZoom: 1,
      canvasPan: { x: 0, y: 0 },
      setSidebarOpen: vi.fn(),
      setInspectorOpen: vi.fn(),
      setCanvasZoom: vi.fn(),
      setCanvasPan: vi.fn(),
      resetCanvasView: vi.fn(),
    })

    render(<ThemeSwitch />)
    
    const switchElement = screen.getByRole('switch')
    await user.click(switchElement)
    
    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('should handle system theme preference', () => {
    // Mock system preference for dark mode
    vi.mocked(global.matchMedia).mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    vi.mocked(useUIStore).mockReturnValue({
      theme: 'system',
      setTheme: mockSetTheme,
      sidebarOpen: true,
      inspectorOpen: false,
      canvasZoom: 1,
      canvasPan: { x: 0, y: 0 },
      setSidebarOpen: vi.fn(),
      setInspectorOpen: vi.fn(),
      setCanvasZoom: vi.fn(),
      setCanvasPan: vi.fn(),
      resetCanvasView: vi.fn(),
    })

    render(<ThemeSwitch />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeChecked() // Should be checked because system prefers dark
  })
})