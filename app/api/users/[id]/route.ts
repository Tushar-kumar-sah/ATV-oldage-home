import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { requireSuperAdmin, handleApiAuthError } from '@/lib/auth-helpers';
import { UserUpdateSchema } from '@/lib/validators';
import { logActivity } from '@/lib/audit';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireSuperAdmin();
    await connectDB();

    const { id } = params;
    const targetUser = await User.findById(id);

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const validation = UserUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid user update data', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { role, status } = validation.data;

    // Safety constraint: Prevent Super Admin from deactivating or demoting themselves
    if (session.user.id === id) {
      if (status !== 'active') {
        return NextResponse.json(
          { error: 'You cannot deactivate your own Super Admin account.' },
          { status: 400 }
        );
      }
      if (role !== 'super_admin') {
        return NextResponse.json(
          { error: 'You cannot remove your own Super Admin privileges.' },
          { status: 400 }
        );
      }
    }

    const wasPending = targetUser.status === 'pending';
    targetUser.role = role;
    targetUser.status = status;

    if (wasPending && status === 'active') {
      targetUser.approvedBy = session.user.id as any;
      targetUser.approvedAt = new Date();
    }

    await targetUser.save();

    await logActivity({
      userId: session.user.id,
      userName: session.user.name || '',
      userEmail: session.user.email || '',
      userRole: session.user.role,
      action: wasPending && status === 'active' ? 'APPROVE_USER_SIGNUP' : 'UPDATE_USER_PERMISSIONS',
      entityType: 'User',
      entityId: id,
      details: `Updated user ${targetUser.name} (${targetUser.email}) to role "${role}" with status "${status}"`,
    });

    return NextResponse.json({ message: 'User updated successfully', user: targetUser });
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

    if (session.user.id === id) {
      return NextResponse.json(
        { error: 'You cannot delete your own account.' },
        { status: 400 }
      );
    }

    const targetUser = await User.findByIdAndDelete(id);

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await logActivity({
      userId: session.user.id,
      userName: session.user.name || '',
      userEmail: session.user.email || '',
      userRole: session.user.role,
      action: 'DELETE_USER_ACCOUNT',
      entityType: 'User',
      entityId: id,
      details: `Super Admin deleted user account for ${targetUser.name} (${targetUser.email})`,
    });

    return NextResponse.json({ message: `User ${targetUser.name} deleted successfully.` });
  } catch (error: any) {
    return handleApiAuthError(error);
  }
}
