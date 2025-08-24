import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { KeyboardHandler } from './KeyboardHandler'
import { useMapStore } from '@/stores/mapStore'

// Mock the store
vi.mock('@/stores/mapStore')

describe('KeyboardHandler', () => {
  const mockUndo = vi.fn()
  const mockRedo = vi.fn()
  const mockCanUndo = vi.fn()
  const mockCanRedo = vi.fn()

  beforeEach(() => {
    vi.mocked(useMapStore).mockReturnValue({
      undo: mockUndo,
      redo: mockRedo,
      canUndo: mockCanUndo,
      canRedo: mockCanRedo,
      map: null,
      selectedId: null,
      history: [],
      historyIndex: -1,
      setMap: vi.fn(),
      updateMap: vi.fn(),
      select: vi.fn(),
      addToHistory: vi.fn(),
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render children', () => {
    render(
      <KeyboardHandler>
        <div data-testid="test-child">Test Child</div>
      </KeyboardHandler>
    )

    expect(document.querySelector('[data-testid="test-child"]')).toBeInTheDocument()
  })

  it('should handle Ctrl+Z for undo when undo is available', async () => {
    const user = userEvent.setup()
    mockCanUndo.mockReturnValue(true)

    render(
      <KeyboardHandler>
        <div>Test</div>
      </KeyboardHandler>
    )

    await user.keyboard('{Control>}z{/Control}')

    expect(mockUndo).toHaveBeenCalled()
  })

  it('should not handle Ctrl+Z when undo is not available', async () => {
    const user = userEvent.setup()
    mockCanUndo.mockReturnValue(false)

    render(
      <KeyboardHandler>
        <div>Test</div>
      </KeyboardHandler>
    )

    await user.keyboard('{Control>}z{/Control}')

    expect(mockUndo).not.toHaveBeenCalled()
  })

  it('should handle Ctrl+Shift+Z for redo when redo is available', async () => {
    const user = userEvent.setup()
    mockCanRedo.mockReturnValue(true)

    render(
      <KeyboardHandler>
        <div>Test</div>
      </KeyboardHandler>
    )

    await user.keyboard('{Control>}{Shift>}z{/Shift}{/Control}')

    expect(mockRedo).toHaveBeenCalled()
  })

  it('should handle Ctrl+Y for redo when redo is available', async () => {
    const user = userEvent.setup()
    mockCanRedo.mockReturnValue(true)

    render(
      <KeyboardHandler>
        <div>Test</div>
      </KeyboardHandler>
    )

    await user.keyboard('{Control>}y{/Control}')

    expect(mockRedo).toHaveBeenCalled()
  })

  it('should not handle redo when redo is not available', async () => {
    const user = userEvent.setup()
    mockCanRedo.mockReturnValue(false)

    render(
      <KeyboardHandler>
        <div>Test</div>
      </KeyboardHandler>
    )

    await user.keyboard('{Control>}y{/Control}')

    expect(mockRedo).not.toHaveBeenCalled()
  })

  it('should handle "f" key for fit to screen', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const user = userEvent.setup()

    render(
      <KeyboardHandler>
        <div>Test</div>
      </KeyboardHandler>
    )

    await user.keyboard('f')

    expect(consoleSpy).toHaveBeenCalledWith('Fit to screen triggered')
    
    consoleSpy.mockRestore()
  })

  it('should handle "c" key for center on selection', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const user = userEvent.setup()

    render(
      <KeyboardHandler>
        <div>Test</div>
      </KeyboardHandler>
    )

    await user.keyboard('c')

    expect(consoleSpy).toHaveBeenCalledWith('Center on selection triggered')
    
    consoleSpy.mockRestore()
  })

  it('should handle Ctrl+0 for fit to screen', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const user = userEvent.setup()

    render(
      <KeyboardHandler>
        <div>Test</div>
      </KeyboardHandler>
    )

    await user.keyboard('{Control>}0{/Control}')

    expect(consoleSpy).toHaveBeenCalledWith('Fit to screen (Ctrl+0) triggered')
    
    consoleSpy.mockRestore()
  })

  it('should handle Ctrl+Plus for zoom in', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const user = userEvent.setup()

    render(
      <KeyboardHandler>
        <div>Test</div>
      </KeyboardHandler>
    )

    await user.keyboard('{Control>}+{/Control}')

    expect(consoleSpy).toHaveBeenCalledWith('Zoom in triggered')
    
    consoleSpy.mockRestore()
  })

  it('should handle Ctrl+Equals for zoom in', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const user = userEvent.setup()

    render(
      <KeyboardHandler>
        <div>Test</div>
      </KeyboardHandler>
    )

    await user.keyboard('{Control>}={/Control}')

    expect(consoleSpy).toHaveBeenCalledWith('Zoom in triggered')
    
    consoleSpy.mockRestore()
  })

  it('should handle Ctrl+Minus for zoom out', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const user = userEvent.setup()

    render(
      <KeyboardHandler>
        <div>Test</div>
      </KeyboardHandler>
    )

    await user.keyboard('{Control>}-{/Control}')

    expect(consoleSpy).toHaveBeenCalledWith('Zoom out triggered')
    
    consoleSpy.mockRestore()
  })

  it('should not interfere with Ctrl+F (browser find)', async () => {
    const user = userEvent.setup()

    render(
      <KeyboardHandler>
        <div>Test</div>
      </KeyboardHandler>
    )

    // This should not trigger our handlers since we don't handle Ctrl+F
    await user.keyboard('{Control>}f{/Control}')

    expect(mockUndo).not.toHaveBeenCalled()
    expect(mockRedo).not.toHaveBeenCalled()
  })

  it('should not handle keys when Ctrl is pressed with f or c', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const user = userEvent.setup()

    render(
      <KeyboardHandler>
        <div>Test</div>
      </KeyboardHandler>
    )

    await user.keyboard('{Control>}f{/Control}')
    await user.keyboard('{Control>}c{/Control}')

    expect(consoleSpy).not.toHaveBeenCalledWith('Fit to screen triggered')
    expect(consoleSpy).not.toHaveBeenCalledWith('Center on selection triggered')
    
    consoleSpy.mockRestore()
  })
})