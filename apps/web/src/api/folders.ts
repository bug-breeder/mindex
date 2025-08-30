import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { 
  Folder, 
  MindMap,
  FolderWithChildren, 
  CreateFolderRequest, 
  UpdateFolderRequest,
  FolderTreeItem 
} from '@/types'

// Fetch all folders for the current user
export function useFolders() {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: ['folders', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('created_by', user.id)
        .order('sort_order', { ascending: true })

      if (error) throw error
      return data as Folder[]
    },
    enabled: !!user,
  })
}

// Fetch folder hierarchy with children
export function useFolderHierarchy() {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: ['folder-hierarchy', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')
      
      // Fetch all folders
      const { data: folders, error: foldersError } = await supabase
        .from('folders')
        .select('*')
        .eq('created_by', user.id)
        .order('sort_order', { ascending: true })

      if (foldersError) throw foldersError

      // Fetch mind maps with folder assignments
      const { data: mindMaps, error: mapsError } = await supabase
        .from('mind_maps')
        .select(`
          id,
          title,
          folder_id,
          sort_order,
          created_at,
          updated_at
        `)
        .eq('created_by', user.id)
        .order('sort_order', { ascending: true })

      if (mapsError) throw mapsError

      // Build hierarchical structure
      const folderMap = new Map<string, FolderWithChildren>()
      const rootFolders: FolderWithChildren[] = []

      // Initialize folders in map
      folders.forEach(folder => {
        folderMap.set(folder.id, { ...folder, children: [], mindMaps: [] })
      })

      // Build hierarchy
      folders.forEach(folder => {
        const folderWithChildren = folderMap.get(folder.id)!
        if (folder.parent_id) {
          const parent = folderMap.get(folder.parent_id)
          if (parent) {
            parent.children!.push(folderWithChildren)
          }
        } else {
          rootFolders.push(folderWithChildren)
        }
      })

      // Add mind maps to their respective folders
      mindMaps.forEach(mindMap => {
        if (mindMap.folder_id) {
          const folder = folderMap.get(mindMap.folder_id)
          if (folder) {
            folder.mindMaps!.push(mindMap)
          }
        }
      })

      return { rootFolders, allFolders: folders, allMindMaps: mindMaps }
    },
    enabled: !!user,
  })
}

// Fetch a specific folder by ID
export function useFolder(id: string) {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: ['folder', id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('id', id)
        .eq('created_by', user.id)
        .single()

      if (error) throw error
      return data as Folder
    },
    enabled: !!user && !!id,
  })
}

// Create a new folder
export function useCreateFolder() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  
  return useMutation({
    mutationFn: async (folderData: CreateFolderRequest) => {
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('folders')
        .insert({
          ...folderData,
          created_by: user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data as Folder
    },
    onSuccess: () => {
      // Invalidate and refetch folders
      queryClient.invalidateQueries({ queryKey: ['folders', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['folder-hierarchy', user?.id] })
    },
  })
}

// Update a folder
export function useUpdateFolder() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateFolderRequest }) => {
      if (!user) throw new Error('User not authenticated')
      
      const { data: updatedFolder, error } = await supabase
        .from('folders')
        .update(data)
        .eq('id', id)
        .eq('created_by', user.id)
        .select()
        .single()

      if (error) throw error
      return updatedFolder as Folder
    },
    onSuccess: (_, { id }) => {
      // Invalidate and refetch folders
      queryClient.invalidateQueries({ queryKey: ['folders', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['folder-hierarchy', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['folder', id] })
    },
  })
}

// Delete a folder
export function useDeleteFolder() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  
  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User not authenticated')
      
      // Note: This will also move all child folders and mind maps to parent or root
      // due to ON DELETE CASCADE and ON DELETE SET NULL in the schema
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', id)
        .eq('created_by', user.id)

      if (error) throw error
    },
    onSuccess: () => {
      // Invalidate and refetch folders and maps
      queryClient.invalidateQueries({ queryKey: ['folders', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['folder-hierarchy', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['maps', user?.id] })
    },
  })
}

// Move folder to a new parent
export function useMoveFolder() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  
  return useMutation({
    mutationFn: async ({ folderId, newParentId, sortOrder }: { 
      folderId: string; 
      newParentId?: string; 
      sortOrder?: number 
    }) => {
      if (!user) throw new Error('User not authenticated')
      
      const updateData: Partial<Pick<Folder, 'parent_id' | 'sort_order'>> = {}
      if (newParentId !== undefined) updateData.parent_id = newParentId
      if (sortOrder !== undefined) updateData.sort_order = sortOrder
      
      const { data, error } = await supabase
        .from('folders')
        .update(updateData)
        .eq('id', folderId)
        .eq('created_by', user.id)
        .select()
        .single()

      if (error) throw error
      return data as Folder
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['folder-hierarchy', user?.id] })
    },
  })
}

// Create default folders for a new user
export function useCreateDefaultFolders() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  
  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated')
      
      // Call the database function to create default folders
      const { data, error } = await supabase.rpc('create_default_folders', {
        user_uuid: user.id
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['folder-hierarchy', user?.id] })
    },
  })
}

// Helper function to build folder tree for UI
export function buildFolderTree(folders: Folder[], mindMaps: MindMap[] = []): FolderTreeItem[] {
  const folderMap = new Map<string, FolderTreeItem>()
  const rootItems: FolderTreeItem[] = []

  // Create folder items
  folders.forEach(folder => {
    const item: FolderTreeItem = {
      id: folder.id,
      name: folder.name,
      type: 'folder',
      children: [],
      icon: folder.icon,
      color: folder.color,
      isExpanded: folder.is_expanded,
      sortOrder: folder.sort_order,
      parentId: folder.parent_id
    }
    folderMap.set(folder.id, item)
  })

  // Build folder hierarchy
  folders.forEach(folder => {
    const item = folderMap.get(folder.id)!
    if (folder.parent_id) {
      const parent = folderMap.get(folder.parent_id)
      if (parent) {
        parent.children!.push(item)
      }
    } else {
      rootItems.push(item)
    }
  })

  // Add mind maps to their folders
  mindMaps.forEach(mindMap => {
    const mapItem: FolderTreeItem = {
      id: mindMap.id,
      name: mindMap.title,
      type: 'mindmap',
      sortOrder: mindMap.sort_order || 0,
      parentId: mindMap.folder_id
    }

    if (mindMap.folder_id) {
      const parent = folderMap.get(mindMap.folder_id)
      if (parent) {
        parent.children!.push(mapItem)
      }
    } else {
      rootItems.push(mapItem)
    }
  })

  // Sort children within each folder
  const sortChildren = (items: FolderTreeItem[]) => {
    items.sort((a, b) => {
      // Folders first, then mind maps
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1
      }
      return a.sortOrder - b.sortOrder
    })
    
    items.forEach(item => {
      if (item.children) {
        sortChildren(item.children)
      }
    })
  }

  sortChildren(rootItems)
  return rootItems
}

// Get folder path as breadcrumb
export async function getFolderPath(folderId?: string): Promise<string> {
  if (!folderId) return ''
  
  const { data, error } = await supabase.rpc('get_folder_path', {
    folder_uuid: folderId
  })

  if (error) throw error
  return data || ''
}
