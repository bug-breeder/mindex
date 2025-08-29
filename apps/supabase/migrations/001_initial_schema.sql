-- Mindex Database Schema
-- This creates the initial database structure for the Mindex application

-- Enable Row Level Security
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Mind maps table
CREATE TABLE public.mind_maps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Untitled Mind Map',
  description TEXT,
  root JSONB NOT NULL, -- The mind map data structure
  theme JSONB, -- Theme configuration
  metadata JSONB, -- Additional metadata like source URL, import info, etc.
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_public BOOLEAN DEFAULT FALSE NOT NULL,
  is_template BOOLEAN DEFAULT FALSE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0 NOT NULL
);

-- Mind map sharing/collaboration
CREATE TABLE public.mind_map_shares (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  mind_map_id UUID REFERENCES public.mind_maps(id) ON DELETE CASCADE NOT NULL,
  shared_with UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  permission TEXT CHECK (permission IN ('view', 'edit', 'admin')) DEFAULT 'view' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(mind_map_id, shared_with)
);

-- Content import history
CREATE TABLE public.import_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  source_url TEXT,
  source_type TEXT CHECK (source_type IN ('webpage', 'youtube', 'pdf', 'document', 'text')) NOT NULL,
  content_title TEXT,
  mind_map_id UUID REFERENCES public.mind_maps(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending' NOT NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ
);

-- Mind map templates
CREATE TABLE public.templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  root JSONB NOT NULL,
  theme JSONB,
  category TEXT DEFAULT 'general' NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE NOT NULL,
  usage_count INTEGER DEFAULT 0 NOT NULL
);

-- Row Level Security Policies

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Mind maps
ALTER TABLE public.mind_maps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own mind maps" ON public.mind_maps
  FOR SELECT USING (
    created_by = auth.uid() OR 
    is_public = true OR
    id IN (
      SELECT mind_map_id FROM public.mind_map_shares 
      WHERE shared_with = auth.uid()
    )
  );

CREATE POLICY "Users can create mind maps" ON public.mind_maps
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own mind maps or shared maps with edit permission" ON public.mind_maps
  FOR UPDATE USING (
    created_by = auth.uid() OR
    id IN (
      SELECT mind_map_id FROM public.mind_map_shares 
      WHERE shared_with = auth.uid() AND permission IN ('edit', 'admin')
    )
  );

CREATE POLICY "Users can delete their own mind maps" ON public.mind_maps
  FOR DELETE USING (created_by = auth.uid());

-- Mind map shares
ALTER TABLE public.mind_map_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view shares for their maps or maps shared with them" ON public.mind_map_shares
  FOR SELECT USING (
    shared_with = auth.uid() OR
    mind_map_id IN (SELECT id FROM public.mind_maps WHERE created_by = auth.uid())
  );

CREATE POLICY "Users can create shares for their own maps" ON public.mind_map_shares
  FOR INSERT WITH CHECK (
    mind_map_id IN (SELECT id FROM public.mind_maps WHERE created_by = auth.uid())
  );

CREATE POLICY "Users can delete shares for their own maps" ON public.mind_map_shares
  FOR DELETE USING (
    mind_map_id IN (SELECT id FROM public.mind_maps WHERE created_by = auth.uid())
  );

-- Import history
ALTER TABLE public.import_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own import history" ON public.import_history
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own import history" ON public.import_history
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own import history" ON public.import_history
  FOR UPDATE USING (user_id = auth.uid());

-- Templates
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view templates" ON public.templates
  FOR SELECT USING (true);

CREATE POLICY "Users can create templates" ON public.templates
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own templates" ON public.templates
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own templates" ON public.templates
  FOR DELETE USING (created_by = auth.uid());

-- Functions and Triggers

-- Function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mind_maps_updated_at 
  BEFORE UPDATE ON public.mind_maps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_templates_updated_at 
  BEFORE UPDATE ON public.templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for better performance
CREATE INDEX idx_mind_maps_created_by ON public.mind_maps(created_by);
CREATE INDEX idx_mind_maps_created_at ON public.mind_maps(created_at DESC);
CREATE INDEX idx_mind_maps_is_public ON public.mind_maps(is_public);
CREATE INDEX idx_mind_maps_tags ON public.mind_maps USING GIN(tags);
CREATE INDEX idx_mind_map_shares_mind_map_id ON public.mind_map_shares(mind_map_id);
CREATE INDEX idx_mind_map_shares_shared_with ON public.mind_map_shares(shared_with);
CREATE INDEX idx_import_history_user_id ON public.import_history(user_id);
CREATE INDEX idx_import_history_created_at ON public.import_history(created_at DESC);
CREATE INDEX idx_templates_category ON public.templates(category);
CREATE INDEX idx_templates_is_featured ON public.templates(is_featured);