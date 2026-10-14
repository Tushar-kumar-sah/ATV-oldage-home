import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // 1. Not signed in
    if (!token) {
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
