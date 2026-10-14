import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Resident from '@/models/Resident';
import Room from '@/models/Room';
import { requireAuth, requireSuperAdmin, handleApiAuthError } from '@/lib/auth-helpers';
import { encryptSensitiveField, decryptSensitiveField, maskGovtId } from '@/lib/crypto';
import { ResidentSchema } from '@/lib/validators';
import { logActivity } from '@/lib/audit';

function calculateAge(dob: Date): number {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/**
 * GET /api/residents/[id]
 * Optional: ?revealId=true (audited access)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    await connectDB();

    const { id } = params;
    const resident = await Resident.findOne({ _id: id, isDeleted: false })
      .populate('roomId', 'roomNumber roomType floor monthlyRate amenities status')
      .populate('createdBy', 'name email role')
      .populate('updatedBy', 'name email role');

    if (!resident) {
      return NextResponse.json({ error: 'Resident not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const revealId = searchParams.get('revealId') === 'true';

    let plainIdNumber: string | null = null;
    if (revealId) {
      plainIdNumber = decryptSensitiveField(resident.idNumberEncrypted);
      await logActivity({
        userId: session.user.id,
        userName: session.user.name || '',
        userEmail: session.user.email || '',
        userRole: session.user.role,
        action: 'DECRYPT_SENSITIVE_GOVT_ID',
        entityType: 'Resident',
        entityId: resident._id.toString(),
        details: `Decrypted and viewed government ID for resident ${resident.fullName} (${resident.admissionNumber})`,
      });
    }

    const residentObj = resident.toObject();
    // Exclude the raw ciphertext from client response for security
    delete residentObj.idNumberEncrypted;

    return NextResponse.json({
      ...residentObj,
      age: calculateAge(resident.dateOfBirth),
      revealedIdNumber: plainIdNumber,
    });
  } catch (error: any) {
    return handleApiAuthError(error);
  }
}

/**
 * PUT /api/residents/[id]
 * Updates resident details
 */
export async function PUT(
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
    const validation = ResidentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;
    const oldRoomId = resident.roomId ? resident.roomId.toString() : null;
    const newRoomId = data.roomId || null;

    // Handle Room change logic
    let updatedRoomNumber = resident.roomNumber;
    if (newRoomId !== oldRoomId) {
      // 1. If had an old room, remove occupancy
      if (oldRoomId) {
        await Room.findByIdAndUpdate(oldRoomId, {
          $inc: { occupiedBeds: -1 },
          $pull: { beds: { residentId: resident._id } },
          status: 'Available',
        });
      }

      // 2. If assigning a new room, check and update
      if (newRoomId) {
        const targetRoom = await Room.findById(newRoomId);
        if (!targetRoom) {
          return NextResponse.json({ error: 'Selected room not found' }, { status: 400 });
        }
        if (targetRoom.occupiedBeds >= targetRoom.capacity) {
          return NextResponse.json(
            { error: `Room ${targetRoom.roomNumber} is at capacity.` },
            { status: 400 }
          );
        }

        updatedRoomNumber = targetRoom.roomNumber;
        await Room.findByIdAndUpdate(newRoomId, {
          $inc: { occupiedBeds: 1 },
          $push: {
            beds: {
              bedNumber: data.bedNumber || `Bed-${resident.fullName.slice(0, 3)}`,
              isOccupied: true,
              residentId: resident._id,
              residentName: resident.fullName,
            },
          },
        });

        const refreshed = await Room.findById(newRoomId);
        if (refreshed && refreshed.occupiedBeds >= refreshed.capacity) {
          refreshed.status = 'Full';
          await refreshed.save();
        }
      } else {
        updatedRoomNumber = '';
      }
    }

    // Check if ID was changed
    let idNumberEncrypted = resident.idNumberEncrypted;
    let idNumberMasked = resident.idNumberMasked;
    if (data.idNumber && data.idNumber !== resident.idNumberMasked && !data.idNumber.startsWith('XXXX-')) {
      idNumberEncrypted = encryptSensitiveField(data.idNumber);
      idNumberMasked = maskGovtId(data.idNumber);
    }

    // Apply updates
    resident.fullName = data.fullName;
    resident.photoUrl = data.photoUrl || resident.photoUrl;
    resident.dateOfBirth = new Date(data.dateOfBirth);
    resident.gender = data.gender;
    resident.bloodGroup = data.bloodGroup;
    resident.maritalStatus = data.maritalStatus;
    resident.languages = data.languages;
    resident.idType = data.idType;
    resident.idNumberEncrypted = idNumberEncrypted;
    resident.idNumberMasked = idNumberMasked;
    resident.idDocumentUrl = data.idDocumentUrl || resident.idDocumentUrl;
    resident.admissionDate = new Date(data.admissionDate);
    resident.roomId = newRoomId as any;
    resident.roomNumber = updatedRoomNumber;
    resident.bedNumber = data.bedNumber || resident.bedNumber;
    resident.status = data.status;
    resident.dischargeDate = data.dischargeDate ? new Date(data.dischargeDate) : undefined;
    resident.dischargeReason = data.dischargeReason || '';
    resident.emergencyContacts = data.emergencyContacts as any;
    resident.conditions = data.conditions;
    resident.allergies = data.allergies;
    resident.medications = data.medications as any;
    resident.primaryDoctor = data.primaryDoctor as any;
    resident.insurance = data.insurance as any;
    resident.dietaryNeeds = data.dietaryNeeds;
    resident.mobilityLevel = data.mobilityLevel;
    resident.monthlyFee = data.monthlyFee;
    resident.securityDeposit = data.securityDeposit;
    resident.updatedBy = session.user.id as any;
    resident.updatedByName = session.user.name || 'Staff Member';

    // If status changed to Discharged or Deceased, free up the bed
    if (['Discharged', 'Deceased'].includes(data.status) && resident.roomId) {
      await Room.findByIdAndUpdate(resident.roomId, {
        $inc: { occupiedBeds: -1 },
        $pull: { beds: { residentId: resident._id } },
        status: 'Available',
      });
      resident.roomId = undefined;
      resident.roomNumber = '';
      resident.bedNumber = '';
    }

    await resident.save();

    await logActivity({
      userId: session.user.id,
      userName: session.user.name || '',
      userEmail: session.user.email || '',
      userRole: session.user.role,
      action: 'UPDATE_RESIDENT',
      entityType: 'Resident',
      entityId: resident._id.toString(),
      details: `Updated resident details for ${resident.fullName} (${resident.admissionNumber})`,
    });

    return NextResponse.json({
      message: 'Resident updated successfully',
      resident: {
        ...resident.toObject(),
        age: calculateAge(resident.dateOfBirth),
      },
    });
  } catch (error: any) {
    return handleApiAuthError(error);
  }
}

/**
 * DELETE /api/residents/[id]
 * Super Admin ONLY: Soft deletes resident and frees room
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireSuperAdmin();
    await connectDB();

    const { id } = params;
    const resident = await Resident.findOne({ _id: id, isDeleted: false });

    if (!resident) {
      return NextResponse.json({ error: 'Resident not found' }, { status: 404 });
    }

    // Release room if currently assigned
    if (resident.roomId) {
      await Room.findByIdAndUpdate(resident.roomId, {
        $inc: { occupiedBeds: -1 },
        $pull: { beds: { residentId: resident._id } },
        status: 'Available',
      });
    }

    // Soft delete
    resident.isDeleted = true;
    resident.deletedAt = new Date();
    resident.deletedBy = session.user.id as any;
    await resident.save();

    await logActivity({
      userId: session.user.id,
      userName: session.user.name || '',
      userEmail: session.user.email || '',
      userRole: session.user.role,
      action: 'SOFT_DELETE_RESIDENT',
      entityType: 'Resident',
      entityId: resident._id.toString(),
      details: `Super Admin soft-deleted resident ${resident.fullName} (${resident.admissionNumber})`,
    });

    return NextResponse.json({
      message: `Resident ${resident.fullName} archived successfully.`,
    });
  } catch (error: any) {
    return handleApiAuthError(error);
  }
}
