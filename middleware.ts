import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();

  try {
    const supabase = createMiddlewareClient(
      { req: request, res },
      {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        options: {
          db: {
            schema: 'public'
          }
        },
        cookieOptions: {
          name: 'sb-auth',
          domain: '',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        }
      }
    );

    const { data: { session } } = await supabase.auth.getSession();

    if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
      const redirectUrl = new URL('/auth', request.url);
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return res;
  }
}

export const config = {
  matcher: ['/dashboard/:path*']
};









