import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Inquiry from '@/models/Inquiry';
import { requireAuth, requireSuperAdmin, handleApiAuthError } from '@/lib/auth-helpers';
import { logActivity } from '@/lib/audit';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    await connectDB();

    const { id } = params;
    const body = await req.json();

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    if (body.status) inquiry.status = body.status;
    if (body.notes !== undefined) inquiry.notes = body.notes;
    inquiry.handledBy = session.user.name || 'Staff Member';

    await inquiry.save();

    await logActivity({
      userId: session.user.id,
      userName: session.user.name || '',
      userEmail: session.user.email || '',
      userRole: session.user.role,
      action: 'UPDATE_INQUIRY_STATUS',
      entityType: 'Inquiry',
      entityId: id,
      details: `Updated inquiry from ${inquiry.name} to status "${inquiry.status}"`,
    });

    return NextResponse.json({ message: 'Inquiry updated successfully', inquiry });
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
    const inquiry = await Inquiry.findByIdAndDelete(id);

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    await logActivity({
      userId: session.user.id,
      userName: session.user.name || '',
      userEmail: session.user.email || '',
      userRole: session.user.role,
      action: 'DELETE_INQUIRY',
      entityType: 'Inquiry',
      entityId: id,
      details: `Super Admin deleted inquiry from ${inquiry.name}`,
    });

    return NextResponse.json({ message: 'Inquiry deleted successfully' });
  } catch (error: any) {
    return handleApiAuthError(error);
  }
}
