import type { MindMapJson } from '@/stores/mapStore'

// Export map as JSON file
export function exportAsJSON(map: MindMapJson) {
  const jsonString = JSON.stringify(map, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `${map.title || 'mindmap'}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

// Export map as OPML (Outline Processor Markup Language)
export function exportAsOPML(map: MindMapJson) {
  interface MindMapNode {
    topic?: string;
    text?: string;
    notes?: string;
    url?: string;
    children?: MindMapNode[];
  }

  const convertNodeToOPML = (node: MindMapNode, level = 0): string => {
    const indent = '  '.repeat(level + 2)
    const text = node.topic || node.text || 'Untitled'
    const notes = node.notes ? ` _note="${escapeXML(node.notes)}"` : ''
    const url = node.url ? ` url="${escapeXML(node.url)}"` : ''
    
    if (!node.children || node.children.length === 0) {
      return `${indent}<outline text="${escapeXML(text)}"${notes}${url} />`
    }
    
    let result = `${indent}<outline text="${escapeXML(text)}"${notes}${url}>\n`
    for (const child of node.children) {
      result += convertNodeToOPML(child, level + 1) + '\n'
    }
    result += `${indent}</outline>`
    
    return result
  }
  
  const escapeXML = (str: string) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }
  
  const opmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>${escapeXML(map.title || 'Mind Map')}</title>
    <dateCreated>${new Date().toISOString()}</dateCreated>
    <dateModified>${new Date().toISOString()}</dateModified>
  </head>
  <body>
${convertNodeToOPML(map.root)}
  </body>
</opml>`

  const blob = new Blob([opmlContent], { type: 'application/xml' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `${map.title || 'mindmap'}.opml`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

// Type definitions
interface MindMapNode {
  id?: string;
  topic?: string;
  text?: string;
  notes?: string;
  hyperLink?: string;
  url?: string;
  children?: MindMapNode[];
}

// Export map as PNG using Mind-Elixir's built-in functionality
interface MindElixirInstance {
  exportPng: (filename?: string) => void;
  exportSvg: (filename?: string) => void;
}

export function exportAsPNG(mindElixirInstance: MindElixirInstance | null, filename?: string) {
  if (!mindElixirInstance || typeof mindElixirInstance.exportPng !== 'function') {
    console.error('Mind-Elixir instance not available or exportPng method missing')
    return
  }
  
  try {
    mindElixirInstance.exportPng(filename || 'mindmap.png')
  } catch (error) {
    console.error('Failed to export PNG:', error)
  }
}

// Export map as SVG using Mind-Elixir's built-in functionality  
export function exportAsSVG(mindElixirInstance: MindElixirInstance | null, filename?: string) {
  if (!mindElixirInstance || typeof mindElixirInstance.exportSvg !== 'function') {
    console.error('Mind-Elixir instance not available or exportSvg method missing')
    return
  }
  
  try {
    mindElixirInstance.exportSvg(filename || 'mindmap.svg')
  } catch (error) {
    console.error('Failed to export SVG:', error)
  }
}

// Convert map to Markdown format
export function exportAsMarkdown(map: MindMapJson) {
  const convertNodeToMarkdown = (node: MindMapNode, level = 0): string => {
    const indent = '  '.repeat(level)
    const prefix = level === 0 ? '# ' : `${'#'.repeat(Math.min(level + 1, 6))} `
    const text = node.topic || node.text || 'Untitled'
    
    let result = `${level === 0 ? '' : indent}${prefix}${text}\n`
    
    if (node.notes) {
      result += `${indent}\n${indent}${node.notes}\n`
    }
    
    if (node.url) {
      result += `${indent}\n${indent}[Link](${node.url})\n`
    }
    
    if (node.children && node.children.length > 0) {
      result += '\n'
      for (const child of node.children) {
        result += convertNodeToMarkdown(child, level + 1)
      }
    }
    
    return result
  }
  
  const markdownContent = convertNodeToMarkdown(map.root)
  
  const blob = new Blob([markdownContent], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `${map.title || 'mindmap'}.md`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}