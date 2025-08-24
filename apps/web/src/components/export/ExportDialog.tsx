import { useState } from 'react'
import { Button } from '@heroui/button'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import type { MindMapJson } from '@/stores/mapStore'
import { exportAsJSON, exportAsOPML, exportAsMarkdown, exportAsPNG, exportAsSVG } from '@/utils/export'

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  map: MindMapJson | null
  mindElixirInstance?: any
}

export function ExportDialog({ isOpen, onClose, map, mindElixirInstance }: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>('json')

  const handleExport = () => {
    if (!map) return

    switch (selectedFormat) {
      case 'json':
        exportAsJSON(map)
        break
      case 'opml':
        exportAsOPML(map)
        break
      case 'markdown':
        exportAsMarkdown(map)
        break
      case 'png':
        exportAsPNG(mindElixirInstance, `${map.title || 'mindmap'}.png`)
        break
      case 'svg':
        exportAsSVG(mindElixirInstance, `${map.title || 'mindmap'}.svg`)
        break
      default:
        console.error('Unknown export format:', selectedFormat)
        return
    }

    onClose()
  }

  const exportOptions = [
    { value: 'json', label: 'JSON', description: 'Native format with all data' },
    { value: 'opml', label: 'OPML', description: 'Outline format for other mind map tools' },
    { value: 'markdown', label: 'Markdown', description: 'Text format for documentation' },
    { value: 'png', label: 'PNG Image', description: 'High-quality image export' },
    { value: 'svg', label: 'SVG Vector', description: 'Scalable vector graphics' },
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Export Mind Map
        </ModalHeader>
        <ModalBody>
          <div className="space-y-3">
            <p className="text-sm text-on-surface/70">
              Choose the format for exporting your mind map:
            </p>
            
            <div className="space-y-2">
              {exportOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-start gap-3 p-3 border border-outline rounded-lg hover:bg-outline/5 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="exportFormat"
                    value={option.value}
                    checked={selectedFormat === option.value}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-on-surface/70">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleExport}>
            Export
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}