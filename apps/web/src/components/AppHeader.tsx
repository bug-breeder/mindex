import { Button } from '@heroui/button'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown'
import { Input } from '@heroui/input'
import { useNavigate } from 'react-router-dom'
import { Bars3Icon, PlusIcon } from '@heroicons/react/24/outline'

interface AppHeaderProps {
  onToggleSidebar?: () => void
}

export function AppHeader({ onToggleSidebar }: AppHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="h-16 border-b border-default-200 bg-content1 px-6 flex items-center gap-4">
      <Button 
        isIconOnly 
        variant="light" 
        size="md"
        onPress={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Bars3Icon className="h-5 w-5" />
      </Button>
      
      <div className="flex-1 max-w-md">
        <Input 
          size="md"
          variant="bordered"
          placeholder="Search maps..."
          classNames={{
            inputWrapper: "bg-content2/50"
          }}
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          size="md"
          color="primary"
          onPress={() => navigate('/maps/' + crypto.randomUUID())}
          startContent={<PlusIcon className="h-4 w-4" />}
        >
          New Map
        </Button>
        
        <Dropdown>
          <DropdownTrigger>
            <Button size="md" variant="light" isIconOnly>
              ⋮
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="App menu" onAction={(key) => {
            if (key === 'maps') navigate('/maps')
            if (key === 'import') navigate('/import')
            if (key === 'settings') navigate('/settings')
          }}>
            <DropdownItem key="maps">All Maps</DropdownItem>
            <DropdownItem key="import">Import</DropdownItem>
            <DropdownItem key="settings">Settings</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  )
}


