import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import RegisteredUser from '@/models/RegisteredUser';
import { addRegisteredUser, getFallbackData } from '@/lib/localFallback';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, password, authProvider } = body;

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { error: 'Name and at least email or phone number are required.' },
        { status: 400 }
      );
    }

    const userAgent = req.headers.get('user-agent') || 'Browser Web Client';

    // Try MongoDB
    try {
      await connectDB();
      const existing = await RegisteredUser.findOne({
        $or: [{ email: email ? email.toLowerCase() : 'none' }, { phone: phone || 'none' }],
      });

      if (existing) {
        existing.lastSeenAt = new Date();
        if (password) existing.password = password;
        await existing.save();
        return NextResponse.json({ success: true, user: existing, message: 'User profile updated' });
      }

      const newUser = await RegisteredUser.create({
        name,
        email: email ? email.toLowerCase() : '',
        phone: phone || '',
        password: password || '',
        authProvider: authProvider || 'credentials',
        userAgent,
      });

      return NextResponse.json({ success: true, user: newUser }, { status: 201 });
    } catch (dbErr) {
      // Fallback to local store
      const localUser = addRegisteredUser({
        name,
        email: email ? email.toLowerCase() : '',
        phone: phone || '',
        password: password || '',
        authProvider: authProvider || 'credentials',
        userAgent,
      });
      return NextResponse.json({ success: true, user: localUser }, { status: 201 });
    }
  } catch (err: any) {
    console.error('Error in registered users POST:', err);
    return NextResponse.json({ error: 'Failed to record user registration' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['super_admin', 'staff'].includes(session.user?.role as string)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      await connectDB();
      const users = await RegisteredUser.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ users });
    } catch (dbErr) {
      const fallback = getFallbackData();
      return NextResponse.json({ users: fallback.registeredUsers });
    }
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch registered users' }, { status: 500 });
  }
}
