import { renderHook, act } from '@testing-library/react'
import { useUIStore } from './uiStore'

describe('useUIStore', () => {
  beforeEach(() => {
    useUIStore.setState({
      theme: 'system',
      sidebarOpen: true,
      inspectorOpen: false,
      canvasZoom: 1,
      canvasPan: { x: 0, y: 0 },
    })
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useUIStore())
    
    expect(result.current.theme).toBe('system')
    expect(result.current.sidebarOpen).toBe(true)
    expect(result.current.inspectorOpen).toBe(false)
    expect(result.current.canvasZoom).toBe(1)
    expect(result.current.canvasPan).toEqual({ x: 0, y: 0 })
  })

  it('should update theme setting', () => {
    const { result } = renderHook(() => useUIStore())

    act(() => {
      result.current.setTheme('dark')
    })

    expect(result.current.theme).toBe('dark')

    act(() => {
      result.current.setTheme('light')
    })

    expect(result.current.theme).toBe('light')
  })

  it('should toggle sidebar state', () => {
    const { result } = renderHook(() => useUIStore())

    act(() => {
      result.current.setSidebarOpen(false)
    })

    expect(result.current.sidebarOpen).toBe(false)

    act(() => {
      result.current.setSidebarOpen(true)
    })

    expect(result.current.sidebarOpen).toBe(true)
  })

  it('should toggle inspector state', () => {
    const { result } = renderHook(() => useUIStore())

    act(() => {
      result.current.setInspectorOpen(true)
    })

    expect(result.current.inspectorOpen).toBe(true)

    act(() => {
      result.current.setInspectorOpen(false)
    })

    expect(result.current.inspectorOpen).toBe(false)
  })

  it('should update canvas zoom', () => {
    const { result } = renderHook(() => useUIStore())

    act(() => {
      result.current.setCanvasZoom(1.5)
    })

    expect(result.current.canvasZoom).toBe(1.5)

    act(() => {
      result.current.setCanvasZoom(0.8)
    })

    expect(result.current.canvasZoom).toBe(0.8)
  })

  it('should update canvas pan position', () => {
    const { result } = renderHook(() => useUIStore())

    act(() => {
      result.current.setCanvasPan({ x: 100, y: 200 })
    })

    expect(result.current.canvasPan).toEqual({ x: 100, y: 200 })
  })

  it('should reset canvas view', () => {
    const { result } = renderHook(() => useUIStore())

    // Set some values first
    act(() => {
      result.current.setCanvasZoom(2.0)
      result.current.setCanvasPan({ x: 500, y: 300 })
    })

    expect(result.current.canvasZoom).toBe(2.0)
    expect(result.current.canvasPan).toEqual({ x: 500, y: 300 })

    // Reset
    act(() => {
      result.current.resetCanvasView()
    })

    expect(result.current.canvasZoom).toBe(1)
    expect(result.current.canvasPan).toEqual({ x: 0, y: 0 })
  })
})