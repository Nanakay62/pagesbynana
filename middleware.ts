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

  // 1. Vercel free domains (*.vercel.app) do not support sub-subdomains like admin.*.vercel.app
  // On vercel.app domains, allow direct /admin access without redirecting to an unreachable domain.
  if (hostname.endsWith('.vercel.app')) {
    return NextResponse.next();
  }

  const isAdminSubdomain = hostname.startsWith('admin.');

  // 2. If on the admin subdomain (e.g. admin.localhost:3000 or admin.pagesbynana.com)
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

  // 3. If on main reader site with a custom domain or localhost:
  // When trying to access /admin directly on custom domain, redirect to admin.<domain>
  if (pathname.startsWith('/admin')) {
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
