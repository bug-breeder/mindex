import { useState, useEffect } from 'react'
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
import { useUpdateFolder } from '@/api/folders'
import type { Folder, UpdateFolderRequest } from '@/types'

interface EditFolderDialogProps {
  isOpen: boolean
  onClose: () => void
  folder: Folder | null
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

export function EditFolderDialog({ isOpen, onClose, folder }: EditFolderDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#6366f1')
  const [icon, setIcon] = useState('folder')
  
  const updateFolder = useUpdateFolder()

  // Initialize form with folder data
  useEffect(() => {
    if (folder) {
      setName(folder.name)
      setDescription(folder.description || '')
      setColor(folder.color)
      setIcon(folder.icon)
    }
  }, [folder])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim() || !folder) return

    const updateData: UpdateFolderRequest = {
      name: name.trim(),
      description: description.trim() || undefined,
      color,
      icon,
    }

    try {
      await updateFolder.mutateAsync({ id: folder.id, data: updateData })
      handleClose()
    } catch (error) {
      console.error('Failed to update folder:', error)
    }
  }

  const handleClose = () => {
    onClose()
  }

  if (!folder) return null

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      placement="center"
      backdrop="blur"
      size="lg"
      className="mx-4"
    >
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <h2 className="text-xl font-semibold">Edit Folder</h2>
          </ModalHeader>
          
          <ModalBody className="space-y-4">
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
              disabled={updateFolder.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              isLoading={updateFolder.isPending}
              disabled={!name.trim()}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
