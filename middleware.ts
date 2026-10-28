import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0]; // strip port if any
  const pathname = url.pathname;

  // Ignore static assets, next internal files, and favicon
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const isAdminSubdomain = hostname.startsWith('admin.');

  // 1. If on the admin subdomain (e.g. admin.localhost:3000 or admin.pagesbynana.com)
  if (isAdminSubdomain) {
    // Root of admin subdomain points to /admin dashboard
    if (pathname === '/') {
      url.pathname = '/admin';
      return NextResponse.rewrite(url);
    }

    // Sub-paths like /books or /import rewrite to /admin/books, /admin/import
    if (!pathname.startsWith('/admin')) {
      url.pathname = `/admin${pathname}`;
      return NextResponse.rewrite(url);
    }

    return NextResponse.next();
  }

  // 2. If on main reader site (e.g. localhost:3000 or pagesbynana.com):
  // When trying to access /admin directly on the main domain, redirect to the admin subdomain
  if (pathname.startsWith('/admin')) {
    // If on raw IP 127.0.0.1, redirect to admin.localhost with current port
    const port = host.includes(':') ? `:${host.split(':')[1]}` : '';
    const adminHost = hostname === '127.0.0.1' || hostname === 'localhost'
      ? `admin.localhost${port}`
      : `admin.${host}`;

    const protocol = request.headers.get('x-forwarded-proto') || (url.protocol.replace(':', ''));
    const adminRedirectUrl = new URL(pathname, `${protocol}://${adminHost}`);
    adminRedirectUrl.search = url.search;
    return NextResponse.redirect(adminRedirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
