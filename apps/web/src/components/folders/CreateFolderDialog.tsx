import { useState } from 'react'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Textarea } from '@heroui/input'
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter 
} from '@heroui/modal'
import { Select, SelectItem } from '@heroui/select'
import { useCreateFolder, useFolders } from '@/api/folders'
import type { CreateFolderRequest } from '@/types'

interface CreateFolderDialogProps {
  isOpen: boolean
  onClose: () => void
  parentId?: string
}

const FOLDER_COLORS = [
  { value: '#6366f1', label: 'Indigo', color: 'bg-indigo-500' },
  { value: '#3b82f6', label: 'Blue', color: 'bg-blue-500' },
  { value: '#10b981', label: 'Emerald', color: 'bg-emerald-500' },
  { value: '#f59e0b', label: 'Amber', color: 'bg-amber-500' },
  { value: '#ef4444', label: 'Red', color: 'bg-red-500' },
  { value: '#8b5cf6', label: 'Violet', color: 'bg-violet-500' },
  { value: '#ec4899', label: 'Pink', color: 'bg-pink-500' },
  { value: '#6b7280', label: 'Gray', color: 'bg-gray-500' },
]

const FOLDER_ICONS = [
  { value: 'folder', label: 'Folder' },
  { value: 'briefcase', label: 'Work' },
  { value: 'home', label: 'Home' },
  { value: 'academic-cap', label: 'Education' },
  { value: 'light-bulb', label: 'Ideas' },
  { value: 'users', label: 'Team' },
  { value: 'cog', label: 'Settings' },
  { value: 'archive', label: 'Archive' },
  { value: 'heart', label: 'Favorites' },
  { value: 'star', label: 'Important' },
]

export function CreateFolderDialog({ isOpen, onClose, parentId }: CreateFolderDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#6366f1')
  const [icon, setIcon] = useState('folder')
  
  const createFolder = useCreateFolder()
  const { data: folders } = useFolders()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) return

    const folderData: CreateFolderRequest = {
      name: name.trim(),
      description: description.trim() || undefined,
      parent_id: parentId,
      color,
      icon,
    }

    try {
      await createFolder.mutateAsync(folderData)
      handleClose()
    } catch (error) {
      console.error('Failed to create folder:', error)
    }
  }

  const handleClose = () => {
    setName('')
    setDescription('')
    setColor('#6366f1')
    setIcon('folder')
    onClose()
  }

  // Find parent folder name for display
  const parentFolder = parentId ? folders?.find(f => f.id === parentId) : null

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <h2 className="text-xl font-semibold">Create New Folder</h2>
          </ModalHeader>
          
          <ModalBody className="space-y-4">
            {parentFolder && (
              <div className="text-sm text-default-600">
                Creating folder in: <span className="font-medium">{parentFolder.name}</span>
              </div>
            )}
            
            <Input
              label="Folder Name"
              placeholder="Enter folder name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              isRequired
              autoFocus
            />
            
            <Textarea
              label="Description (Optional)"
              placeholder="Enter folder description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxRows={3}
            />
            
            <div className="flex gap-4">
              <Select
                label="Color"
                selectedKeys={[color]}
                onSelectionChange={(keys) => {
                  const selectedColor = Array.from(keys)[0] as string
                  setColor(selectedColor)
                }}
                className="flex-1"
              >
                {FOLDER_COLORS.map((colorOption) => (
                  <SelectItem key={colorOption.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${colorOption.color}`} />
                      {colorOption.label}
                    </div>
                  </SelectItem>
                ))}
              </Select>
              
              <Select
                label="Icon"
                selectedKeys={[icon]}
                onSelectionChange={(keys) => {
                  const selectedIcon = Array.from(keys)[0] as string
                  setIcon(selectedIcon)
                }}
                className="flex-1"
              >
                {FOLDER_ICONS.map((iconOption) => (
                  <SelectItem key={iconOption.value}>
                    {iconOption.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </ModalBody>
          
          <ModalFooter>
            <Button
              variant="light"
              onPress={handleClose}
              disabled={createFolder.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              isLoading={createFolder.isPending}
              disabled={!name.trim()}
            >
              Create Folder
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
