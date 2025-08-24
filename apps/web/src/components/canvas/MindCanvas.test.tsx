import { render, waitFor } from '@testing-library/react'
import { MindCanvas } from './MindCanvas'
import type { MindMapJson } from '@/stores/mapStore'
import { useMapStore } from '@/stores/mapStore'

// Mock the store
vi.mock('@/stores/mapStore')

describe('MindCanvas', () => {
  const mockUpdateMap = vi.fn()
  const mockSelect = vi.fn()

  beforeEach(() => {
    vi.mocked(useMapStore).mockReturnValue({
      updateMap: mockUpdateMap,
      select: mockSelect,
      selectedId: null,
      map: null,
      setMap: vi.fn(),
      history: [],
      historyIndex: -1,
      addToHistory: vi.fn(),
      undo: vi.fn(),
      redo: vi.fn(),
      canUndo: vi.fn().mockReturnValue(false),
      canRedo: vi.fn().mockReturnValue(false),
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render mind canvas container', () => {
    const { container } = render(<MindCanvas />)
    
    const canvasContainer = container.firstChild as HTMLElement
    expect(canvasContainer).toHaveClass('bg-background')
    expect(canvasContainer).toHaveClass('text-foreground')
  })

  it('should initialize Mind-Elixir when mounted', async () => {
    const mockOnInstanceReady = vi.fn()
    
    render(<MindCanvas onInstanceReady={mockOnInstanceReady} />)
    
    await waitFor(() => {
      expect(mockOnInstanceReady).toHaveBeenCalled()
    })
  })

  it('should use provided data for initialization', async () => {
    const testData: MindMapJson = {
      id: 'test-map',
      title: 'Test Map',
      root: {
        id: 'root',
        topic: 'Test Topic',
        expanded: true,
        children: [
          { id: 'child1', topic: 'Child 1', children: [] }
        ]
      }
    }

    const mockOnInstanceReady = vi.fn()
    
    render(
      <MindCanvas 
        data={testData} 
        onInstanceReady={mockOnInstanceReady}
      />
    )
    
    await waitFor(() => {
      expect(mockOnInstanceReady).toHaveBeenCalled()
    })
  })

  it('should apply custom className', () => {
    const { container } = render(<MindCanvas className="custom-class" />)
    
    const canvasContainer = container.firstChild as HTMLElement
    expect(canvasContainer).toHaveClass('custom-class')
  })

  it('should handle missing data gracefully', () => {
    const mockOnInstanceReady = vi.fn()
    
    expect(() => {
      render(<MindCanvas data={null} onInstanceReady={mockOnInstanceReady} />)
    }).not.toThrow()
  })

  it('should use default data when no data provided', async () => {
    const mockOnInstanceReady = vi.fn()
    
    render(<MindCanvas onInstanceReady={mockOnInstanceReady} />)
    
    await waitFor(() => {
      expect(mockOnInstanceReady).toHaveBeenCalled()
    })
  })
})