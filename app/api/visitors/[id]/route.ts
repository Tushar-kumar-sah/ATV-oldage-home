import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Visitor from '@/models/Visitor';
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

    const visitor = await Visitor.findById(id);
    if (!visitor) {
      return NextResponse.json({ error: 'Visitor record not found' }, { status: 404 });
    }

    if (body.action === 'checkout') {
      visitor.checkOut = new Date();
    }
    if (body.notes !== undefined) {
      visitor.notes = body.notes;
    }

    await visitor.save();

    await logActivity({
      userId: session.user.id,
      userName: session.user.name || '',
      userEmail: session.user.email || '',
      userRole: session.user.role,
      action: 'LOG_VISITOR_CHECKOUT',
      entityType: 'Visitor',
      entityId: id,
      details: `Recorded check-out for visitor ${visitor.visitorName} (visited ${visitor.residentName})`,
    });

    return NextResponse.json({ message: 'Visitor record updated', visitor });
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
    const visitor = await Visitor.findByIdAndDelete(id);

    if (!visitor) {
      return NextResponse.json({ error: 'Visitor record not found' }, { status: 404 });
    }

    await logActivity({
      userId: session.user.id,
      userName: session.user.name || '',
      userEmail: session.user.email || '',
      userRole: session.user.role,
      action: 'DELETE_VISITOR_RECORD',
      entityType: 'Visitor',
      entityId: id,
      details: `Super Admin deleted visitor log for ${visitor.visitorName}`,
    });

    return NextResponse.json({ message: 'Visitor record deleted' });
  } catch (error: any) {
    return handleApiAuthError(error);
  }
}
