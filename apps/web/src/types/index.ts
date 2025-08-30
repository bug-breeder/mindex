import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// Database Types

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Folder {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  color: string;
  icon: string;
  is_expanded: boolean;
  sort_order: number;
}

export interface MindMap {
  id: string;
  title: string;
  description?: string;
  root: Record<string, unknown>; // MindElixir JSON structure
  theme?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  is_template: boolean;
  tags: string[];
  view_count: number;
  folder_id?: string;
  sort_order: number;
}

export interface MindMapShare {
  id: string;
  mind_map_id: string;
  shared_with: string;
  permission: 'view' | 'edit' | 'admin';
  created_at: string;
}

export interface ImportHistory {
  id: string;
  user_id: string;
  source_url?: string;
  source_type: 'webpage' | 'youtube' | 'pdf' | 'document' | 'text';
  content_title?: string;
  mind_map_id?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

export interface Template {
  id: string;
  title: string;
  description?: string;
  root: Record<string, unknown>;
  theme?: Record<string, unknown>;
  category: string;
  tags: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  is_featured: boolean;
  usage_count: number;
}

// Extended types with relationships

export interface FolderWithChildren extends Folder {
  children?: FolderWithChildren[];
  mindMaps?: MindMap[];
}

export interface MindMapWithFolder extends MindMap {
  folder?: Folder;
}

export interface FolderTreeItem {
  id: string;
  name: string;
  type: 'folder' | 'mindmap';
  children?: FolderTreeItem[];
  icon?: string;
  color?: string;
  isExpanded?: boolean;
  sortOrder: number;
  parentId?: string;
}

// API Response types

export interface FoldersResponse {
  folders: Folder[];
}

export interface CreateFolderRequest {
  name: string;
  description?: string;
  parent_id?: string;
  color?: string;
  icon?: string;
}

export interface UpdateFolderRequest {
  name?: string;
  description?: string;
  parent_id?: string;
  color?: string;
  icon?: string;
  is_expanded?: boolean;
  sort_order?: number;
}

export interface MoveMindMapRequest {
  folder_id?: string;
  sort_order?: number;
}
