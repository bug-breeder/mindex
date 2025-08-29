import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown'
import { addToast } from '@heroui/toast'
import { useMaps, useUpdateMapTitle, useDeleteMap } from '@/api/maps'
import { 
  FolderIcon, 
  FolderOpenIcon, 
  DocumentIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface DirectoryTreeProps {
  onClose?: () => void
}

interface FolderNode {
  id: string
  name: string
  type: 'folder'
  children: (FolderNode | FileNode)[]
  isExpanded: boolean
}

interface FileNode {
  id: string
  name: string
  type: 'file'
  updated_at: string
  isPinned: boolean
}

type TreeNode = FolderNode | FileNode

export function DirectoryTree({ onClose }: DirectoryTreeProps) {
  const navigate = useNavigate()
  const { data: maps, isLoading } = useMaps()
  const updateTitleMutation = useUpdateMapTitle()
  const deleteMapMutation = useDeleteMap()

  const [treeData, setTreeData] = useState<TreeNode[]>([])
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  // Build tree structure from flat maps data
  useEffect(() => {
    if (!maps) return

    // For now, create a simple structure with "Recent" and "All Maps" folders
    // Later we can implement proper folder hierarchy from database
    const recentMaps = maps
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5)

    const allMaps = maps.sort((a, b) => a.title.localeCompare(b.title))

    const tree: TreeNode[] = [
      {
        id: 'recent',
        name: 'Recent',
        type: 'folder',
        isExpanded: true,
        children: recentMaps.map(map => ({
          id: map.id,
          name: map.title || 'Untitled Map',
          type: 'file',
          updated_at: map.updated_at,
          isPinned: false
        }))
      },
      {
        id: 'all',
        name: 'All Maps',
        type: 'folder',
        isExpanded: false,
        children: allMaps.map(map => ({
          id: map.id,
          name: map.title || 'Untitled Map',
          type: 'file',
          updated_at: map.updated_at,
          isPinned: false
        }))
      }
    ]

    setTreeData(tree)
  }, [maps])

  const toggleFolder = (folderId: string) => {
    setTreeData(prevData => 
      prevData.map(node => 
        node.id === folderId && node.type === 'folder'
          ? { ...node, isExpanded: !node.isExpanded }
          : node
      )
    )
  }

  const handleFileSelect = (fileId: string) => {
    navigate(`/maps/${fileId}`)
    onClose?.()
  }

  const handleEditStart = (itemId: string, currentTitle: string) => {
    setEditingItem(itemId)
    setEditingTitle(currentTitle)
  }

  const handleEditCancel = () => {
    setEditingItem(null)
    setEditingTitle('')
  }

  const handleEditSave = (itemId: string) => {
    if (editingTitle.trim() && editingTitle !== getCurrentTitle(itemId)) {
      updateTitleMutation.mutate({ id: itemId, title: editingTitle.trim() }, {
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
    }
    setEditingItem(null)
  }

  const getCurrentTitle = (itemId: string): string => {
    const map = maps?.find(m => m.id === itemId)
    return map?.title || 'Untitled Map'
  }

  const handleDelete = (itemId: string) => {
    deleteMapMutation.mutate(itemId, {
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
  }

  const renderTreeNode = (node: TreeNode, depth: number = 0) => {
    const indentStyle = { paddingLeft: `${depth * 16}px` }

    if (node.type === 'folder') {
      return (
        <div key={node.id}>
          <div 
            className="flex items-center gap-2 py-1 px-2 hover:bg-default-100 rounded cursor-pointer group"
            style={indentStyle}
            onClick={() => toggleFolder(node.id)}
          >
            {node.isExpanded ? (
              <ChevronDownIcon className="w-4 h-4 text-default-400" />
            ) : (
              <ChevronRightIcon className="w-4 h-4 text-default-400" />
            )}
            {node.isExpanded ? (
              <FolderOpenIcon className="w-4 h-4 text-primary-500" />
            ) : (
              <FolderIcon className="w-4 h-4 text-default-500" />
            )}
            <span className="text-sm font-medium flex-1">{node.name}</span>
          </div>
          
          {node.isExpanded && (
            <div>
              {node.children.map(child => renderTreeNode(child, depth + 1))}
            </div>
          )}
        </div>
      )
    }

    // File node
    return (
      <div 
        key={node.id}
        className="flex items-center gap-2 py-1 px-2 hover:bg-default-100 rounded group"
        style={indentStyle}
      >
        <div className="w-4 h-4" /> {/* Spacer for alignment */}
        
        {node.isPinned && (
          <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
        )}
        
        <DocumentIcon className="w-4 h-4 text-default-400 flex-shrink-0" />

        {editingItem === node.id ? (
          <Input
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleEditSave(node.id)
              } else if (e.key === 'Escape') {
                handleEditCancel()
              }
            }}
            onBlur={() => handleEditSave(node.id)}
            autoFocus
            size="sm"
            classNames={{
              base: "flex-1",
              inputWrapper: "bg-transparent shadow-none border border-default-300 h-6",
              input: "bg-transparent text-xs"
            }}
          />
        ) : (
          <>
            <button
              className="text-sm text-left flex-1 truncate cursor-pointer"
              onClick={() => handleFileSelect(node.id)}
              onDoubleClick={() => handleEditStart(node.id, node.name)}
            >
              {node.name}
            </button>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className="w-6 h-6 min-w-6"
                  >
                    <EllipsisVerticalIcon className="w-3 h-3" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu onAction={(key) => {
                  if (key === 'rename') {
                    handleEditStart(node.id, node.name)
                  } else if (key === 'delete') {
                    handleDelete(node.id)
                  }
                }}>
                  <DropdownItem key="rename">Rename</DropdownItem>
                  <DropdownItem key="delete" className="text-danger" color="danger">
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-default-200">
        <h2 className="text-lg font-semibold">Files</h2>
        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            color="primary"
            // onClick={() => setNewFolderDialogOpen(true)}
          >
            <PlusIcon className="w-4 h-4" />
          </Button>
          {onClose && (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={onClose}
            >
              <XMarkIcon className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="text-sm text-default-500 py-4">Loading...</div>
        ) : treeData.length > 0 ? (
          <div className="space-y-1">
            {treeData.map(node => renderTreeNode(node))}
          </div>
        ) : (
          <div className="text-sm text-default-500 text-center py-4">
            No files yet
          </div>
        )}
      </div>
    </div>
  )
}
