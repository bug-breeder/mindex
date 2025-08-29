import { useNavigate } from 'react-router-dom'
import { Button } from '@heroui/button'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection } from '@heroui/dropdown'
import { useMaps } from '@/api/maps'
import { 
  Bars3Icon,
  HomeIcon,
  DocumentIcon,
  ClockIcon,
  ArrowUpTrayIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '@/stores/authStore'

interface BurgerMenuProps {
  onOpenRecent?: () => void
}

export function BurgerMenu({ onOpenRecent }: BurgerMenuProps) {
  const navigate = useNavigate()
  const { signOut } = useAuthStore()
  const { data: maps } = useMaps()

  // Get recent maps (last 5)
  const recentMaps = maps
    ?.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5) || []

  const handleAction = (key: string) => {
    switch (key) {
      case 'dashboard':
        navigate('/maps')
        break
      case 'import':
        navigate('/import')
        break
      case 'settings':
        navigate('/settings')
        break
      case 'logout':
        signOut()
        navigate('/auth/login')
        break
      case 'open-recent':
        onOpenRecent?.()
        break
      default:
        // Handle recent map selection
        if (key.startsWith('recent-')) {
          const mapId = key.replace('recent-', '')
          navigate(`/maps/${mapId}`)
        }
    }
  }

  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <Button
          isIconOnly
          variant="shadow"
          className="bg-background/80 backdrop-blur-sm"
        >
          <Bars3Icon className="h-5 w-5" />
        </Button>
      </DropdownTrigger>
      
      <DropdownMenu 
        onAction={(key) => handleAction(key as string)}
        className="w-64"
      >
        <DropdownSection title="Navigation" showDivider>
          <DropdownItem 
            key="dashboard"
            startContent={<HomeIcon className="w-4 h-4" />}
          >
            Dashboard
          </DropdownItem>
          <DropdownItem 
            key="import"
            startContent={<ArrowUpTrayIcon className="w-4 h-4" />}
          >
            Import Content
          </DropdownItem>
        </DropdownSection>

        {recentMaps.length > 0 ? (
          <DropdownSection title="Recent Maps" showDivider>
            <>
              {recentMaps.map((map) => (
                <DropdownItem 
                  key={`recent-${map.id}`}
                  startContent={<DocumentIcon className="w-4 h-4" />}
                  description={`Updated ${new Date(map.updated_at).toLocaleDateString()}`}
                  className="text-sm"
                >
                  <div className="truncate max-w-48">
                    {map.title || 'Untitled Map'}
                  </div>
                </DropdownItem>
              ))}
              
              {recentMaps.length >= 5 ? (
                <DropdownItem 
                  key="open-recent"
                  startContent={<ClockIcon className="w-4 h-4" />}
                  className="text-primary-600"
                >
                  View All Recent...
                </DropdownItem>
              ) : null}
            </>
          </DropdownSection>
        ) : null}

        <DropdownSection title="Account">
          <DropdownItem 
            key="settings"
            startContent={<Cog6ToothIcon className="w-4 h-4" />}
          >
            Settings
          </DropdownItem>
          <DropdownItem 
            key="logout"
            startContent={<ArrowRightStartOnRectangleIcon className="w-4 h-4" />}
            className="text-danger"
            color="danger"
          >
            Sign Out
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
