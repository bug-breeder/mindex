import { useEffect } from 'react'
import { useAuth } from '@/api/auth'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Initialize auth state on app startup
  useAuth()
  
  return <>{children}</>
}