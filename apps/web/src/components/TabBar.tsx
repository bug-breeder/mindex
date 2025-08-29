import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@heroui/button'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useMap } from '@/api/maps'

interface Tab {
  id: string
  title: string
  path: string
  isPinned: boolean
}

interface TabBarProps {
  className?: string
}

export function TabBar({ className = '' }: TabBarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [tabs, setTabs] = useState<Tab[]>([])
  const [activeTabId, setActiveTabId] = useState<string | null>(null)

  // Extract map ID from current path
  const currentMapId = location.pathname.match(/\/maps\/([^\/]+)/)?.[1]
  const { data: currentMap } = useMap(currentMapId || '')

  // Add current map to tabs when navigating
  useEffect(() => {
    if (currentMapId && currentMap && location.pathname.startsWith('/maps/')) {
      setTabs(prevTabs => {
        const existingTab = prevTabs.find(tab => tab.id === currentMapId)
        if (existingTab) {
          return prevTabs
        }

        const newTab: Tab = {
          id: currentMapId,
          title: currentMap.title || 'Untitled Map',
          path: location.pathname,
          isPinned: false
        }

        return [...prevTabs, newTab]
      })
    }
  }, [currentMapId, currentMap, location.pathname])

  // Update active tab
  useEffect(() => {
    if (currentMapId) {
      setActiveTabId(currentMapId)
    } else {
      setActiveTabId(null)
    }
  }, [currentMapId])

  // Update tab title when map title changes
  useEffect(() => {
    if (currentMapId && currentMap) {
      setTabs(prevTabs => 
        prevTabs.map(tab => 
          tab.id === currentMapId 
            ? { ...tab, title: currentMap.title || 'Untitled Map' }
            : tab
        )
      )
    }
  }, [currentMapId, currentMap?.title])

  const closeTab = (tabId: string) => {
    setTabs(prevTabs => {
      const tab = prevTabs.find(t => t.id === tabId)
      if (tab?.isPinned) return prevTabs // Don't close pinned tabs
      
      const newTabs = prevTabs.filter(t => t.id !== tabId)
      
      // If we closed the active tab, navigate to another tab or dashboard
      if (tabId === activeTabId) {
        if (newTabs.length > 0) {
          navigate(newTabs[newTabs.length - 1].path)
        } else {
          navigate('/maps')
        }
      }
      
      return newTabs
    })
  }



  const switchToTab = (tab: Tab) => {
    navigate(tab.path)
  }

  if (tabs.length <= 1) {
    return null
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center overflow-x-auto">
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            className={`
              group flex items-center gap-2 px-3 py-2 min-w-0 
              ${index < tabs.length - 1 ? 'border-r border-divider' : ''}
              ${tab.id === activeTabId 
                ? 'bg-content2 text-foreground' 
                : 'text-default-600 hover:text-foreground hover:bg-content2/50'
              }
              ${tab.isPinned ? 'bg-primary-50' : ''}
            `}
          >
            {/* Tab Content */}
            <button
              className="flex items-center gap-2 min-w-0 flex-1"
              onClick={() => switchToTab(tab)}
            >
              {tab.isPinned && (
                <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
              )}
              <span className="text-sm truncate max-w-20 sm:max-w-32">
                {tab.title}
              </span>
            </button>

            {/* Tab Actions */}
            {!tab.isPinned && (
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="w-6 h-6 min-w-6"
                  onPress={() => closeTab(tab.id)}
                >
                  <XMarkIcon className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
