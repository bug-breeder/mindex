import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface UIState {
  theme: 'light' | 'dark' | 'system'
  sidebarOpen: boolean
  inspectorOpen: boolean
  canvasZoom: number
  canvasPan: { x: number; y: number }
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setSidebarOpen: (open: boolean) => void
  setInspectorOpen: (open: boolean) => void
  setCanvasZoom: (zoom: number) => void
  setCanvasPan: (pan: { x: number; y: number }) => void
  resetCanvasView: () => void
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        theme: 'system',
        sidebarOpen: true,
        inspectorOpen: false,
        canvasZoom: 1,
        canvasPan: { x: 0, y: 0 },
        
        setTheme: (theme) => set({ theme }, false, 'setTheme'),
        setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }, false, 'setSidebarOpen'),
        setInspectorOpen: (inspectorOpen) => set({ inspectorOpen }, false, 'setInspectorOpen'),
        setCanvasZoom: (canvasZoom) => set({ canvasZoom }, false, 'setCanvasZoom'),
        setCanvasPan: (canvasPan) => set({ canvasPan }, false, 'setCanvasPan'),
        resetCanvasView: () => set({ 
          canvasZoom: 1, 
          canvasPan: { x: 0, y: 0 } 
        }, false, 'resetCanvasView'),
      }),
      {
        name: 'ui-store',
        partialize: (state) => ({ theme: state.theme, sidebarOpen: state.sidebarOpen }),
      }
    ),
    { name: 'ui-store' }
  )
)