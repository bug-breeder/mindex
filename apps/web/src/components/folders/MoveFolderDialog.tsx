import { useState } from 'react'
import { Button } from '@heroui/button'
import { Select, SelectItem } from '@heroui/select'
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter 
} from '@heroui/modal'
import { useFolders } from '@/api/folders'
import { useMoveMindMap } from '@/api/maps'

// Simple interface for mind map data needed for moving
interface MovableMindMap {
  id: string
  title: string
  folder_id?: string
}

interface MoveFolderDialogProps {
  isOpen: boolean
  onClose: () => void
  mindMap: MovableMindMap | null
}

export function MoveFolderDialog({ isOpen, onClose, mindMap }: MoveFolderDialogProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string>('')
  const { data: folders } = useFolders()
  const moveMindMap = useMoveMindMap()

  const handleMove = async () => {
    if (!mindMap) return

    try {
      await moveMindMap.mutateAsync({
        mapId: mindMap.id,
        folderId: selectedFolderId || undefined, // empty string means root level
      })
      onClose()
    } catch (error) {
      console.error('Failed to move mind map:', error)
    }
  }

  const handleClose = () => {
    setSelectedFolderId('')
    onClose()
  }

  // Create folder options including root level
  const folderOptions = [
    { id: '', name: 'Root (No Folder)' },
    ...(folders || []).map(folder => ({ id: folder.id, name: folder.name }))
  ]

  // Filter out current folder if map is in a folder
  const availableOptions = folderOptions.filter(option => 
    option.id !== mindMap?.folder_id
  )

  if (!mindMap) return null

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
        <ModalHeader>
          <h2 className="text-xl font-semibold">Move Mind Map</h2>
        </ModalHeader>
        
        <ModalBody className="space-y-4">
          <div className="text-sm text-default-600">
            Moving: <span className="font-medium">{mindMap.title || 'Untitled Map'}</span>
          </div>
          
          <Select
            label="Move to Folder"
            placeholder="Select a folder or root level"
            selectedKeys={selectedFolderId ? [selectedFolderId] : ['']}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string
              setSelectedFolderId(selectedKey)
            }}
          >
            {availableOptions.map((option) => (
              <SelectItem key={option.id}>
                {option.name}
              </SelectItem>
            ))}
          </Select>
          
          {mindMap.folder_id && (
            <div className="text-sm text-default-500">
              Currently in: {folders?.find(f => f.id === mindMap.folder_id)?.name || 'Unknown Folder'}
            </div>
          )}
          
          {!mindMap.folder_id && (
            <div className="text-sm text-default-500">
              Currently at root level
            </div>
          )}
        </ModalBody>
        
        <ModalFooter>
          <Button
            variant="light"
            onPress={handleClose}
            disabled={moveMindMap.isPending}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleMove}
            isLoading={moveMindMap.isPending}
            disabled={selectedFolderId === mindMap.folder_id}
          >
            Move
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
