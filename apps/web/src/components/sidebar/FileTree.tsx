import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown'

import { addToast } from '@heroui/toast'
import { useMaps, useUpdateMapTitle, useDeleteMap, useMap } from '@/api/maps'
import { XMarkIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { previewCache } from '@/utils/previewCache'

interface FileTreeProps {
  onClose?: () => void
}

// Component for individual map item with large preview and title below
function MapItem({ map, onEdit, onDelete, onSelect }: {
  map: any
  onEdit: (id: string, title: string) => void
  onDelete: (id: string) => void
  onSelect: (id: string) => void
}) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editingTitle, setEditingTitle] = useState(map.title)
  const { data: mapData } = useMap(map.id)
  
  // Generate preview when map data is available
  useEffect(() => {
    if (mapData?.root) {
      previewCache.getPreview(map.id, mapData.root, map.updated_at)
        .then(setPreview)
        .catch(() => {
          // Use a simple fallback since getFallbackPreview is private
          setPreview('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDE2MCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y4ZmFmYyIgcng9IjgiLz4KICA8dGV4dCB4PSI4MCIgeT0iNTAiIGZpbGw9IiM2MzY2ZjEiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtZmFtaWx5PSJzeXN0ZW0tdWkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1pbmQgTWFwPC90ZXh0Pgo8L3N2Zz4=')
        })
    }
  }, [map.id, map.updated_at, mapData])

  const handleEditStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditingTitle(true)
    setEditingTitle(map.title)
  }

  const handleEditCancel = () => {
    setIsEditingTitle(false)
    setEditingTitle(map.title)
  }

  const handleEditSave = () => {
    if (editingTitle.trim() && editingTitle !== map.title) {
      onEdit(map.id, editingTitle.trim())
    }
    setIsEditingTitle(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSave()
    } else if (e.key === 'Escape') {
      handleEditCancel()
    }
  }

  const handleDropdownAction = (action: string) => {
    switch (action) {
      case 'rename':
        handleEditStart(new MouseEvent('click') as any)
        break
      case 'delete':
        onDelete(map.id)
        break
    }
  }

  return (
    <div className="group p-2 hover:bg-default-100 rounded-lg transition-colors">
      {/* Large Preview Image */}
      <div 
        className="relative w-full h-20 rounded-lg overflow-hidden border border-default-200 shadow-sm bg-gray-50 cursor-pointer hover:shadow-md transition-shadow mb-2"
        onClick={() => onSelect(map.id)}
      >
        {preview ? (
          <img 
            src={preview} 
            alt={`Preview of ${map.title}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-xs">Loading...</div>
          </div>
        )}
        
        {/* Actions Dropdown - positioned over the image */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="solid" 
                color="default"
                isIconOnly
                size="sm"
                className="bg-white/90 backdrop-blur-sm shadow-sm h-6 w-6 min-w-6"
              >
                <EllipsisVerticalIcon className="w-3 h-3" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu onAction={(key) => handleDropdownAction(key as string)}>
              <DropdownItem key="rename">Rename</DropdownItem>
              <DropdownItem key="delete" className="text-danger" color="danger">
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* Title and Details Below Image */}
      <div className="w-full">
        {isEditingTitle ? (
          <Input
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleEditSave}
            autoFocus
            size="sm"
            classNames={{
              base: "w-full",
              inputWrapper: "bg-transparent shadow-none border border-default-300",
              input: "bg-transparent text-sm"
            }}
          />
        ) : (
          <div 
            className="cursor-pointer select-none"
            onClick={() => onSelect(map.id)}
            onDoubleClick={handleEditStart}
          >
            <div className="flex items-center justify-between gap-2 px-2">
              <div className="font-medium text-sm text-foreground truncate">
                {map.title || 'Untitled Map'}
              </div>
              <div className="text-xs text-default-500 flex-shrink-0">
                {new Date(map.updated_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function FileTree({ onClose }: FileTreeProps) {
  const navigate = useNavigate()
  const { data: maps, isLoading } = useMaps()
  const updateTitleMutation = useUpdateMapTitle()
  const deleteMapMutation = useDeleteMap()




  const handleMapSelect = (mapId: string) => {
    navigate(`/maps/${mapId}`)
    onClose?.()
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Maps</h2>
        {onClose && (
          <Button 
            isIconOnly 
            variant="light" 
            size="sm"
            onPress={onClose}
          >
            <XMarkIcon className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div 
        className="flex-1 max-h-96 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-default-300 scrollbar-track-transparent hover:scrollbar-thumb-default-400"
        onWheel={(e) => {
          // Stop wheel events from bubbling to prevent conflicts with Mind-Elixir
          e.stopPropagation()
        }}
      >
        {isLoading ? (
          <div className="text-sm text-default-500 py-4">Loading...</div>
        ) : maps && maps.length > 0 ? (
          <div className="space-y-3 px-2">
            {maps.map((m: any) => (
              <MapItem
                key={m.id}
                map={m}
                onEdit={(id, title) => {
                  updateTitleMutation.mutate({ id, title }, {
                    onSuccess: () => {
                      addToast({
                        title: 'Success',
                        description: 'Map renamed successfully',
                        color: 'success'
                      })
                    },
                    onError: () => {
                      addToast({
                        title: 'Error',
                        description: 'Failed to rename map',
                        color: 'danger'
                      })
                    }
                  })
                }}
                onDelete={(id) => {
                  deleteMapMutation.mutate(id, {
                    onSuccess: () => {
                      addToast({
                        title: 'Success',
                        description: 'Map deleted successfully',
                        color: 'success'
                      })
                    },
                    onError: () => {
                      addToast({
                        title: 'Error',
                        description: 'Failed to delete map',
                        color: 'danger'
                      })
                    }
                  })
                }}
                onSelect={handleMapSelect}
              />
            ))}
          </div>
        ) : (
          <div className="text-sm text-default-500 text-center py-4">
            No maps yet
          </div>
        )}
      </div>
    </div>
  )
}


