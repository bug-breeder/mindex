import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import DefaultLayout from '@/layouts/default'
import { MindCanvas } from '@/components/canvas'
import { KeyboardHandler } from '@/components/keyboard'
import { ExportDialog } from '@/components/export'
import { useMapStore } from '@/stores/mapStore'
import { useMap, useSaveMap } from '@/api/maps'
import type { MindMapJson } from '@/stores/mapStore'

export default function MapEditorPage() {
  const { id } = useParams<{ id: string }>()
  const { map, setMap, canUndo, canRedo, undo, redo } = useMapStore()
  const [mindElixirInstance, setMindElixirInstance] = useState<any>(null)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  
  // Fetch map from Supabase
  const { data: mapData, isLoading, error } = useMap(id || '')
  const saveMapMutation = useSaveMap()

  // Load map data from Supabase or create new map
  useEffect(() => {
    if (mapData && mapData.root) {
      setMap(mapData.root as MindMapJson)
    } else if (!isLoading && !mapData && id) {
      // Create new map if it doesn't exist
      const newMap: MindMapJson = {
        id: id,
        title: 'New Mind Map',
        root: {
          id: 'root',
          topic: 'Mind Map',
          expanded: true,
          children: [
            {
              id: 'child1',
              topic: 'Ideas',
              expanded: true,
              children: [
                { id: 'grandchild1', topic: 'Brainstorm', children: [] },
                { id: 'grandchild2', topic: 'Research', children: [] }
              ]
            },
            {
              id: 'child2', 
              topic: 'Tasks',
              expanded: true,
              children: [
                { id: 'grandchild3', topic: 'Plan', children: [] },
                { id: 'grandchild4', topic: 'Execute', children: [] }
              ]
            }
          ]
        },
        theme: {
          layout: 'right-balanced',
          branchPalette: 'semantic'
        }
      }
      setMap(newMap)
    }
  }, [mapData, isLoading, id, setMap])

  // Auto-save when map changes
  useEffect(() => {
    if (!map || !id) return
    
    const timeoutId = setTimeout(() => {
      saveMapMutation.mutate(
        { id, map },
        {
          onSuccess: () => {
            console.log('Map auto-saved successfully')
          },
          onError: (error) => {
            console.error('Failed to auto-save map:', error)
          },
        }
      )
    }, 1000) // Debounce auto-save by 1 second
    
    return () => clearTimeout(timeoutId)
  }, [map, id, saveMapMutation])

  const handleExport = () => {
    setIsExportDialogOpen(true)
  }

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-on-surface/70">Loading map...</p>
          </div>
        </div>
      </DefaultLayout>
    )
  }

  if (error) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-red-500 mb-4">Failed to load map</p>
            <p className="text-on-surface/70 text-sm">{error.message}</p>
          </div>
        </div>
      </DefaultLayout>
    )
  }

  return (
    <KeyboardHandler>
      <DefaultLayout>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-outline bg-surface">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-on-surface">
                {map?.title || 'Mind Map Editor'}
              </h1>
              <span className="text-sm text-on-surface/70">Map ID: {id}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={undo}
                disabled={!canUndo()}
                className="px-3 py-1 text-sm border border-outline rounded disabled:opacity-50 hover:bg-outline/10"
                title="Undo (Ctrl+Z)"
              >
                ↶
              </button>
              <button 
                onClick={redo}
                disabled={!canRedo()}
                className="px-3 py-1 text-sm border border-outline rounded disabled:opacity-50 hover:bg-outline/10"
                title="Redo (Ctrl+Shift+Z)"
              >
                ↷
              </button>
              <button 
                onClick={handleExport}
                className="px-3 py-1 text-sm border border-outline rounded hover:bg-outline/10"
              >
                Export
              </button>
              <div className="px-3 py-1 text-sm text-on-surface/70">
                {saveMapMutation.isPending ? 'Saving...' : 'Auto-saved'}
              </div>
            </div>
          </div>
          
          {/* Canvas Area */}
          <div className="flex-1 relative">
            <MindCanvas 
              data={map} 
              className="w-full h-full" 
              onInstanceReady={setMindElixirInstance}
            />
          </div>
        </div>
        
        {/* Export Dialog */}
        <ExportDialog
          isOpen={isExportDialogOpen}
          onClose={() => setIsExportDialogOpen(false)}
          map={map}
          mindElixirInstance={mindElixirInstance}
        />
      </DefaultLayout>
    </KeyboardHandler>
  )
}