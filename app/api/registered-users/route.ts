import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/lib/auth-helpers';
import { connectDB } from '@/lib/db';
import RegisteredUser from '@/models/RegisteredUser';
import { addRegisteredUser, addLoginRecord, getFallbackData } from '@/lib/localFallback';
import { logActivity } from '@/lib/audit';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, password, authProvider = 'email', action = 'register' } = body;

    const trimmedEmail = email ? email.toLowerCase().trim() : '';
    const trimmedPhone = phone ? phone.trim() : '';
    const trimmedPass = password ? password.trim() : '';

    if (!trimmedEmail && !trimmedPhone) {
      return NextResponse.json(
        { error: 'Please provide either an email address or a phone number.' },
        { status: 400 }
      );
    }

    if (action === 'register' && !name) {
      return NextResponse.json(
        { error: 'Full name is required for registration.' },
        { status: 400 }
      );
    }

    if (
      action === 'register' &&
      authProvider !== 'google' &&
      authProvider !== 'early-checker' &&
      authProvider !== 'early-access' &&
      !trimmedPass
    ) {
      return NextResponse.json(
        { error: 'Password is required to secure your account.' },
        { status: 400 }
      );
    }

    const resolvedName =
      (name && name.trim()) ||
      (trimmedEmail ? trimmedEmail.split('@')[0] : `Visitor ${trimmedPhone.slice(-4)}`);

    const userAgent = req.headers.get('user-agent') || 'Browser Web Client';
    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';

    let savedUser: any = null;

    // 1. Try MongoDB
    try {
      await connectDB();
      const existing = await RegisteredUser.findOne({
        $or: [
          ...(trimmedEmail ? [{ email: trimmedEmail }] : []),
          ...(trimmedPhone ? [{ phone: trimmedPhone }] : []),
        ],
      });

      if (existing) {
        existing.lastSeenAt = new Date();
        if (name) existing.name = name;
        if (trimmedPass) existing.password = trimmedPass;
        if (authProvider) existing.authProvider = authProvider as any;
        if (trimmedPhone && !existing.phone) existing.phone = trimmedPhone;
        if (trimmedEmail && !existing.email) existing.email = trimmedEmail;
        await existing.save();
        savedUser = existing.toObject();
      } else {
        const newUser = await RegisteredUser.create({
          name: resolvedName,
          email: trimmedEmail,
          phone: trimmedPhone,
          password: trimmedPass,
          authProvider: (authProvider as any) || 'email',
          userAgent,
        });
        savedUser = newUser.toObject();
      }
    } catch (dbErr) {
      // DB offline, continue to fallback store
    }

    // 2. Always persist into file-backed store for immediate admin visibility
    const localUser = addRegisteredUser({
      name: resolvedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      password: trimmedPass,
      authProvider: authProvider || 'email',
      userAgent,
    });

    if (!savedUser) {
      savedUser = localUser;
    }

    // 3. Record login attempt into login stream for the Executive Dashboard
    addLoginRecord({
      email: trimmedEmail || trimmedPhone,
      name: resolvedName,
      role: 'visitor',
      status: 'SUCCESS',
      method: authProvider === 'google' ? 'google' : 'credentials',
      ipAddress: clientIp,
      userAgent,
    });

    // 4. Log in Audit Trail
    logActivity({
      userName: resolvedName,
      userEmail: trimmedEmail || trimmedPhone,
      userRole: 'visitor',
      action: action === 'login' ? 'VISITOR_LOGIN' : 'VISITOR_REGISTER',
      entityType: 'User',
      details: `Website visitor "${resolvedName}" ${action === 'login' ? 'logged in' : 'registered'} via ${authProvider.toUpperCase()}${trimmedPhone ? ` (Phone: ${trimmedPhone})` : ''}.`,
      ipAddress: clientIp,
      userAgent,
    }).catch(() => {});

    return NextResponse.json(
      {
        success: true,
        user: savedUser,
        message:
          action === 'login'
            ? `Welcome back, ${resolvedName}!`
            : `Welcome to Anand Dham Sanctuary, ${resolvedName}!`,
      },
      { status: action === 'register' ? 201 : 200 }
    );
  } catch (err: any) {
    console.error('Error in registered users POST:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to process visitor authentication.' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session || !['super_admin', 'staff'].includes(session.user?.role as string)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      await connectDB();
      const users = await RegisteredUser.find({}).sort({ createdAt: -1 });
      if (users && users.length > 0) {
        return NextResponse.json({ users });
      }
      // If DB has 0 or is offline, check fallback
      const fallback = getFallbackData();
      return NextResponse.json({ users: fallback.registeredUsers });
    } catch (dbErr) {
      const fallback = getFallbackData();
      return NextResponse.json({ users: fallback.registeredUsers });
    }
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch registered users' }, { status: 500 });
  }
}
