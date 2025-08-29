import { Button } from '@heroui/button'
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter 
} from '@heroui/modal'
import { useDeleteFolder } from '@/api/folders'
import type { Folder } from '@/types'

interface DeleteFolderDialogProps {
  isOpen: boolean
  onClose: () => void
  folder: Folder | null
}

export function DeleteFolderDialog({ isOpen, onClose, folder }: DeleteFolderDialogProps) {
  const deleteFolder = useDeleteFolder()

  const handleDelete = async () => {
    if (!folder) return

    try {
      await deleteFolder.mutateAsync(folder.id)
      onClose()
    } catch (error) {
      console.error('Failed to delete folder:', error)
    }
  }

  if (!folder) return null

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader>
          <h2 className="text-xl font-semibold text-danger">Delete Folder</h2>
        </ModalHeader>
        
        <ModalBody>
          <div className="space-y-3">
            <p>
              Are you sure you want to delete the folder <strong>"{folder.name}"</strong>?
            </p>
            
            <div className="bg-warning-50 border border-warning-200 rounded-lg p-3">
              <p className="text-sm text-warning-800">
                <strong>Warning:</strong> This action cannot be undone. 
              </p>
              <ul className="text-sm text-warning-700 mt-2 space-y-1">
                <li>• All subfolders will be moved to the parent folder (or root level)</li>
                <li>• All mind maps in this folder will be moved to the parent folder (or root level)</li>
                <li>• The folder itself will be permanently deleted</li>
              </ul>
            </div>
          </div>
        </ModalBody>
        
        <ModalFooter>
          <Button
            variant="light"
            onPress={onClose}
            disabled={deleteFolder.isPending}
          >
            Cancel
          </Button>
          <Button
            color="danger"
            onPress={handleDelete}
            isLoading={deleteFolder.isPending}
          >
            Delete Folder
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
