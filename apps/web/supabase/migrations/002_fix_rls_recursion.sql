-- Fix infinite recursion in RLS policies
-- Drop the problematic policies and recreate them without circular references

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Users can view their own mind maps" ON public.mind_maps;
DROP POLICY IF EXISTS "Users can update their own mind maps or shared maps with edit permission" ON public.mind_maps;
DROP POLICY IF EXISTS "Users can view shares for their maps or maps shared with them" ON public.mind_map_shares;

-- Recreate mind_maps policies without referencing mind_map_shares
CREATE POLICY "Users can view their own mind maps or public maps" ON public.mind_maps
  FOR SELECT USING (
    created_by = auth.uid() OR is_public = true
  );

CREATE POLICY "Users can update their own mind maps" ON public.mind_maps
  FOR UPDATE USING (created_by = auth.uid());

-- Recreate mind_map_shares policy without circular reference
CREATE POLICY "Users can view shares for their own maps" ON public.mind_map_shares
  FOR SELECT USING (shared_with = auth.uid());

-- Add a separate policy for map owners to manage shares
CREATE POLICY "Map owners can manage shares" ON public.mind_map_shares
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.mind_maps 
      WHERE mind_maps.id = mind_map_shares.mind_map_id 
      AND mind_maps.created_by = auth.uid()
    )
  );