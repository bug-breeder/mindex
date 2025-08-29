import { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { addToast } from '@heroui/toast'
import { useNavigate } from 'react-router-dom'

interface NewMapDialogProps {
  isOpen: boolean
  onClose: () => void
  folderId?: string // Optional folder to create the map in
  folderName?: string // For display purposes
}

export function NewMapDialog({ isOpen, onClose, folderId, folderName }: NewMapDialogProps) {
  const navigate = useNavigate()
  const [mapName, setMapName] = useState('')

  const handleCreate = () => {
    if (!mapName.trim()) {
      addToast({
        title: 'Error',
        description: 'Please enter a map name',
        color: 'warning'
      })
      return
    }

    const newMapId = crypto.randomUUID()
    const params = new URLSearchParams({
      title: mapName.trim()
    })
    
    // Include folder ID if creating in a folder
    if (folderId) {
      params.set('folderId', folderId)
    }
    
    navigate(`/maps/${newMapId}?${params.toString()}`)
    
    const location = folderName ? ` in "${folderName}"` : ''
    addToast({
      title: 'Created',
      description: `New map "${mapName.trim()}" created${location}`,
      color: 'success'
    })
    
    // Reset and close
    setMapName('')
    onClose()
  }

  const handleClose = () => {
    setMapName('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} placement="center" size="lg" className="mx-4">
      <ModalContent>
        <ModalHeader>Create New Map</ModalHeader>
        <ModalBody>
          {folderName && (
            <div className="text-sm text-default-600 mb-3">
              Creating in: <span className="font-medium">{folderName}</span>
            </div>
          )}
          <Input
            label="Map Name"
            placeholder="Enter a name for your mind map"
            variant="faded"
            value={mapName}
            onValueChange={setMapName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate()
              if (e.key === 'Escape') handleClose()
            }}
            autoFocus
            classNames={{
              inputWrapper: "bg-transparent",
              input: "bg-transparent"
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={handleClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleCreate}>
            Create Map
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
