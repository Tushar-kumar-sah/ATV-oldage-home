import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { requireSuperAdmin, handleApiAuthError } from '@/lib/auth-helpers';
import { getFallbackData } from '@/lib/localFallback';

export async function GET(req: NextRequest) {
  try {
    await requireSuperAdmin();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const role = searchParams.get('role');
    const search = searchParams.get('search')?.trim().toLowerCase() || '';

    try {
      await connectDB();

      const query: any = {};
      if (status && status !== 'all') query.status = status;
      if (role && role !== 'all') query.role = role;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      const users = await User.find(query).sort({ createdAt: -1 });
      return NextResponse.json({ users });
    } catch (dbErr) {
      const fallback = getFallbackData();
      const superAdminEmail = (process.env.SUPER_ADMIN_EMAIL || 'admin@ananddham.org').toLowerCase();
      
      const defaultUsers = [
        {
          _id: '650000000000000000000001',
          name: process.env.SUPER_ADMIN_NAME || 'Super Administrator',
          email: superAdminEmail,
          role: 'super_admin',
          status: 'active',
          provider: 'credentials',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        },
        ...fallback.staff.map((s: any) => ({
          _id: s._id,
          name: s.name,
          email: s.email || `${s.name.toLowerCase().replace(/\s+/g, '.')}@ananddham.org`,
          role: 'staff',
          status: 'active',
          provider: 'credentials',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        })),
      ];

      let filtered = defaultUsers;
      if (status && status !== 'all') filtered = filtered.filter((u) => u.status === status);
      if (role && role !== 'all') filtered = filtered.filter((u) => u.role === role);
      if (search) {
        filtered = filtered.filter(
          (u) => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search)
        );
      }

      return NextResponse.json({ users: filtered });
    }
  } catch (error: any) {
    return handleApiAuthError(error);
  }
}
