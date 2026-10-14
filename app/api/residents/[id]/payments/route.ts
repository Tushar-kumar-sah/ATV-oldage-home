import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Resident from '@/models/Resident';
import { requireAuth, handleApiAuthError } from '@/lib/auth-helpers';
import { PaymentSchema } from '@/lib/validators';
import { logActivity } from '@/lib/audit';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    await connectDB();

    const { id } = params;
    const resident = await Resident.findOne({ _id: id, isDeleted: false });

    if (!resident) {
      return NextResponse.json({ error: 'Resident not found' }, { status: 404 });
    }

    const body = await req.json();
    const validation = PaymentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid payment data', details: validation.error.format() },
        { status: 400 }
      );
    }

    const paymentRecord = {
      ...validation.data,
      date: validation.data.date ? new Date(validation.data.date) : new Date(),
      recordedBy: session.user.name || 'Staff Member',
    };

    resident.payments.unshift(paymentRecord as any);
    await resident.save();

    await logActivity({
      userId: session.user.id,
      userName: session.user.name || '',
      userEmail: session.user.email || '',
      userRole: session.user.role,
      action: 'ADD_PAYMENT_RECORD',
      entityType: 'Resident',
      entityId: resident._id.toString(),
      details: `Recorded payment of ₹${validation.data.amount} (${validation.data.paymentMethod}) for ${resident.fullName} for month ${validation.data.billingMonth}`,
    });

    return NextResponse.json({
      message: 'Payment logged successfully',
      payments: resident.payments,
    });
  } catch (error: any) {
    return handleApiAuthError(error);
  }
}
