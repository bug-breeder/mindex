-- Create projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create mindmaps table
create table if not exists public.mindmaps (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  owner uuid not null references auth.users(id) on delete cascade,
  title text not null,
  source_type text check (source_type in ('web','youtube','pdf','doc','text','blank')) default 'blank',
  source_ref text, -- url or storage path or video id
  map_json jsonb not null, -- see schema below
  version int default 1,
  is_public boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create sources table for auditability
create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  mindmap_id uuid not null references public.mindmaps(id) on delete cascade,
  url text,
  storage_path text,
  sha256 text, -- content hash for caching
  meta jsonb,
  created_at timestamp with time zone default now()
);

-- Create shares table for link-based or user invites
create table if not exists public.shares (
  id uuid primary key default gen_random_uuid(),
  mindmap_id uuid not null references public.mindmaps(id) on delete cascade,
  role text check (role in ('viewer','commenter','editor')) not null default 'viewer',
  invited_email text,
  token text unique,
  expires_at timestamp with time zone
);

-- Enable RLS
alter table public.projects enable row level security;
alter table public.mindmaps enable row level security;
alter table public.sources enable row level security;
alter table public.shares enable row level security;

-- RLS Policies for projects
create policy "project owner can CRUD" on public.projects
  for all using (owner = auth.uid()) with check (owner = auth.uid());

-- RLS Policies for mindmaps
create policy "map owner can CRUD" on public.mindmaps
  for all using (owner = auth.uid()) with check (owner = auth.uid());

-- RLS Policies for sources
create policy "source owner can CRUD" on public.sources
  for all using (
    exists (
      select 1 from public.mindmaps m
      where m.id = sources.mindmap_id
        and m.owner = auth.uid()
    )
  );

-- RLS Policies for shares
create policy "share creator can CRUD" on public.shares
  for all using (
    exists (
      select 1 from public.mindmaps m
      where m.id = shares.mindmap_id
        and m.owner = auth.uid()
    )
  );

-- Shared viewers can read mindmaps (simplified - for production, use JWT claims)
create policy "shared viewers can read" on public.mindmaps
  for select using (
    is_public
    or
    owner = auth.uid()
    or
    exists (
      select 1 from public.shares s
      where s.mindmap_id = mindmaps.id
        and s.role in ('viewer','commenter','editor')
        and (s.expires_at is null or s.expires_at > now())
    )
  );

-- Create indexes for better performance
create index if not exists idx_projects_owner on public.projects(owner);
create index if not exists idx_mindmaps_owner on public.mindmaps(owner);
create index if not exists idx_mindmaps_project_id on public.mindmaps(project_id);
create index if not exists idx_mindmaps_updated_at on public.mindmaps(updated_at desc);
create index if not exists idx_sources_mindmap_id on public.sources(mindmap_id);
create index if not exists idx_sources_sha256 on public.sources(sha256);
create index if not exists idx_shares_mindmap_id on public.shares(mindmap_id);
create index if not exists idx_shares_token on public.shares(token);

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers
create trigger handle_projects_updated_at
  before update on public.projects
  for each row execute procedure public.handle_updated_at();

create trigger handle_mindmaps_updated_at
  before update on public.mindmaps
  for each row execute procedure public.handle_updated_at();

-- Insert a default project for new users
create or replace function public.create_default_project()
returns trigger as $$
begin
  insert into public.projects (owner, name)
  values (new.id, 'Default Project');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create default project when user signs up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_default_project();