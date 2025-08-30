import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Database types based on the schema
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          owner: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      mindmaps: {
        Row: {
          id: string
          project_id: string
          owner: string
          title: string
          source_type: 'web' | 'youtube' | 'pdf' | 'doc' | 'text' | 'blank'
          source_ref: string | null
          map_json: Record<string, unknown>
          version: number
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          owner: string
          title: string
          source_type?: 'web' | 'youtube' | 'pdf' | 'doc' | 'text' | 'blank'
          source_ref?: string | null
          map_json: Record<string, unknown>
          version?: number
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          owner?: string
          title?: string
          source_type?: 'web' | 'youtube' | 'pdf' | 'doc' | 'text' | 'blank'
          source_ref?: string | null
          map_json?: Record<string, unknown>
          version?: number
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}