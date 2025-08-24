# Data Model — Supabase (Postgres + Storage)

## Tables (simple path)
```sql
-- projects: a container for mind maps
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- mindmaps: store entire map as JSONB
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

-- sources: normalized record for auditability
create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  mindmap_id uuid not null references public.mindmaps(id) on delete cascade,
  url text,
  storage_path text,
  sha256 text, -- content hash for caching
  meta jsonb,
  created_at timestamp with time zone default now()
);

-- shares: link-based or user invites
create table if not exists public.shares (
  id uuid primary key default gen_random_uuid(),
  mindmap_id uuid not null references public.mindmaps(id) on delete cascade,
  role text check (role in ('viewer','commenter','editor')) not null default 'viewer',
  invited_email text,
  token text unique,
  expires_at timestamp with time zone
);
```

## RLS Policies (essential excerpts)
```sql
-- enable RLS
alter table public.projects enable row level security;
alter table public.mindmaps enable row level security;
alter table public.sources enable row level security;
alter table public.shares enable row level security;

-- owners only
create policy "project owner can CRUD" on public.projects
  for all using (owner = auth.uid()) with check (owner = auth.uid());

create policy "map owner can CRUD" on public.mindmaps
  for all using (owner = auth.uid()) with check (owner = auth.uid());

-- shared access via shares.token (signed role in JWT from Edge Fn), example pattern:
create policy "shared viewers can read" on public.mindmaps
  for select using (
    is_public
    or
    (exists (
      select 1 from public.shares s
      where s.mindmap_id = mindmaps.id
        and s.role in ('viewer','commenter','editor')
        and current_setting('request.jwt.claims', true)::jsonb ? 'share_role'
    ))
  );
```

## Storage
- Bucket: `uploads/` for PDFs and DOCX
- Bucket: `exports/` for PNG/SVG/OPML
- Public access **disabled**; use signed URLs.

## Mind Map JSON (internal schema)
```json
{
  "id": "uuid",
  "title": "string",
  "root": {
    "id": "node-1",
    "topic": "Root Topic",
    "expanded": true,
    "notes": "",
    "url": "",
    "tags": ["string"],
    "children": [
      {
        "id": "node-2",
        "topic": "Child",
        "expanded": true,
        "notes": "Optional",
        "url": "https://...",
        "meta": {
          "timecode": 125,
          "sourceSpan": {"start": 100, "end": 430}
        },
        "children": []
      }
    ]
  },
  "theme": {
    "layout": "right-balanced",
    "branchPalette": "semantic"
  }
}
```
> This structure maps cleanly to Mind‑Elixir’s tree model and can be transformed to/from OPML & Markdown.

## Versioning
- Increment `version` for major structural changes.
- Store snapshots as rows in a `map_versions` table (optional) or as Storage JSON files.

