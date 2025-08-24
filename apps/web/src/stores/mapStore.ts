import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'

export interface MindMapNode {
  id: string
  topic: string
  expanded?: boolean
  notes?: string
  url?: string
  tags?: string[]
  meta?: {
    timecode?: number
    sourceSpan?: { start: number; end: number }
  }
  children?: MindMapNode[]
}

export interface MindMapJson {
  id: string
  title: string
  root: MindMapNode
  theme?: {
    layout?: 'right-balanced' | 'left' | 'right'
    branchPalette?: 'semantic' | 'rainbow'
  }
}

interface MapState {
  map: MindMapJson | null
  selectedId: string | null
  history: MindMapJson[]
  historyIndex: number
  setMap: (map: MindMapJson) => void
  updateMap: (updater: (map: MindMapJson) => MindMapJson) => void
  select: (id: string | null) => void
  addToHistory: (map: MindMapJson) => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
}

export const useMapStore = create<MapState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      map: null,
      selectedId: null,
      history: [],
      historyIndex: -1,
      
      setMap: (map) => {
        set({ map }, false, 'setMap')
        get().addToHistory(map)
      },
      
      updateMap: (updater) => {
        const currentMap = get().map
        if (!currentMap) return
        
        const newMap = updater(currentMap)
        set({ map: newMap }, false, 'updateMap')
        get().addToHistory(newMap)
      },
      
      select: (id) => set({ selectedId: id }, false, 'select'),
      
      addToHistory: (map) => {
        const { history, historyIndex } = get()
        const newHistory = history.slice(0, historyIndex + 1)
        newHistory.push(map)
        
        // Keep only last 50 history items
        if (newHistory.length > 50) {
          newHistory.shift()
        } else {
          set({ 
            history: newHistory, 
            historyIndex: newHistory.length - 1 
          }, false, 'addToHistory')
        }
      },
      
      undo: () => {
        const { history, historyIndex } = get()
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1
          set({
            map: history[newIndex],
            historyIndex: newIndex,
          }, false, 'undo')
        }
      },
      
      redo: () => {
        const { history, historyIndex } = get()
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1
          set({
            map: history[newIndex],
            historyIndex: newIndex,
          }, false, 'redo')
        }
      },
      
      canUndo: () => get().historyIndex > 0,
      canRedo: () => get().historyIndex < get().history.length - 1,
    })),
    { name: 'map-store' }
  )
)