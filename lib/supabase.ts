import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create a single instance of the Supabase client with fetch options
export const supabase = createBrowserClient(
  supabaseUrl, 
  supabaseAnonKey,
  {
    auth: {
      flowType: 'pkce',
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      fetch: (...args) => {
        return fetch(...args).catch(err => {
          console.error('Supabase fetch error:', err);
          throw err;
        });
      }
    }
  }
)

// Type for JSON responses
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      portfolios: {
        Row: {
          id: string
          user_id: string
          holdings: Json[]
          settings: {
            currency: string
            refresh_interval: number
          }
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          holdings?: Json[]
          settings?: Json
        }
        Update: {
          holdings?: Json[]
          settings?: Json
          updated_at?: string
        }
      }
      price_alerts: {
        Row: {
          id: string
          user_id: string
          coin_id: string
          price: number
          condition: 'above' | 'below'
          created_at: string
        }
      }
    }
  }
}





















