import type { MindMapJson } from '@/stores/mapStore'

interface CachedPreview {
  dataUrl: string
  timestamp: number
  mapTimestamp: string // updated_at from the map
}

class PreviewCache {
  private cache = new Map<string, CachedPreview>()
  private readonly CACHE_DURATION = 1000 * 60 * 60 * 24 // 24 hours
  private readonly MAX_CACHE_SIZE = 100 // Maximum number of previews to cache

  /**
   * Get preview for a map, generating if not cached or outdated
   */
  async getPreview(mapId: string, map: MindMapJson, updatedAt: string): Promise<string> {
    const cached = this.cache.get(mapId)
    const now = Date.now()

    // Check if cached preview is valid
    if (
      cached && 
      cached.mapTimestamp === updatedAt &&
      (now - cached.timestamp) < this.CACHE_DURATION
    ) {
      return cached.dataUrl
    }

    // Generate new preview using Mind-Elixir
    try {
      const dataUrl = await this.generateMindElixirPreview(map)
      
      // Store in cache
      this.cache.set(mapId, {
        dataUrl,
        timestamp: now,
        mapTimestamp: updatedAt
      })

      // Clean up old entries if cache is too large
      this.cleanup()

      return dataUrl
    } catch (error) {
      console.warn('Failed to generate preview for map:', mapId, error)
      return this.getFallbackPreview()
    }
  }

  /**
   * Generate preview from Mind-Elixir using domToPng
   */
  private async generateMindElixirPreview(map: MindMapJson): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Create a temporary container for Mind-Elixir
        const container = document.createElement('div')
        container.style.position = 'absolute'
        container.style.left = '-9999px'
        container.style.top = '-9999px'
        container.style.width = '1200px'
        container.style.height = '800px'
        container.style.backgroundColor = 'white'
        document.body.appendChild(container)

        // Dynamically import Mind-Elixir and screenshot library
        Promise.all([
          import('mind-elixir'),
          import('@ssshooter/modern-screenshot')
        ]).then(([{ default: MindElixir }, { domToPng }]) => {
          const mind = new MindElixir({
            el: container,
            direction: 2 // 0 = right, 1 = left, 2 = side (using side by default)
          })

          mind.init({
            nodeData: map.root
          })

          // Wait for the mind map to render completely
          setTimeout(async () => {
            try {
              if (mind.nodes) {
                const dataUrl = await domToPng(mind.nodes, {
                  padding: 30,
                  quality: 0.9,
                  backgroundColor: '#ffffff',
                  width: 800,
                  height: 320
                })
                document.body.removeChild(container)
                resolve(dataUrl)
              } else {
                document.body.removeChild(container)
                reject(new Error('Mind map nodes not found'))
              }
            } catch (error) {
              document.body.removeChild(container)
              reject(error)
            }
          }, 1000) // Give more time for Mind-Elixir to fully render
        }).catch(error => {
          if (document.body.contains(container)) {
            document.body.removeChild(container)
          }
          reject(error)
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Generate preview from map data without caching (for immediate use)
   */
  async generatePreview(map: MindMapJson): Promise<string> {
    try {
      return await this.generateMindElixirPreview(map)
    } catch (error) {
      console.warn('Failed to generate preview:', error)
      return this.getFallbackPreview()
    }
  }

  /**
   * Remove a specific preview from cache
   */
  invalidate(mapId: string): void {
    this.cache.delete(mapId)
  }

  /**
   * Clear all cached previews
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Clean up old or excess cache entries
   */
  private cleanup(): void {
    const now = Date.now()
    const entries = Array.from(this.cache.entries())

    // Remove expired entries
    for (const [mapId, preview] of entries) {
      if ((now - preview.timestamp) >= this.CACHE_DURATION) {
        this.cache.delete(mapId)
      }
    }

    // If still too large, remove oldest entries
    if (this.cache.size > this.MAX_CACHE_SIZE) {
      const sortedEntries = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)
      
      const toRemove = this.cache.size - this.MAX_CACHE_SIZE
      for (let i = 0; i < toRemove; i++) {
        this.cache.delete(sortedEntries[i][0])
      }
    }
  }

  /**
   * Get fallback preview when generation fails
   */
  private getFallbackPreview(): string {
    const fallbackSvg = `
      <svg width="160" height="100" viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="fallback-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#fallback-gradient)" rx="8" stroke="#cbd5e1" stroke-width="1"/>
        
        <!-- Central node -->
        <rect x="65" y="40" width="30" height="20" rx="4" fill="#4f46e5" stroke="#3730a3" stroke-width="1"/>
        <text x="80" y="52" fill="white" font-size="8" font-family="system-ui" text-anchor="middle">Mind Map</text>
        
        <!-- Branch nodes -->
        <rect x="25" y="20" width="20" height="12" rx="3" fill="#8b5cf6" stroke="#7c3aed" stroke-width="1"/>
        <text x="35" y="28" fill="white" font-size="6" font-family="system-ui" text-anchor="middle">Ideas</text>
        
        <rect x="115" y="20" width="20" height="12" rx="3" fill="#06b6d4" stroke="#0891b2" stroke-width="1"/>
        <text x="125" y="28" fill="white" font-size="6" font-family="system-ui" text-anchor="middle">Tasks</text>
        
        <rect x="25" y="68" width="20" height="12" rx="3" fill="#10b981" stroke="#059669" stroke-width="1"/>
        <text x="35" y="76" fill="white" font-size="6" font-family="system-ui" text-anchor="middle">Notes</text>
        
        <!-- Connections -->
        <path d="M 65 50 Q 55 35 45 26" stroke="#4f46e5" stroke-width="2" fill="none" opacity="0.7"/>
        <path d="M 95 50 Q 105 35 115 26" stroke="#4f46e5" stroke-width="2" fill="none" opacity="0.7"/>
        <path d="M 65 50 Q 55 65 45 74" stroke="#4f46e5" stroke-width="2" fill="none" opacity="0.7"/>
      </svg>
    `
    const base64 = btoa(unescape(encodeURIComponent(fallbackSvg)))
    return `data:image/svg+xml;base64,${base64}`
  }
}

// Export singleton instance
export const previewCache = new PreviewCache()
