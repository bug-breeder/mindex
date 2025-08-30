import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMapStore } from './mapStore'
import type { MindMapJson } from './mapStore'

describe('useMapStore', () => {
  beforeEach(() => {
    useMapStore.setState({
      map: null,
      selectedId: null,
      history: [],
      historyIndex: -1,
    })
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useMapStore())
    
    expect(result.current.map).toBeNull()
    expect(result.current.selectedId).toBeNull()
    expect(result.current.history).toEqual([])
    expect(result.current.historyIndex).toBe(-1)
    expect(result.current.canUndo()).toBe(false)
    expect(result.current.canRedo()).toBe(false)
  })

  it('should set a map and add it to history', () => {
    const { result } = renderHook(() => useMapStore())
    const testMap: MindMapJson = {
      id: 'test-map',
      title: 'Test Map',
      root: {
        id: 'root',
        topic: 'Test Root',
        expanded: true,
        children: []
      }
    }

    act(() => {
      result.current.setMap(testMap)
    })

    expect(result.current.map).toEqual(testMap)
    expect(result.current.history).toHaveLength(1)
    expect(result.current.historyIndex).toBe(0)
    expect(result.current.canUndo()).toBe(false) // Only one item in history
    expect(result.current.canRedo()).toBe(false)
  })

  it('should update a map and track history', () => {
    const { result } = renderHook(() => useMapStore())
    const initialMap: MindMapJson = {
      id: 'test-map',
      title: 'Test Map',
      root: {
        id: 'root',
        topic: 'Initial Topic',
        expanded: true,
        children: []
      }
    }

    act(() => {
      result.current.setMap(initialMap)
    })

    act(() => {
      result.current.updateMap((map) => ({
        ...map,
        root: {
          ...map.root,
          topic: 'Updated Topic'
        }
      }))
    })

    expect(result.current.map?.root.topic).toBe('Updated Topic')
    expect(result.current.history).toHaveLength(2)
    expect(result.current.historyIndex).toBe(1)
    expect(result.current.canUndo()).toBe(true)
    expect(result.current.canRedo()).toBe(false)
  })

  it('should handle undo and redo operations', () => {
    const { result } = renderHook(() => useMapStore())
    const initialMap: MindMapJson = {
      id: 'test-map',
      title: 'Test Map',
      root: {
        id: 'root',
        topic: 'Initial',
        expanded: true,
        children: []
      }
    }

    // Set initial map
    act(() => {
      result.current.setMap(initialMap)
    })

    // Update map
    act(() => {
      result.current.updateMap((map) => ({
        ...map,
        root: { ...map.root, topic: 'Updated' }
      }))
    })

    expect(result.current.map?.root.topic).toBe('Updated')

    // Undo
    act(() => {
      result.current.undo()
    })

    expect(result.current.map?.root.topic).toBe('Initial')
    expect(result.current.canUndo()).toBe(false)
    expect(result.current.canRedo()).toBe(true)

    // Redo
    act(() => {
      result.current.redo()
    })

    expect(result.current.map?.root.topic).toBe('Updated')
    expect(result.current.canUndo()).toBe(true)
    expect(result.current.canRedo()).toBe(false)
  })

  it('should handle node selection', () => {
    const { result } = renderHook(() => useMapStore())

    act(() => {
      result.current.select('node-123')
    })

    expect(result.current.selectedId).toBe('node-123')

    act(() => {
      result.current.select(null)
    })

    expect(result.current.selectedId).toBeNull()
  })

  it('should limit history to 50 items', () => {
    const { result } = renderHook(() => useMapStore())
    const initialMap: MindMapJson = {
      id: 'test-map',
      title: 'Test Map',
      root: {
        id: 'root',
        topic: 'Initial',
        expanded: true,
        children: []
      }
    }

    // Add 52 items to history (initial + 51 updates)
    act(() => {
      result.current.setMap(initialMap)
      
      for (let i = 0; i < 51; i++) {
        result.current.updateMap((map) => ({
          ...map,
          root: { ...map.root, topic: `Update ${i}` }
        }))
      }
    })

    // History should be limited to 50 items
    expect(result.current.history.length).toBeLessThanOrEqual(50)
  })
})