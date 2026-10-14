import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Visitor from '@/models/Visitor';
import Resident from '@/models/Resident';
import { requireAuth, handleApiAuthError } from '@/lib/auth-helpers';
import { VisitorSchema } from '@/lib/validators';
import { logActivity } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    await requireAuth();
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';
    const residentId = searchParams.get('residentId');

    const query: any = {};
    if (residentId && residentId !== 'all') {
      query.residentId = residentId;
    }
    if (search) {
      query.$or = [
        { visitorName: { $regex: search, $options: 'i' } },
        { residentName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { purpose: { $regex: search, $options: 'i' } },
      ];
    }

    const visitors = await Visitor.find(query).sort({ checkIn: -1 }).limit(100);
    return NextResponse.json({ visitors });
  } catch (error: any) {
    return handleApiAuthError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    await connectDB();

    const body = await req.json();
    const validation = VisitorSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Fetch resident to ensure name is populated accurately
    const resident = await Resident.findById(data.residentId);
    if (!resident) {
      return NextResponse.json({ error: 'Resident not found' }, { status: 400 });
    }

    const visitor = await Visitor.create({
      ...data,
      residentName: resident.fullName,
      checkIn: new Date(),
      loggedBy: session.user.name || 'Staff Member',
    });

    await logActivity({
      userId: session.user.id,
      userName: session.user.name || '',
      userEmail: session.user.email || '',
      userRole: session.user.role,
      action: 'LOG_VISITOR_CHECKIN',
      entityType: 'Visitor',
      entityId: visitor._id.toString(),
      details: `Logged visitor ${visitor.visitorName} visiting ${resident.fullName} (${visitor.relation})`,
    });

    return NextResponse.json({ message: 'Visitor check-in logged', visitor }, { status: 201 });
  } catch (error: any) {
    return handleApiAuthError(error);
  }
}
