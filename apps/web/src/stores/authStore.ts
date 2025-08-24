import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  signOut: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      session: null,
      loading: true,
      setUser: (user) => set({ user }, false, 'setUser'),
      setSession: (session) => set({ session }, false, 'setSession'),
      setLoading: (loading) => set({ loading }, false, 'setLoading'),
      signOut: () => set({ user: null, session: null }, false, 'signOut'),
    }),
    { name: 'auth-store' }
  )
)