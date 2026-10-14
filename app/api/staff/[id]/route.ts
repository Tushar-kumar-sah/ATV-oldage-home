import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Staff from '@/models/Staff';
import { requireAuth, requireSuperAdmin, handleApiAuthError } from '@/lib/auth-helpers';
import { StaffSchema } from '@/lib/validators';
import { logActivity } from '@/lib/audit';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    await connectDB();

    const { id } = params;
    const body = await req.json();
    const validation = StaffSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.format() },
        { status: 400 }
      );
    }

    const updated = await Staff.findByIdAndUpdate(
      id,
      {
        ...validation.data,
        joiningDate: new Date(validation.data.joiningDate),
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    await logActivity({
      userId: session.user.id,
      userName: session.user.name || '',
      userEmail: session.user.email || '',
      userRole: session.user.role,
      action: 'UPDATE_STAFF',
      entityType: 'Staff',
      entityId: id,
      details: `Updated staff profile for ${updated.fullName}`,
    });

    return NextResponse.json({ message: 'Staff member updated successfully', staff: updated });
  } catch (error: any) {
    return handleApiAuthError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireSuperAdmin();
    await connectDB();

    const { id } = params;
    const staff = await Staff.findByIdAndDelete(id);

    if (!staff) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    await logActivity({
      userId: session.user.id,
      userName: session.user.name || '',
      userEmail: session.user.email || '',
      userRole: session.user.role,
      action: 'DELETE_STAFF',
      entityType: 'Staff',
      entityId: id,
      details: `Super Admin deleted staff member ${staff.fullName} (${staff.role})`,
    });

    return NextResponse.json({ message: `Staff member ${staff.fullName} removed successfully.` });
  } catch (error: any) {
    return handleApiAuthError(error);
  }
}
