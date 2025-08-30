import type { MindMapNode, MindMapJson } from '@/stores/mapStore'

interface NodePosition {
  x: number
  y: number
  node: MindMapNode
  level: number
}

/**
 * Generate SVG preview from mind map data
 * Creates a compact visual representation of the mind map structure
 */
export function generateMindMapPreview(mindMap: MindMapJson): string {
  const width = 160
  const height = 100
  const centerX = width / 2
  const centerY = height / 2
  
  // Calculate positions for all nodes
  const positions = calculateNodePositions(mindMap.root, centerX, centerY, width, height)
  
  // Generate gradient based on theme
  const gradientId = `gradient-${mindMap.id}`
  const gradientColors = getThemeColors(mindMap.theme?.branchPalette)
  
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${gradientColors.start};stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:${gradientColors.end};stop-opacity:0.1" />
        </linearGradient>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/> 
          </feMerge>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="white" rx="6"/>
      <rect width="100%" height="100%" fill="url(#${gradientId})" rx="6"/>
      
      <!-- Connections -->
      ${generateConnections(positions)}
      
      <!-- Node Boxes -->
      ${generateNodeBoxes(positions)}
      
      <!-- Labels -->
      ${generateLabels(positions)}
    </svg>
  `
  
  return svg.trim()
}

function calculateNodePositions(
  root: MindMapNode, 
  centerX: number, 
  centerY: number, 
  width: number, 
  height: number
): NodePosition[] {
  const positions: NodePosition[] = []
  
  // Add root node
  positions.push({
    x: centerX,
    y: centerY,
    node: root,
    level: 0
  })
  
  // Add children in a radial pattern
  if (root.children && root.children.length > 0) {
    const children = root.children.slice(0, 6) // Max 6 children for clean preview
    const angleStep = (2 * Math.PI) / children.length
    const radius = Math.min(width, height) * 0.3
    
    children.forEach((child, index) => {
      const angle = index * angleStep - Math.PI / 2 // Start from top
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius
      
      positions.push({
        x: Math.max(8, Math.min(width - 8, x)),
        y: Math.max(8, Math.min(height - 8, y)),
        node: child,
        level: 1
      })
      
      // Add grandchildren (level 2) with smaller radius
      if (child.children && child.children.length > 0 && positions.length < 12) {
        const grandChildren = child.children.slice(0, 2) // Max 2 grandchildren per child
        const smallRadius = radius * 0.6
        
        grandChildren.forEach((grandChild, gIndex) => {
          const grandAngle = angle + (gIndex - 0.5) * 0.5 // Spread around parent
          const gx = centerX + Math.cos(grandAngle) * smallRadius
          const gy = centerY + Math.sin(grandAngle) * smallRadius
          
          positions.push({
            x: Math.max(6, Math.min(width - 6, gx)),
            y: Math.max(6, Math.min(height - 6, gy)),
            node: grandChild,
            level: 2
          })
        })
      }
    })
  }
  
  return positions
}

function generateConnections(positions: NodePosition[]): string {
  const root = positions.find(p => p.level === 0)
  if (!root) return ''
  
  let connections = ''
  
  positions.forEach(pos => {
    if (pos.level === 1) {
      // Connect to root with curved lines
      const midX = (root.x + pos.x) / 2
      const curveOffset = 15
      connections += `<path d="M ${root.x} ${root.y} Q ${midX} ${root.y - curveOffset} ${pos.x} ${pos.y}" stroke="#4F46E5" stroke-width="2" fill="none" opacity="0.7" />\n`
    } else if (pos.level === 2) {
      // Connect to parent (level 1)
      const parent = positions.find(p => 
        p.level === 1 && 
        p.node.children?.some(child => child.id === pos.node.id)
      )
      if (parent) {
        connections += `<line x1="${parent.x}" y1="${parent.y}" x2="${pos.x}" y2="${pos.y}" stroke="#6366F1" stroke-width="1.5" opacity="0.6" />\n`
      }
    }
  })
  
  return connections
}

function generateNodeBoxes(positions: NodePosition[]): string {
  let nodes = ''
  
  positions.forEach(pos => {
    const topic = pos.node.topic || 'Node'
    const truncatedTopic = topic.length > 12 ? topic.substring(0, 12) + '...' : topic
    
    // Calculate box dimensions based on text length and level
    const fontSize = pos.level === 0 ? 8 : pos.level === 1 ? 7 : 6
    const padding = pos.level === 0 ? 8 : pos.level === 1 ? 6 : 4
    const textWidth = Math.max(truncatedTopic.length * (fontSize * 0.6), 20)
    const boxWidth = textWidth + padding * 2
    const boxHeight = fontSize + padding
    
    const x = pos.x - boxWidth / 2
    const y = pos.y - boxHeight / 2
    
    // Node box styling based on level
    let fillColor, strokeColor
    if (pos.level === 0) {
      fillColor = '#4F46E5'
      strokeColor = '#3730A3'
    } else if (pos.level === 1) {
      fillColor = '#8B5CF6'
      strokeColor = '#7C3AED'
    } else {
      fillColor = '#06B6D4'
      strokeColor = '#0891B2'
    }
    
    // Generate rounded rectangle node
    nodes += `<rect x="${x}" y="${y}" width="${boxWidth}" height="${boxHeight}" rx="4" ry="4" fill="${fillColor}" stroke="${strokeColor}" stroke-width="1" filter="url(#shadow)" />\n`
  })
  
  return nodes
}

function generateLabels(positions: NodePosition[]): string {
  let labels = ''
  
  positions.forEach(pos => {
    const fontSize = pos.level === 0 ? 8 : pos.level === 1 ? 6 : 5
    const maxLength = pos.level === 0 ? 12 : pos.level === 1 ? 8 : 6
    const topic = pos.node.topic || 'Node'
    const truncatedTopic = topic.length > maxLength ? topic.substring(0, maxLength) + '...' : topic
    
    // Position text slightly offset from node
    const textX = pos.x + (pos.level === 0 ? 0 : pos.level === 1 ? 8 : 6)
    const textY = pos.y + (pos.level === 0 ? -8 : pos.level === 1 ? -6 : -4)
    
    labels += `<text x="${textX}" y="${textY}" fill="rgba(255,255,255,0.9)" font-size="${fontSize}" font-family="system-ui, -apple-system, sans-serif" text-anchor="${pos.level === 0 ? 'middle' : 'start'}" dominant-baseline="middle">${truncatedTopic}</text>\n`
  })
  
  return labels
}

function getThemeColors(branchPalette?: string): { start: string; end: string } {
  switch (branchPalette) {
    case 'semantic':
      return { start: '#3B82F6', end: '#8B5CF6' } // Blue to Purple
    case 'rainbow':
      return { start: '#F59E0B', end: '#EF4444' } // Orange to Red
    default:
      return { start: '#6366F1', end: '#A855F7' } // Indigo to Purple
  }
}

/**
 * Convert SVG string to base64 data URL for storage
 */
export function svgToDataUrl(svg: string): string {
  const base64 = btoa(unescape(encodeURIComponent(svg)))
  return `data:image/svg+xml;base64,${base64}`
}
