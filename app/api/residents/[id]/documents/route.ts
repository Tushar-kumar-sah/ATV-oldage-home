import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Resident from '@/models/Resident';
import { requireAuth, handleApiAuthError } from '@/lib/auth-helpers';
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
    const { title, documentType, fileUrl } = body;

    if (!title || !documentType || !fileUrl) {
      return NextResponse.json(
        { error: 'Document title, documentType, and fileUrl are required.' },
        { status: 400 }
      );
    }

    const docRecord = {
      title,
      documentType,
      fileUrl,
      uploadedAt: new Date(),
      uploadedBy: session.user.name || 'Staff Member',
    };

    resident.documents.unshift(docRecord as any);
    await resident.save();

    await logActivity({
      userId: session.user.id,
      userName: session.user.name || '',
      userEmail: session.user.email || '',
      userRole: session.user.role,
      action: 'UPLOAD_DOCUMENT',
      entityType: 'Resident',
      entityId: resident._id.toString(),
      details: `Added document "${title}" (${documentType}) for ${resident.fullName}`,
    });

    return NextResponse.json({
      message: 'Document attached successfully',
      documents: resident.documents,
    });
  } catch (error: any) {
    return handleApiAuthError(error);
  }
}
