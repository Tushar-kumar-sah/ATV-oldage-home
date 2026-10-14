import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const FALLBACK_SECRET = '4f8b9a23e71d46c8b931980f72a40d5e82b7408f657a1b3c9d2e1f4a5b6c7d8e';
const AUTH_SECRET = process.env.NEXTAUTH_SECRET || FALLBACK_SECRET;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    const rawCookies = req.cookies.getAll().map((c) => c.name);

    // Try decoding with both process.env and fallback secret
    let token = await getToken({
      req,
      secret: AUTH_SECRET,
    });

    if (!token && process.env.NEXTAUTH_SECRET) {
      token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });
    }

    if (!token && req.cookies.has('next-auth.session-token')) {
      token = await getToken({
        req,
        secret: AUTH_SECRET,
        cookieName: 'next-auth.session-token',
      });
    }

    if (!token && req.cookies.has('__Secure-next-auth.session-token')) {
      token = await getToken({
        req,
        secret: AUTH_SECRET,
        cookieName: '__Secure-next-auth.session-token',
      });
    }

    console.log(
      `[Middleware] Path: ${pathname} | Token Found: ${!!token} (${token?.role || 'none'}) | Cookies: [${rawCookies.join(', ')}]`
    );

    // 1. Not signed in
    if (!token) {
      // Check if session token cookie actually exists (e.g. race condition or timing)
      const hasSessionCookie = req.cookies.has('next-auth.session-token') || req.cookies.has('__Secure-next-auth.session-token');

      // If cookie exists but decode failed, log warning
      if (hasSessionCookie) {
        console.warn('[Middleware] Session cookie exists in request, but token decoding returned null!');
      }

      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname === '/admin' ? '/admin/dashboard' : pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 2. Pending approval
    if (token.status === 'pending') {
      const pendingUrl = new URL('/pending-approval', req.url);
      return NextResponse.redirect(pendingUrl);
    }

    // 3. Deactivated or rejected
    if (token.status === 'rejected' || token.status === 'deactivated') {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('error', 'AccountDeactivated');
      return NextResponse.redirect(loginUrl);
    }

    // Redirect root /admin directly to /admin/dashboard
    if (pathname === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }

    // 4. Role-based restrictions (Super Admin only sections)
    const superAdminOnlyRoutes = ['/admin/users', '/admin/activity'];
    const isSuperAdminOnly = superAdminOnlyRoutes.some((route) => pathname.startsWith(route));

    if (isSuperAdminOnly && token.role !== 'super_admin') {
      const dashboardUrl = new URL('/admin/dashboard', req.url);
      dashboardUrl.searchParams.set('denied', 'super_admin_required');
      return NextResponse.redirect(dashboardUrl);
    }

    // Header propagation for downstream consumption
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', token.id as string);
    requestHeaders.set('x-user-role', token.role as string);
    requestHeaders.set('x-user-status', token.status as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
