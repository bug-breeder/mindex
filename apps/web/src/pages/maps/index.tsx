import { Link, useNavigate } from 'react-router-dom'
import DefaultLayout from '@/layouts/default'
import { useMaps, useDeleteMap } from '@/api/maps'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@heroui/button'
import { Button as IconButton } from '@heroui/button'

export default function MapsPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { data: maps, isLoading, error } = useMaps()
  const deleteMapMutation = useDeleteMap()

  const handleCreateMap = () => {
    const newMapId = crypto.randomUUID()
    navigate(`/maps/${newMapId}`)
  }

  const handleDeleteMap = (id: string) => {
    if (confirm('Are you sure you want to delete this map?')) {
      deleteMapMutation.mutate(id)
    }
  }

  if (!user) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Sign in to view your maps</h1>
            <Button as={Link} to="/auth/login" color="primary">Sign In</Button>
          </div>
        </div>
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Maps</h1>
          <Button 
            color="primary" 
            onClick={handleCreateMap}
          >
            + New Map
          </Button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-2">Failed to load maps</p>
            <p className="text-small text-default-500">{error.message}</p>
          </div>
        )}

        {maps && maps.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No maps yet</h2>
            <p className="text-default-500 mb-4">Create your first mind map to get started</p>
            <Button color="primary" onClick={handleCreateMap}>
              Create Your First Map
            </Button>
          </div>
        )}

        {maps && maps.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {maps.map((map) => (
              <div key={map.id} className="p-6 border border-outline rounded-lg hover:shadow-lg transition-shadow bg-surface">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <Link 
                      to={`/maps/${map.id}`}
                      className="text-lg font-semibold hover:text-primary transition-colors"
                    >
                      {map.title || 'Untitled Map'}
                    </Link>
                    {map.description && (
                      <p className="text-sm text-on-surface/70 mt-1 line-clamp-2">
                        {map.description}
                      </p>
                    )}
                  </div>
                  <IconButton 
                    isIconOnly 
                    variant="light" 
                    color="danger"
                    aria-label="Delete map"
                    onPress={() => handleDeleteMap(map.id)}
                    isDisabled={deleteMapMutation.isPending}
                  >
                    🗑️
                  </IconButton>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex gap-2">
                    {map.is_public && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        Public
                      </span>
                    )}
                    {map.tags && map.tags.length > 0 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                        {map.tags[0]}
                      </span>
                    )}
                  </div>
                  <span className="text-on-surface/50">
                    {new Date(map.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DefaultLayout>
  )
}