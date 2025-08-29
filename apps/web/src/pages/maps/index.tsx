import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout'
import { Dashboard } from '@/components/Dashboard'
import { NewMapDialog } from '@/components/NewMapDialog'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@heroui/button'

export default function MapsPage() {
  const { user } = useAuthStore()
  const [newMapDialogOpen, setNewMapDialogOpen] = useState(false)

  if (!user) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-lg mb-3">Sign in to view your maps</h1>
            <Button as={Link} to="/auth/login" color="primary">Sign In</Button>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <Dashboard onNewMap={() => setNewMapDialogOpen(true)} />
      
      {/* Additional New Map Dialog for Dashboard */}
      <NewMapDialog 
        isOpen={newMapDialogOpen} 
        onClose={() => setNewMapDialogOpen(false)} 
      />
    </AppLayout>
  )
}