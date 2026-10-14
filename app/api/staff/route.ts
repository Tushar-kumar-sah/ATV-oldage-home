import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Staff from '@/models/Staff';
import { requireAuth, requireSuperAdmin, handleApiAuthError } from '@/lib/auth-helpers';
import { StaffSchema } from '@/lib/validators';
import { logActivity } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    await requireAuth();
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';
    const role = searchParams.get('role');
    const shift = searchParams.get('shift');
    const status = searchParams.get('status');

    const query: any = {};
    if (role && role !== 'all') query.role = role;
    if (shift && shift !== 'all') query.shift = shift;
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const staffList = await Staff.find(query).sort({ fullName: 1 });
    return NextResponse.json({ staff: staffList });
  } catch (error: any) {
    return handleApiAuthError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    await connectDB();

    const body = await req.json();
    const validation = StaffSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.format() },
        { status: 400 }
      );
    }

    const staff = await Staff.create({
      ...validation.data,
      joiningDate: new Date(validation.data.joiningDate),
    });

    await logActivity({
      userId: session.user.id,
      userName: session.user.name || '',
      userEmail: session.user.email || '',
      userRole: session.user.role,
      action: 'ADD_STAFF',
      entityType: 'Staff',
      entityId: staff._id.toString(),
      details: `Added new staff member ${staff.fullName} as ${staff.role} (${staff.shift})`,
    });

    return NextResponse.json({ message: 'Staff member added successfully', staff }, { status: 201 });
  } catch (error: any) {
    return handleApiAuthError(error);
  }
}
