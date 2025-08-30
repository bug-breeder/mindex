import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import AppLayout from '@/layouts/AppLayout'
import { Spinner } from '@heroui/spinner'
import { MindCanvas } from '@/components/canvas'
import { KeyboardHandler } from '@/components/keyboard'
import { useMapStore } from '@/stores/mapStore'
import { useMap, useSaveMap } from '@/api/maps'
import type { MindMapJson } from '@/stores/mapStore'

export default function MapEditorPage() {
  const { id } = useParams<{ id: string }>()
  const { map, setMap } = useMapStore()
  const [, setMindElixirInstance] = useState<unknown>(null)
  
  // Fetch map from Supabase
  const { data: mapData, isLoading, error } = useMap(id || '')
  const saveMapMutation = useSaveMap()

  // Get title and folder from URL params if provided
  const urlParams = new URLSearchParams(window.location.search)
  const titleFromUrl = urlParams.get('title')
  const folderIdFromUrl = urlParams.get('folderId')

  // Load map data from Supabase or create new map
  useEffect(() => {
    if (mapData && mapData.root) {
      setMap(mapData.root as MindMapJson)
    } else if (!isLoading && !mapData && id) {
      // Create new map if it doesn't exist
      const newMap: MindMapJson = {
        id: id,
        title: titleFromUrl || 'New Mind Map',
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
  }, [mapData, isLoading, id, setMap, titleFromUrl])

  // Auto-save when map changes
  useEffect(() => {
    if (!map || !id) return
    
    const timeoutId = setTimeout(() => {
      // Include folder ID only for new maps (when coming from URL params)
      const saveData: { id: string; map: MindMapJson; folderId?: string } = { id, map }
      if (folderIdFromUrl && !mapData) {
        // This is a new map being created with a folder assignment
        saveData.folderId = folderIdFromUrl
      }
      
      saveMapMutation.mutate(
        saveData,
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
  }, [map, id, saveMapMutation, folderIdFromUrl, mapData])

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <Spinner />
        </div>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full text-center">
          <div>
            <p className="text-danger mb-2">Failed to load map</p>
            <p className="text-default-500 text-sm">{error.message}</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <KeyboardHandler>
      <AppLayout>
        <MindCanvas 
          data={map} 
          className="w-full h-full" 
          onInstanceReady={setMindElixirInstance}
        />
      </AppLayout>
    </KeyboardHandler>
  )
}