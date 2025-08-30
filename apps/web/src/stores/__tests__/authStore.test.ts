import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@supabase/supabase-js', () => {
  return {
    createClient: () => ({
      auth: {
        signInWithOtp: vi.fn().mockResolvedValue({ data: {}, error: null }),
        signOut: vi.fn().mockResolvedValue({ error: null }),
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1', email: 'a@b.com' } }, error: null }),
      },
    }),
  }
})

import { useAuthStore } from '../authStore'

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, loading: false, error: undefined })
  })

  it('should set user', () => {
    const mockUser = { id: 'u1', email: 'test@example.com' } as const
    const { setUser } = useAuthStore.getState()
    setUser(mockUser)
    expect(useAuthStore.getState().user).toEqual(mockUser)
  })

  it('should set loading state', () => {
    const { setLoading } = useAuthStore.getState()
    setLoading(true)
    expect(useAuthStore.getState().loading).toBe(true)
  })

  it('signOut clears user', () => {
    // First set a user
    const mockUser = { id: 'u1', email: 'test@example.com' } as const
    useAuthStore.getState().setUser(mockUser)
    
    // Then sign out
    const { signOut } = useAuthStore.getState()
    signOut()
    expect(useAuthStore.getState().user).toBeNull()
  })
})
