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

  it('signInWithEmail sets loading and clears error', async () => {
    const { signInWithEmail } = useAuthStore.getState()
    await signInWithEmail('a@b.com')
    expect(useAuthStore.getState().loading).toBe(false)
    expect(useAuthStore.getState().error).toBeUndefined()
  })

  it('refreshSession sets user from supabase', async () => {
    const { refreshSession } = useAuthStore.getState()
    await refreshSession()
    expect(useAuthStore.getState().user?.id).toBe('u1')
  })

  it('signOut clears user', async () => {
    const { refreshSession, signOut } = useAuthStore.getState()
    await refreshSession()
    await signOut()
    expect(useAuthStore.getState().user).toBeNull()
  })
})
