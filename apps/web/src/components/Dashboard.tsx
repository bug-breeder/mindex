import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
import { useMaps } from '@/api/maps'
import { previewCache } from '@/utils/previewCache'
import { PlusIcon } from '@heroicons/react/24/outline'
import type { MindMap } from '@/types'

interface DashboardProps {
  onNewMap: () => void
}

export function Dashboard({ onNewMap }: DashboardProps) {
  const navigate = useNavigate()
  const { data: maps, isLoading } = useMaps()
  
  // Get recent maps (last 6 maps by updated_at)
  const recentMaps = maps
    ?.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 6) || []

  return (
    <div className="h-full w-full p-4 sm:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-default-600">Continue working on your mind maps or start something new</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              color="primary"
              size="lg"
              startContent={<PlusIcon className="w-5 h-5" />}
              onPress={onNewMap}
            >
              Create New Map
            </Button>
            <Button
              variant="bordered"
              size="lg"
            >
              Import Content
            </Button>
          </div>
        </div>

        {/* Recent Maps */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Maps</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-48">
                  <CardBody className="p-0">
                    <div className="w-full h-32 bg-default-100 animate-pulse rounded-t-lg" />
                    <div className="p-4">
                      <div className="h-4 bg-default-200 rounded animate-pulse mb-2" />
                      <div className="h-3 bg-default-100 rounded animate-pulse w-2/3" />
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : recentMaps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentMaps.map((map) => (
                <RecentMapCard
                  key={map.id}
                  map={map}
                  onClick={() => navigate(`/maps/${map.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-default-400 mb-4">
                <PlusIcon className="w-12 h-12 mx-auto mb-2" />
                <p>No mind maps yet</p>
              </div>
              <Button
                color="primary"
                onPress={onNewMap}
              >
                Create your first map
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function RecentMapCard({ map, onClick }: { map: MindMap, onClick: () => void }) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(true)

  useEffect(() => {
    if (map.root) {
      setIsLoadingPreview(true)
      
      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        setPreview('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDMyMCAxNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y4ZmFmYyIgcng9IjgiLz4KICA8Y2lyY2xlIGN4PSIxNjAiIGN5PSI4MCIgcj0iMjQiIGZpbGw9IiM2MzY2ZjEiLz4KICA8dGV4dCB4PSIxNjAiIHk9Ijg2IiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxMiIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VGltZW91dDwvdGV4dD4KPC9zdmc+')
        setIsLoadingPreview(false)
      }, 10000) // 10 second timeout
      
      previewCache.getPreview(map.id, map.root, map.updated_at)
        .then((previewUrl) => {
          clearTimeout(timeoutId)
          setPreview(previewUrl)
          setIsLoadingPreview(false)
        })
        .catch(() => {
          clearTimeout(timeoutId)
          // Use fallback preview
          setPreview('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDMyMCAxNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y4ZmFmYyIgcng9IjgiLz4KICA8Y2lyY2xlIGN4PSIxNjAiIGN5PSI4MCIgcj0iMjQiIGZpbGw9IiM2MzY2ZjEiLz4KICA8dGV4dCB4PSIxNjAiIHk9Ijg2IiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxMiIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TWFwPC90ZXh0Pgo8L3N2Zz4=')
          setIsLoadingPreview(false)
        })
        
      // Cleanup timeout on unmount
      return () => clearTimeout(timeoutId)
    } else {
      // No root data, use fallback immediately
      setPreview('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDMyMCAxNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y4ZmFmYyIgcng9IjgiLz4KICA8Y2lyY2xlIGN4PSIxNjAiIGN5PSI4MCIgcj0iMjQiIGZpbGw9IiM2MzY2ZjEiLz4KICA8dGV4dCB4PSIxNjAiIHk9Ijg2IiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxMiIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TWFwPC90ZXh0Pgo8L3N2Zz4=')
      setIsLoadingPreview(false)
    }
  }, [map.id, map.root, map.updated_at])

  return (
    <Card 
      className="h-48 cursor-pointer hover:scale-105 transition-transform"
      isPressable
      onPress={onClick}
    >
      <CardBody className="p-0">
        {/* Preview Image */}
        <div className="w-full h-32 rounded-t-lg overflow-hidden bg-gray-50">
          {isLoadingPreview ? (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-gray-400 text-sm">Loading...</div>
            </div>
          ) : preview ? (
            <img
              src={preview}
              alt={`Preview of ${map.title}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-gray-400 text-sm">No Preview</div>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4">
          <h3 className="font-semibold text-sm mb-1 truncate">
            {map.title || 'Untitled Map'}
          </h3>
          <p className="text-xs text-default-500">
            Updated {new Date(map.updated_at).toLocaleDateString()}
          </p>
        </div>
      </CardBody>
    </Card>
  )
}
