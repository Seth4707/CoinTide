import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  // Make sure cookies are properly set with secure options in production
  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ 
              name, 
              value, 
              ...options,
              // Add these options for production environment
              path: '/',
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            })
          },
          remove(name: string, options: any) {
            cookieStore.set({ 
              name, 
              value: '', 
              ...options,
              // Add these options for production environment
              path: '/',
              maxAge: 0,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            })
          },
        },
      }
    )

    try {
      await supabase.auth.exchangeCodeForSession(code)
    } catch (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(new URL('/auth?error=callback_error', request.url))
    }
  }

  return NextResponse.redirect(new URL('/', request.url))
}




