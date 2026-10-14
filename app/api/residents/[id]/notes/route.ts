import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Resident from '@/models/Resident';
import { requireAuth, handleApiAuthError } from '@/lib/auth-helpers';
import { MedicalNoteSchema } from '@/lib/validators';
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
    const validation = MedicalNoteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid medical note data', details: validation.error.format() },
        { status: 400 }
      );
    }

    const newNote = {
      ...validation.data,
      date: validation.data.date ? new Date(validation.data.date) : new Date(),
      recordedBy: session.user.name || 'Staff Member',
      recordedById: session.user.id as any,
    };

    resident.medicalNotes.unshift(newNote as any);
    await resident.save();

    await logActivity({
      userId: session.user.id,
      userName: session.user.name || '',
      userEmail: session.user.email || '',
      userRole: session.user.role,
      action: 'ADD_MEDICAL_NOTE',
      entityType: 'Resident',
      entityId: resident._id.toString(),
      details: `Added medical note "${validation.data.title}" under ${validation.data.category} for ${resident.fullName}`,
    });

    return NextResponse.json({
      message: 'Medical note added successfully',
      medicalNotes: resident.medicalNotes,
    });
  } catch (error: any) {
    return handleApiAuthError(error);
  }
}
