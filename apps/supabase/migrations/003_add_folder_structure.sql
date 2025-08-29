-- Add folder structure to support hierarchical organization of mind maps
-- Migration: 003_add_folder_structure.sql

-- Create folders table
CREATE TABLE public.folders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  color TEXT DEFAULT '#6366f1', -- Folder color for visual organization
  icon TEXT DEFAULT 'folder', -- Icon identifier for the folder
  is_expanded BOOLEAN DEFAULT true, -- UI state for folder expansion
  sort_order INTEGER DEFAULT 0 -- For custom ordering within parent folder
);

-- Add folder_id to mind_maps table
ALTER TABLE public.mind_maps 
ADD COLUMN folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL;

-- Add sort_order to mind_maps for ordering within folders
ALTER TABLE public.mind_maps 
ADD COLUMN sort_order INTEGER DEFAULT 0;

-- Row Level Security for folders
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

-- Folders policies
CREATE POLICY "Users can view their own folders" ON public.folders
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can create their own folders" ON public.folders
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own folders" ON public.folders
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own folders" ON public.folders
  FOR DELETE USING (created_by = auth.uid());

-- Update existing policies for mind_maps to consider folder ownership
-- Note: We don't need to recreate the policies, just ensure they work with the new folder_id field

-- Function to check if user has access to a folder (including through hierarchy)
CREATE OR REPLACE FUNCTION public.user_has_folder_access(folder_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_folder_id UUID := folder_uuid;
  folder_owner UUID;
BEGIN
  -- If folder_id is null, user has access (root level)
  IF folder_uuid IS NULL THEN
    RETURN TRUE;
  END IF;

  -- Check folder ownership by traversing up the hierarchy
  WHILE current_folder_id IS NOT NULL LOOP
    SELECT created_by, parent_id INTO folder_owner, current_folder_id
    FROM public.folders 
    WHERE id = current_folder_id;
    
    -- If we found the folder and user owns it, return true
    IF folder_owner = user_uuid THEN
      RETURN TRUE;
    END IF;
    
    -- If folder not found, return false
    IF folder_owner IS NULL THEN
      RETURN FALSE;
    END IF;
  END LOOP;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get folder path (for breadcrumbs, full path display)
CREATE OR REPLACE FUNCTION public.get_folder_path(folder_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  path_parts TEXT[] := '{}';
  current_folder_id UUID := folder_uuid;
  folder_name TEXT;
  parent_folder_id UUID;
BEGIN
  -- If folder_id is null, return empty string (root level)
  IF folder_uuid IS NULL THEN
    RETURN '';
  END IF;

  -- Build path by traversing up the hierarchy
  WHILE current_folder_id IS NOT NULL LOOP
    SELECT name, parent_id INTO folder_name, parent_folder_id
    FROM public.folders 
    WHERE id = current_folder_id;
    
    -- If folder not found, break
    IF folder_name IS NULL THEN
      EXIT;
    END IF;
    
    -- Prepend folder name to path
    path_parts := folder_name || path_parts;
    current_folder_id := parent_folder_id;
  END LOOP;
  
  RETURN array_to_string(path_parts, ' / ');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to prevent circular references in folder hierarchy
CREATE OR REPLACE FUNCTION public.check_folder_hierarchy()
RETURNS TRIGGER AS $$
DECLARE
  current_id UUID := NEW.parent_id;
  max_depth INTEGER := 50; -- Prevent infinite loops
  depth INTEGER := 0;
BEGIN
  -- If no parent, no circular reference possible
  IF NEW.parent_id IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Check if trying to set parent to self
  IF NEW.id = NEW.parent_id THEN
    RAISE EXCEPTION 'A folder cannot be its own parent';
  END IF;
  
  -- Traverse up the hierarchy to check for circular reference
  WHILE current_id IS NOT NULL AND depth < max_depth LOOP
    -- If we encounter the current folder ID in the hierarchy, it's circular
    IF current_id = NEW.id THEN
      RAISE EXCEPTION 'Circular reference detected in folder hierarchy';
    END IF;
    
    -- Get the parent of the current folder
    SELECT parent_id INTO current_id 
    FROM public.folders 
    WHERE id = current_id;
    
    depth := depth + 1;
  END LOOP;
  
  -- Check max depth
  IF depth >= max_depth THEN
    RAISE EXCEPTION 'Folder hierarchy too deep (max depth: %)', max_depth;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to check folder hierarchy on insert/update
CREATE TRIGGER check_folder_hierarchy_trigger
  BEFORE INSERT OR UPDATE ON public.folders
  FOR EACH ROW EXECUTE FUNCTION public.check_folder_hierarchy();

-- Trigger for updated_at on folders
CREATE TRIGGER update_folders_updated_at 
  BEFORE UPDATE ON public.folders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for better performance
CREATE INDEX idx_folders_created_by ON public.folders(created_by);
CREATE INDEX idx_folders_parent_id ON public.folders(parent_id);
CREATE INDEX idx_folders_created_at ON public.folders(created_at DESC);
CREATE INDEX idx_folders_sort_order ON public.folders(parent_id, sort_order);

-- Update mind_maps indexes
CREATE INDEX idx_mind_maps_folder_id ON public.mind_maps(folder_id);
CREATE INDEX idx_mind_maps_folder_sort ON public.mind_maps(folder_id, sort_order);

-- Create some default folder structure for existing users (optional)
-- This can be run separately if needed

-- Function to create default folders for a user
CREATE OR REPLACE FUNCTION public.create_default_folders(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
  work_folder_id UUID;
  personal_folder_id UUID;
  archive_folder_id UUID;
BEGIN
  -- Create Work folder
  INSERT INTO public.folders (name, description, created_by, color, icon, sort_order)
  VALUES ('Work', 'Work-related mind maps', user_uuid, '#3b82f6', 'briefcase', 1)
  RETURNING id INTO work_folder_id;
  
  -- Create Personal folder
  INSERT INTO public.folders (name, description, created_by, color, icon, sort_order)
  VALUES ('Personal', 'Personal projects and ideas', user_uuid, '#10b981', 'home', 2)
  RETURNING id INTO personal_folder_id;
  
  -- Create Archive folder
  INSERT INTO public.folders (name, description, created_by, color, icon, sort_order)
  VALUES ('Archive', 'Archived mind maps', user_uuid, '#6b7280', 'archive', 3)
  RETURNING id INTO archive_folder_id;
  
  -- Create subfolders for Work
  INSERT INTO public.folders (name, description, parent_id, created_by, color, icon, sort_order)
  VALUES 
    ('Projects', 'Current work projects', work_folder_id, user_uuid, '#3b82f6', 'folder', 1),
    ('Meetings', 'Meeting notes and brainstorms', work_folder_id, user_uuid, '#8b5cf6', 'users', 2);
    
  -- Create subfolders for Personal
  INSERT INTO public.folders (name, description, parent_id, created_by, color, icon, sort_order)
  VALUES 
    ('Learning', 'Study notes and learning materials', personal_folder_id, user_uuid, '#f59e0b', 'academic-cap', 1),
    ('Ideas', 'Random ideas and brainstorms', personal_folder_id, user_uuid, '#ef4444', 'light-bulb', 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: The create_default_folders function can be called manually or
-- integrated into the user registration process if desired
