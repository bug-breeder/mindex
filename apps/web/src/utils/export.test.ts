import { describe, it, expect, beforeEach, vi } from 'vitest'
import { exportAsJSON, exportAsOPML, exportAsMarkdown, exportAsPNG, exportAsSVG } from './export'
import type { MindMapJson } from '@/stores/mapStore'

// Mock DOM methods
const mockCreateElement = vi.fn()
const mockAppendChild = vi.fn()
const mockRemoveChild = vi.fn()
const mockClick = vi.fn()
const mockCreateObjectURL = vi.fn()
const mockRevokeObjectURL = vi.fn()

Object.defineProperty(document, 'createElement', { value: mockCreateElement })
Object.defineProperty(document.body, 'appendChild', { value: mockAppendChild })
Object.defineProperty(document.body, 'removeChild', { value: mockRemoveChild })
Object.defineProperty(URL, 'createObjectURL', { value: mockCreateObjectURL })
Object.defineProperty(URL, 'revokeObjectURL', { value: mockRevokeObjectURL })

describe('Export Utils', () => {
  const testMap: MindMapJson = {
    id: 'test-map',
    title: 'Test Mind Map',
    root: {
      id: 'root',
      topic: 'Root Topic',
      expanded: true,
      notes: 'Root notes',
      url: 'https://example.com',
      children: [
        {
          id: 'child1',
          topic: 'Child 1',
          expanded: true,
          notes: 'Child 1 notes',
          children: [
            {
              id: 'grandchild1',
              topic: 'Grandchild 1',
              children: []
            }
          ]
        },
        {
          id: 'child2',
          topic: 'Child 2',
          url: 'https://child2.com',
          children: []
        }
      ]
    },
    theme: {
      layout: 'right-balanced',
      branchPalette: 'semantic'
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    const mockElement = {
      href: '',
      download: '',
      click: mockClick,
    }
    
    mockCreateElement.mockReturnValue(mockElement)
    mockCreateObjectURL.mockReturnValue('blob:mock-url')
  })

  describe('exportAsJSON', () => {
    it('should export map as JSON file', () => {
      exportAsJSON(testMap)

      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockCreateObjectURL).toHaveBeenCalled()
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockClick).toHaveBeenCalled()
      expect(mockRemoveChild).toHaveBeenCalled()
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
    })

    it('should use map title for filename', () => {
      const mockElement = {
        href: '',
        download: '',
        click: mockClick,
      }
      mockCreateElement.mockReturnValue(mockElement)

      exportAsJSON(testMap)

      expect(mockElement.download).toBe('Test Mind Map.json')
    })

    it('should use default filename when no title', () => {
      const mapWithoutTitle = { ...testMap, title: '' }
      const mockElement = {
        href: '',
        download: '',
        click: mockClick,
      }
      mockCreateElement.mockReturnValue(mockElement)

      exportAsJSON(mapWithoutTitle)

      expect(mockElement.download).toBe('mindmap.json')
    })
  })

  describe('exportAsOPML', () => {
    it('should export map as OPML file', () => {
      exportAsOPML(testMap)

      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockCreateObjectURL).toHaveBeenCalled()
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockClick).toHaveBeenCalled()
      expect(mockRemoveChild).toHaveBeenCalled()
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
    })

    it('should generate valid OPML structure', () => {
      const createBlobSpy = vi.spyOn(window, 'Blob')
      
      exportAsOPML(testMap)

      expect(createBlobSpy).toHaveBeenCalled()
      const blobContent = createBlobSpy.mock.calls[0]?.[0]?.[0] as string
      
      expect(blobContent).toContain('<?xml version="1.0" encoding="UTF-8"?>')
      expect(blobContent).toContain('<opml version="2.0">')
      expect(blobContent).toContain('<title>Test Mind Map</title>')
      expect(blobContent).toContain('text="Root Topic"')
      expect(blobContent).toContain('text="Child 1"')
      expect(blobContent).toContain('text="Grandchild 1"')
      expect(blobContent).toContain('url="https://example.com"')
      expect(blobContent).toContain('_note="Root notes"')
    })

    it('should escape XML special characters', () => {
      const mapWithSpecialChars = {
        ...testMap,
        root: {
          ...testMap.root,
          topic: 'Topic with <special> & "quoted" characters',
          notes: 'Notes with <tags> & symbols'
        }
      }

      const createBlobSpy = vi.spyOn(window, 'Blob')
      exportAsOPML(mapWithSpecialChars)

      const blobContent = createBlobSpy.mock.calls[0]?.[0]?.[0] as string
      expect(blobContent).toContain('&lt;special&gt;')
      expect(blobContent).toContain('&amp;')
      expect(blobContent).toContain('&quot;quoted&quot;')
    })
  })

  describe('exportAsMarkdown', () => {
    it('should export map as Markdown file', () => {
      exportAsMarkdown(testMap)

      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockCreateObjectURL).toHaveBeenCalled()
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockClick).toHaveBeenCalled()
      expect(mockRemoveChild).toHaveBeenCalled()
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
    })

    it('should generate valid Markdown structure', () => {
      const createBlobSpy = vi.spyOn(window, 'Blob')
      
      exportAsMarkdown(testMap)

      expect(createBlobSpy).toHaveBeenCalled()
      const markdownContent = createBlobSpy.mock.calls[0]?.[0]?.[0] as string
      
      expect(markdownContent).toContain('# Root Topic')
      expect(markdownContent).toContain('## Child 1')
      expect(markdownContent).toContain('### Grandchild 1')
      expect(markdownContent).toContain('Root notes')
      expect(markdownContent).toContain('[Link](https://example.com)')
      expect(markdownContent).toContain('[Link](https://child2.com)')
    })

    it('should handle nodes without notes or URLs', () => {
      const simpleMap = {
        ...testMap,
        root: {
          id: 'root',
          topic: 'Simple Root',
          children: [
            { id: 'child', topic: 'Simple Child', children: [] }
          ]
        }
      }

      const createBlobSpy = vi.spyOn(window, 'Blob')
      exportAsMarkdown(simpleMap)

      const markdownContent = createBlobSpy.mock.calls[0]?.[0]?.[0] as string
      expect(markdownContent).toContain('# Simple Root')
      expect(markdownContent).toContain('## Simple Child')
      expect(markdownContent).not.toContain('[Link]')
    })
  })

  describe('exportAsPNG', () => {
        it('should call Mind-Elixir exportPng method', () => {
      const mockInstance = {
        exportPng: vi.fn(),
        exportSvg: vi.fn()
      }
      
      exportAsPNG(mockInstance, 'test.png')

      expect(mockInstance.exportPng).toHaveBeenCalledWith('test.png')
    })

        it('should use default filename when none provided', () => {
      const mockInstance = {
        exportPng: vi.fn(),
        exportSvg: vi.fn()
      }
      
      exportAsPNG(mockInstance)

      expect(mockInstance.exportPng).toHaveBeenCalledWith('mindmap.png')
    })

    it('should handle missing instance gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      exportAsPNG(null, 'test.png')

      expect(consoleSpy).toHaveBeenCalledWith('Mind-Elixir instance not available or exportPng method missing')
      
      consoleSpy.mockRestore()
    })
  })

  describe('exportAsSVG', () => {
        it('should call Mind-Elixir exportSvg method', () => {
      const mockInstance = {
        exportPng: vi.fn(),
        exportSvg: vi.fn()
      }
      
      exportAsSVG(mockInstance, 'test.svg')

      expect(mockInstance.exportSvg).toHaveBeenCalledWith('test.svg')
    })

        it('should use default filename when none provided', () => {
      const mockInstance = {
        exportPng: vi.fn(),
        exportSvg: vi.fn()
      }
      
      exportAsSVG(mockInstance)

      expect(mockInstance.exportSvg).toHaveBeenCalledWith('mindmap.svg')
    })

    it('should handle missing instance gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      exportAsSVG(null, 'test.svg')

      expect(consoleSpy).toHaveBeenCalledWith('Mind-Elixir instance not available or exportSvg method missing')
      
      consoleSpy.mockRestore()
    })
  })
})