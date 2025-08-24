import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { MindMapJson } from '@/stores/mapStore'
import { useAuthStore } from '@/stores/authStore'

// Fetch all maps for the current user
export function useMaps() {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: ['maps', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('mind_maps')
        .select(`
          id,
          title,
          description,
          is_public,
          tags,
          created_at,
          updated_at
        `)
        .eq('created_by', user.id)
        .order('updated_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!user,
  })
}

// Fetch a specific map by ID
export function useMap(id: string) {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: ['map', id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('mind_maps')
        .select('*')
        .eq('id', id)
        .eq('created_by', user.id)
        .maybeSingle()

      if (error) throw error
      return data
    },
    enabled: !!user && !!id,
  })
}

// Save a map (create or update)
export function useSaveMap() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async ({ id, map }: { id: string; map: MindMapJson }) => {
      if (!user) throw new Error('User not authenticated')

      const mapData = {
        id,
        title: map.title,
        description: map.title,
        root: map,
        created_by: user.id,
        updated_at: new Date().toISOString(),
      }

      // Check if map exists
      const { data: existingMap } = await supabase
        .from('mind_maps')
        .select('id')
        .eq('id', id)
        .maybeSingle()

      if (existingMap) {
        // Update existing map
        const { data, error } = await supabase
          .from('mind_maps')
          .update(mapData)
          .eq('id', id)
          .eq('created_by', user.id)
          .select()
          .single()

        if (error) throw error
        return data
      } else {
        // Create new map
        const { data, error } = await supabase
          .from('mind_maps')
          .insert({
            ...mapData,
            created_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (error) throw error
        return data
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['maps'] })
      queryClient.invalidateQueries({ queryKey: ['map', data.id] })
    },
  })
}

// Delete a map
export function useDeleteMap() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('mind_maps')
        .delete()
        .eq('id', id)
        .eq('created_by', user.id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maps'] })
    },
  })
}