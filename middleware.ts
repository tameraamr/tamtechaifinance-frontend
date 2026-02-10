import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';

  // Allow Googlebot and Bingbot to bypass authentication for indexing
  const isBot = /Googlebot|Bingbot/i.test(userAgent);

  // Note: Authentication is now handled by individual pages via auth modal
  // Removed middleware redirect to /login as that route doesn't exist

  // Force HTTPS and www unification in production
  if (process.env.NODE_ENV === 'production') {
    const host = request.headers.get('host') || '';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';

    // Redirect non-www to www
    if (!host.startsWith('www.')) {
      const newUrl = new URL(request.url);
      newUrl.host = `www.${host}`;
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