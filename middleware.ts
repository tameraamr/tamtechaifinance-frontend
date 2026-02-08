import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';

  // Allow Googlebot and Bingbot to bypass authentication for indexing
  const isBot = /Googlebot|Bingbot/i.test(userAgent);

  // Protected routes that require authentication
  const protectedRoutes = ['/journal', '/dashboard', '/account', '/portfolio'];

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !isBot) {
    // Check for auth token in cookies
    const authToken = request.cookies.get('auth-token');

    if (!authToken) {
      // Prevent redirect loop: don't redirect if already on /login or /account
      if (pathname !== '/login' && pathname !== '/account') {
        const loginUrl = new URL('/login', request.url);
        // Preserve the original URL for redirect after login
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // Force HTTPS and www unification in production
  if (process.env.NODE_ENV === 'production') {
    const host = request.headers.get('host') || '';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';

    // Redirect www to non-www
    if (host.startsWith('www.')) {
      const newUrl = new URL(request.url);
      newUrl.host = host.replace('www.', '');
      newUrl.protocol = 'https';
      return NextResponse.redirect(newUrl, { status: 301 });
    }

    // Force HTTPS
    if (protocol !== 'https') {
      const httpsUrl = new URL(request.url);
      httpsUrl.protocol = 'https';
      return NextResponse.redirect(httpsUrl, { status: 301 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};