import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();

  try {
    const supabase = createMiddlewareClient(
      { req: request, res },
      {
        cookies: {
          get(name: string) {
            const cookie = request.cookies.get(name);
            return cookie?.value;
          },
          set(name: string, value: string, options: any) {
            res.cookies.set({
              name,
              value,
              ...options,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            });
          },
          remove(name: string) {
            res.cookies.set({
              name,
              value: '',
              maxAge: 0,
            });
          },
        },
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




