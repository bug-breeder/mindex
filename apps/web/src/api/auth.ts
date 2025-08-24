import { useQuery, useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'

// Check current auth session
export function useAuth() {
  const { setUser, setSession, setLoading } = useAuthStore()
  
  return useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Auth error:', error)
        setUser(null)
        setSession(null)
        setLoading(false)
        return null
      }
      
      setSession(session)
      setUser(session?.user || null)
      setLoading(false)
      
      return session
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

// Sign in with email and password
export function useSignIn() {
  const { setUser, setSession } = useAuthStore()
  
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      setSession(data.session)
      setUser(data.user)
      
      return data
    },
  })
}

// Sign up with email and password
export function useSignUp() {
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) throw error
      return data
    },
  })
}

// Sign out
export function useSignOut() {
  const { signOut: storeSignOut } = useAuthStore()
  
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
    onSuccess: () => {
      storeSignOut()
    },
  })
}