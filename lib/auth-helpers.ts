import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { NextResponse } from 'next/server';

export async function getServerAuthSession() {
  return await getServerSession(authOptions);
}

/**
 * Ensures user is authenticated and has an active status.
 * Throws an error or returns session.
 */
export async function requireAuth() {
  const session = await getServerAuthSession();

  if (!session || !session.user) {
    throw new Error('UNAUTHORIZED');
  }

  if (session.user.status === 'pending') {
    throw new Error('ACCOUNT_PENDING');
  }

  if (session.user.status === 'deactivated' || session.user.status === 'rejected') {
    throw new Error('ACCOUNT_INACTIVE');
  }

  return session;
}

/**
 * Ensures user is authenticated with Super Admin role.
 */
export async function requireSuperAdmin() {
  const session = await requireAuth();

  if (session.user.role !== 'super_admin') {
    throw new Error('FORBIDDEN_SUPER_ADMIN_REQUIRED');
  }

  return session;
}

/**
 * Standard API error response handler
 */
export function handleApiAuthError(error: any) {
  if (error?.message === 'UNAUTHORIZED') {
    return NextResponse.json({ error: 'Authentication required. Please sign in.' }, { status: 401 });
  }
  if (error?.message === 'ACCOUNT_PENDING') {
    return NextResponse.json({ error: 'Your account is pending Super Admin approval.' }, { status: 403 });
  }
  if (error?.message === 'ACCOUNT_INACTIVE') {
    return NextResponse.json({ error: 'Your account has been deactivated.' }, { status: 403 });
  }
  if (error?.message === 'FORBIDDEN_SUPER_ADMIN_REQUIRED') {
    return NextResponse.json({ error: 'Forbidden: Super Admin privilege is required for this action.' }, { status: 403 });
  }
  return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
}
