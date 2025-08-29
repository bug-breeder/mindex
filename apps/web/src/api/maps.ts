import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { MindMapJson } from '@/stores/mapStore'
import type { MindMap, MoveMindMapRequest } from '@/types'
import { useAuthStore } from '@/stores/authStore'
import { previewCache } from '@/utils/previewCache'

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
          updated_at,
          root,
          folder_id,
          sort_order
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
    mutationFn: async ({ id, map, folderId }: { id: string; map: MindMapJson; folderId?: string }) => {
      if (!user) throw new Error('User not authenticated')

      const mapData = {
        id,
        title: map.title,
        description: map.title,
        root: map,
        created_by: user.id,
        updated_at: new Date().toISOString(),
        ...(folderId !== undefined && { folder_id: folderId }), // Only include if explicitly provided
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
      // Invalidate preview cache to ensure fresh previews
      previewCache.invalidate(data.id)
    },
  })
}

// Update map title
export function useUpdateMapTitle() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('mind_maps')
        .update({ 
          title,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('created_by', user.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['maps'] })
      // Invalidate preview cache since title changed
      if (data?.id) {
        previewCache.invalidate(data.id)
      }
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
      return id // Return the deleted map ID
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['maps'] })
      // Remove from preview cache since map is deleted
      if (deletedId) {
        previewCache.invalidate(deletedId)
      }
    },
  })
}

// Move mind map to a different folder
export function useMoveMindMap() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  
  return useMutation({
    mutationFn: async ({ 
      mapId, 
      folderId, 
      sortOrder 
    }: { 
      mapId: string; 
      folderId?: string; 
      sortOrder?: number 
    }) => {
      if (!user) throw new Error('User not authenticated')
      
      const updateData: MoveMindMapRequest = {}
      if (folderId !== undefined) updateData.folder_id = folderId
      if (sortOrder !== undefined) updateData.sort_order = sortOrder
      
      const { data, error } = await supabase
        .from('mind_maps')
        .update(updateData)
        .eq('id', mapId)
        .eq('created_by', user.id)
        .select()
        .single()

      if (error) throw error
      return data as MindMap
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maps', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['folder-hierarchy', user?.id] })
    },
  })
}

// Get maps by folder ID
export function useMapsByFolder(folderId?: string) {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: ['maps-by-folder', folderId, user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')
      
      let query = supabase
        .from('mind_maps')
        .select(`
          id,
          title,
          description,
          is_public,
          tags,
          created_at,
          updated_at,
          root,
          folder_id,
          sort_order
        `)
        .eq('created_by', user.id)
        .order('sort_order', { ascending: true })

      // Filter by folder - null for root level maps
      if (folderId) {
        query = query.eq('folder_id', folderId)
      } else {
        query = query.is('folder_id', null)
      }

      const { data, error } = await query

      if (error) throw error
      return data as MindMap[]
    },
    enabled: !!user,
  })
}

// Update map sort order within folder
export function useUpdateMapSortOrder() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  
  return useMutation({
    mutationFn: async ({ 
      mapId, 
      sortOrder 
    }: { 
      mapId: string; 
      sortOrder: number 
    }) => {
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('mind_maps')
        .update({ sort_order: sortOrder })
        .eq('id', mapId)
        .eq('created_by', user.id)
        .select()
        .single()

      if (error) throw error
      return data as MindMap
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maps', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['folder-hierarchy', user?.id] })
    },
  })
}