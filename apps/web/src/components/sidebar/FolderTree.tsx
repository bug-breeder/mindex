import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection } from '@heroui/dropdown'
import { useFolderHierarchy, useUpdateFolder } from '@/api/folders'
import { useDeleteMap, useUpdateMapTitle } from '@/api/maps'
import { CreateFolderDialog } from '@/components/folders/CreateFolderDialog'
import { EditFolderDialog } from '@/components/folders/EditFolderDialog'
import { DeleteFolderDialog } from '@/components/folders/DeleteFolderDialog'
import { MoveFolderDialog } from '@/components/folders/MoveFolderDialog'
import { NewMapDialog } from '@/components/NewMapDialog'
import type { Folder, FolderWithChildren } from '@/types'
import { 
  XMarkIcon, 
  EllipsisVerticalIcon,
  DocumentIcon,
  FolderIcon,
  FolderOpenIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FolderPlusIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

// Simplified interface for tree display
interface TreeMindMap {
  id: string
  title: string
  folder_id?: string
  sort_order: number
  created_at: string
  updated_at: string
}

interface FolderTreeProps {
  onClose?: () => void
}

export function FolderTree({ onClose }: FolderTreeProps) {
  const navigate = useNavigate()
  const { data: hierarchyData, isLoading } = useFolderHierarchy()
  const updateFolder = useUpdateFolder()
  const deleteMapMutation = useDeleteMap()
  const updateTitleMutation = useUpdateMapTitle()

  // Dialog states
  const [createFolderDialog, setCreateFolderDialog] = useState<{
    isOpen: boolean
    parentId?: string
  }>({ isOpen: false })
  const [editFolderDialog, setEditFolderDialog] = useState<{
    isOpen: boolean
    folder: Folder | null
  }>({ isOpen: false, folder: null })
  const [deleteFolderDialog, setDeleteFolderDialog] = useState<{
    isOpen: boolean
    folder: Folder | null
  }>({ isOpen: false, folder: null })
  const [newMapDialog, setNewMapDialog] = useState<{
    isOpen: boolean
    folderId?: string
    folderName?: string
  }>({ isOpen: false })
  const [moveFolderDialog, setMoveFolderDialog] = useState<{
    isOpen: boolean
    mindMap: TreeMindMap | null
  }>({ isOpen: false, mindMap: null })

  // Editing states
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  const handleFolderToggle = async (folder: FolderWithChildren) => {
    try {
      await updateFolder.mutateAsync({
        id: folder.id,
        data: { is_expanded: !folder.is_expanded }
      })
    } catch (error) {
      console.error('Failed to toggle folder:', error)
    }
  }

  const handleItemClick = (item: FolderWithChildren | TreeMindMap, type: 'folder' | 'mindmap') => {
    if (type === 'mindmap') {
      navigate(`/maps/${item.id}`)
      onClose?.()
    }
  }

  const handleStartEditing = (item: FolderWithChildren | TreeMindMap, type: 'folder' | 'mindmap') => {
    setEditingItem(item.id)
    setEditingTitle(type === 'folder' ? (item as FolderWithChildren).name : (item as TreeMindMap).title)
  }

  const handleSaveEdit = async () => {
    if (!editingItem || !editingTitle.trim()) return

    try {
      // Check if it's a folder or mindmap
      const isFolder = hierarchyData?.allFolders.some(f => f.id === editingItem)
      
      if (isFolder) {
        await updateFolder.mutateAsync({
          id: editingItem,
          data: { name: editingTitle.trim() }
        })
      } else {
        await updateTitleMutation.mutateAsync({
          id: editingItem,
          title: editingTitle.trim()
        })
      }
      
      setEditingItem(null)
      setEditingTitle('')
    } catch (error) {
      console.error('Failed to save edit:', error)
    }
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
    setEditingTitle('')
  }

  const handleDeleteMap = async (mapId: string) => {
    try {
      await deleteMapMutation.mutateAsync(mapId)
    } catch (error) {
      console.error('Failed to delete map:', error)
    }
  }

  const renderFolderIcon = (folder: FolderWithChildren) => {
    const IconComponent = folder.is_expanded ? FolderOpenIcon : FolderIcon
    return (
      <IconComponent 
        className="w-4 h-4 flex-shrink-0"
        style={{ color: folder.color }}
      />
    )
  }

  const renderFolder = (folder: FolderWithChildren, level: number = 0) => {
    const hasChildren = (folder.children && folder.children.length > 0) || 
                       (folder.mindMaps && folder.mindMaps.length > 0)

    return (
      <div key={folder.id} className="select-none">
        {/* Folder Header */}
        <div 
          className={`flex items-center gap-1 py-2 px-2 sm:py-1 rounded-md hover:bg-content2 cursor-pointer group ${
            level > 0 ? `ml-${level * 4}` : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {/* Expand/Collapse Button */}
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="w-4 h-4 min-w-4 p-0"
            onPress={() => handleFolderToggle(folder)}
            disabled={!hasChildren}
          >
            {hasChildren ? (
              folder.is_expanded ? (
                <ChevronDownIcon className="w-3 h-3" />
              ) : (
                <ChevronRightIcon className="w-3 h-3" />
              )
            ) : (
              <div className="w-3 h-3" />
            )}
          </Button>

          {/* Folder Icon */}
          {renderFolderIcon(folder)}

          {/* Folder Name */}
          {editingItem === folder.id ? (
            <Input
              size="sm"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit()
                if (e.key === 'Escape') handleCancelEdit()
              }}
              onBlur={handleSaveEdit}
              autoFocus
              className="flex-1"
            />
          ) : (
            <span 
              className="flex-1 text-sm truncate"
              onClick={() => handleFolderToggle(folder)}
            >
              {folder.name}
            </span>
          )}

          {/* Folder Actions */}
          <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="w-8 h-8 min-w-8 sm:w-5 sm:h-5 sm:min-w-5"
                >
                  <EllipsisVerticalIcon className="w-3 h-3" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownSection title="Create">
                  <DropdownItem
                    key="new-map"
                    startContent={<PlusIcon className="w-4 h-4" />}
                    onAction={() => setNewMapDialog({ 
                      isOpen: true, 
                      folderId: folder.id, 
                      folderName: folder.name 
                    })}
                  >
                    New Map
                  </DropdownItem>
                  <DropdownItem
                    key="new-folder"
                    startContent={<FolderPlusIcon className="w-4 h-4" />}
                    onAction={() => setCreateFolderDialog({ isOpen: true, parentId: folder.id })}
                  >
                    New Folder
                  </DropdownItem>
                </DropdownSection>
                <DropdownSection title="Actions">
                  <DropdownItem
                    key="rename"
                    startContent={<PencilIcon className="w-4 h-4" />}
                    onAction={() => handleStartEditing(folder, 'folder')}
                  >
                    Rename
                  </DropdownItem>
                  <DropdownItem
                    key="edit"
                    startContent={<PencilIcon className="w-4 h-4" />}
                    onAction={() => setEditFolderDialog({ isOpen: true, folder })}
                  >
                    Edit Properties
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    startContent={<TrashIcon className="w-4 h-4" />}
                    className="text-danger"
                    color="danger"
                    onAction={() => setDeleteFolderDialog({ isOpen: true, folder })}
                  >
                    Delete
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        {/* Folder Contents */}
        {folder.is_expanded && (
          <div>
            {/* Child Folders */}
            {folder.children?.map(childFolder => renderFolder(childFolder, level + 1))}
            
            {/* Mind Maps */}
            {folder.mindMaps?.map(mindMap => renderMindMap(mindMap, level + 1))}
          </div>
        )}
      </div>
    )
  }

  const renderMindMap = (mindMap: TreeMindMap, level: number = 0) => {
    return (
      <div
        key={mindMap.id}
        className={`flex items-center gap-2 py-2 px-2 sm:py-1 rounded-md hover:bg-content2 cursor-pointer group ${
          level > 0 ? `ml-${level * 4}` : ''
        }`}
        style={{ paddingLeft: `${level * 16 + 24}px` }} // Extra indent for maps
      >
        {/* Document Icon */}
        <DocumentIcon className="w-4 h-4 text-default-500 flex-shrink-0" />

        {/* Mind Map Title */}
        {editingItem === mindMap.id ? (
          <Input
            size="sm"
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveEdit()
              if (e.key === 'Escape') handleCancelEdit()
            }}
            onBlur={handleSaveEdit}
            autoFocus
            className="flex-1"
          />
        ) : (
          <span 
            className="flex-1 text-sm truncate"
            onClick={() => handleItemClick(mindMap, 'mindmap')}
          >
            {mindMap.title || 'Untitled Map'}
          </span>
        )}

        {/* Mind Map Actions */}
        <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="w-8 h-8 min-w-8 sm:w-5 sm:h-5 sm:min-w-5"
              >
                <EllipsisVerticalIcon className="w-3 h-3" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                key="open"
                startContent={<ArrowRightIcon className="w-4 h-4" />}
                onAction={() => handleItemClick(mindMap, 'mindmap')}
              >
                Open
              </DropdownItem>
              <DropdownItem
                key="rename"
                startContent={<PencilIcon className="w-4 h-4" />}
                onAction={() => handleStartEditing(mindMap, 'mindmap')}
              >
                Rename
              </DropdownItem>
              <DropdownItem
                key="move"
                startContent={<FolderIcon className="w-4 h-4" />}
                onAction={() => setMoveFolderDialog({ isOpen: true, mindMap })}
              >
                Move to Folder
              </DropdownItem>
              <DropdownItem
                key="delete"
                startContent={<TrashIcon className="w-4 h-4" />}
                className="text-danger"
                color="danger"
                onAction={() => handleDeleteMap(mindMap.id)}
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-default-200 rounded w-3/4"></div>
          <div className="h-4 bg-default-200 rounded w-1/2"></div>
          <div className="h-4 bg-default-200 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  const rootFolders = hierarchyData?.rootFolders || []
  const rootMaps = hierarchyData?.allMindMaps.filter(map => !map.folder_id) || []

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-divider">
        <h2 className="font-semibold">Files</h2>
        <div className="flex gap-1">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={() => setCreateFolderDialog({ isOpen: true })}
          >
            <FolderPlusIcon className="w-4 h-4" />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={onClose}
          >
            <XMarkIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {/* Root Folders */}
          {rootFolders.map(folder => renderFolder(folder))}
          
          {/* Root Level Mind Maps */}
          {rootMaps.map(mindMap => renderMindMap(mindMap))}
          
          {/* Empty State */}
          {rootFolders.length === 0 && rootMaps.length === 0 && (
            <div className="text-center py-8 text-default-500">
              <FolderIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No folders or maps yet</p>
              <Button
                size="sm"
                variant="light"
                startContent={<PlusIcon className="w-4 h-4" />}
                onPress={() => setCreateFolderDialog({ isOpen: true })}
                className="mt-2"
              >
                Create Folder
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <CreateFolderDialog
        isOpen={createFolderDialog.isOpen}
        onClose={() => setCreateFolderDialog({ isOpen: false })}
        parentId={createFolderDialog.parentId}
      />
      
      <EditFolderDialog
        isOpen={editFolderDialog.isOpen}
        onClose={() => setEditFolderDialog({ isOpen: false, folder: null })}
        folder={editFolderDialog.folder}
      />
      
      <DeleteFolderDialog
        isOpen={deleteFolderDialog.isOpen}
        onClose={() => setDeleteFolderDialog({ isOpen: false, folder: null })}
        folder={deleteFolderDialog.folder}
      />
      
      <NewMapDialog
        isOpen={newMapDialog.isOpen}
        onClose={() => setNewMapDialog({ isOpen: false })}
        folderId={newMapDialog.folderId}
        folderName={newMapDialog.folderName}
      />
      
      <MoveFolderDialog
        isOpen={moveFolderDialog.isOpen}
        onClose={() => setMoveFolderDialog({ isOpen: false, mindMap: null })}
        mindMap={moveFolderDialog.mindMap}
      />
    </div>
  )
}
