import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Resident from '@/models/Resident';
import Room from '@/models/Room';
import { requireAuth, handleApiAuthError } from '@/lib/auth-helpers';
import { encryptSensitiveField, maskGovtId } from '@/lib/crypto';
import { ResidentSchema } from '@/lib/validators';
import { logActivity } from '@/lib/audit';

// Helper to calculate age from DOB
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

// Generate unique admission number RES-YYYY-XXXX
async function generateAdmissionNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `RES-${currentYear}-`;
  const count = await Resident.countDocuments({});
  const sequence = String(count + 1).padStart(4, '0');
  let candidate = `${prefix}${sequence}`;

  // Ensure uniqueness
  let exists = await Resident.findOne({ admissionNumber: candidate });
  let offset = 1;
  while (exists) {
    candidate = `${prefix}${String(count + 1 + offset).padStart(4, '0')}`;
    exists = await Resident.findOne({ admissionNumber: candidate });
    offset++;
  }
  return candidate;
}

/**
 * GET /api/residents
 * Query params: search, status, room, gender, minAge, maxAge, page, limit, export=csv
 */
export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();

    try {
      await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status') || '';
    const roomId = searchParams.get('room') || '';
    const gender = searchParams.get('gender') || '';
    const minAge = searchParams.get('minAge') ? parseInt(searchParams.get('minAge')!, 10) : null;
    const maxAge = searchParams.get('maxAge') ? parseInt(searchParams.get('maxAge')!, 10) : null;
    const isExport = searchParams.get('export') === 'csv';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '10', 10)));

    // Base query: soft deleted excluded
    const query: any = { isDeleted: false };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (roomId && roomId !== 'all') {
      query.roomId = roomId;
    }

    if (gender && gender !== 'all') {
      query.gender = gender;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { admissionNumber: { $regex: search, $options: 'i' } },
        { roomNumber: { $regex: search, $options: 'i' } },
        { 'emergencyContacts.phone': { $regex: search, $options: 'i' } },
        { 'emergencyContacts.name': { $regex: search, $options: 'i' } },
      ];
    }

    // Age filtering based on dateOfBirth
    const now = new Date();
    if (minAge !== null || maxAge !== null) {
      query.dateOfBirth = {};
      if (minAge !== null) {
        // Born on or before (now - minAge years)
        const maxDob = new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());
        query.dateOfBirth.$lte = maxDob;
      }
      if (maxAge !== null) {
        // Born on or after (now - (maxAge + 1) years + 1 day)
        const minDob = new Date(now.getFullYear() - maxAge - 1, now.getMonth(), now.getDate() + 1);
        query.dateOfBirth.$gte = minDob;
      }
    }

    // CSV Export Flow
    if (isExport) {
      const residents = await Resident.find(query)
        .sort({ admissionDate: -1 })
        .populate('roomId', 'roomNumber roomType floor');

      await logActivity({
        userId: session.user.id,
        userName: session.user.name || '',
        userEmail: session.user.email || '',
        userRole: session.user.role,
        action: 'EXPORT_RESIDENTS_CSV',
        entityType: 'Resident',
        details: `Exported ${residents.length} resident records to CSV`,
      });

      // Format CSV
      const headers = [
        'Admission Number',
        'Full Name',
        'Age',
        'Gender',
        'Blood Group',
        'Status',
        'Admission Date',
        'Room Number',
        'Bed Number',
        'Primary Contact Name',
        'Primary Contact Phone',
        'Primary Contact Relation',
        'Monthly Fee (INR)',
        'Mobility Level',
        'Medical Conditions',
        'Allergies',
      ];

      const csvRows = [headers.join(',')];

      for (const res of residents) {
        const age = calculateAge(res.dateOfBirth);
        const primaryContact: any = res.emergencyContacts.find((c: any) => c.isPrimary) || res.emergencyContacts[0] || {};
        const safe = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`;

        const row = [
          safe(res.admissionNumber),
          safe(res.fullName),
          safe(age),
          safe(res.gender),
          safe(res.bloodGroup),
          safe(res.status),
          safe(new Date(res.admissionDate).toLocaleDateString('en-GB')),
          safe(res.roomNumber || 'Not Assigned'),
          safe(res.bedNumber || 'N/A'),
          safe(primaryContact.name || 'N/A'),
          safe(primaryContact.phone || 'N/A'),
          safe(primaryContact.relation || 'N/A'),
          safe(res.monthlyFee),
          safe(res.mobilityLevel),
          safe(res.conditions?.join('; ') || 'None'),
          safe(res.allergies?.join('; ') || 'None'),
        ];
        csvRows.push(row.join(','));
      }

      const csvData = csvRows.join('\n');
      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="residents-export-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    // Paginated JSON Flow
    const total = await Resident.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const residents = await Resident.find(query)
      .select(
        'fullName photoUrl dateOfBirth gender bloodGroup status admissionNumber admissionDate roomNumber bedNumber roomId emergencyContacts mobilityLevel monthlyFee createdAt'
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Attach computed age to records
    const formatted = residents.map((r: any) => ({
      ...r,
      age: calculateAge(r.dateOfBirth),
    }));

      return NextResponse.json({
        residents: formatted,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      });
    } catch (dbErr) {
      const { getFallbackData } = await import('@/lib/localFallback');
      const fallback = getFallbackData();
      return NextResponse.json({
        residents: fallback.residents.map((r: any) => ({
          ...r,
          fullName: r.name,
          admissionNumber: r.admissionNumber || 'RES-2023-0001',
        })),
        pagination: {
          page: 1,
          limit: 10,
          total: fallback.residents.length,
          totalPages: 1,
        },
      });
    }
  } catch (error: any) {
    return handleApiAuthError(error);
  }
}

/**
 * POST /api/residents
 * Create a new resident
 */
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    await connectDB();

    const body = await req.json();
    const validation = ResidentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Encrypt sensitive ID details at rest
    const idNumberEncrypted = encryptSensitiveField(data.idNumber);
    const idNumberMasked = maskGovtId(data.idNumber);

    // Generate unique admission number
    const admissionNumber = await generateAdmissionNumber();

    // Handle room assignment if roomId specified
    let roomNumber = data.roomNumber || '';
    if (data.roomId) {
      const room = await Room.findById(data.roomId);
      if (room) {
        roomNumber = room.roomNumber;
        // Check room capacity
        if (room.occupiedBeds >= room.capacity) {
          return NextResponse.json(
            { error: `Room ${room.roomNumber} is already at full capacity (${room.capacity} beds).` },
            { status: 400 }
          );
        }
      }
    }

    // Create resident document
    const resident = await Resident.create({
      ...data,
      admissionNumber,
      roomNumber,
      idNumberEncrypted,
      idNumberMasked,
      isDeleted: false,
      createdBy: session.user.id,
      createdByName: session.user.name || 'Staff Member',
    });

    // Update room occupancy and bed if assigned
    if (data.roomId) {
      await Room.findByIdAndUpdate(data.roomId, {
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

      // Update room status if full
      const updatedRoom = await Room.findById(data.roomId);
      if (updatedRoom && updatedRoom.occupiedBeds >= updatedRoom.capacity) {
        updatedRoom.status = 'Full';
        await updatedRoom.save();
      }
    }

    // Audit log
    await logActivity({
      userId: session.user.id,
      userName: session.user.name || '',
      userEmail: session.user.email || '',
      userRole: session.user.role,
      action: 'CREATE_RESIDENT',
      entityType: 'Resident',
      entityId: resident._id.toString(),
      details: `Created resident record for ${resident.fullName} (${admissionNumber}) assigned to Room ${roomNumber || 'None'}`,
    });

    return NextResponse.json(
      {
        message: 'Resident admitted successfully',
        resident: {
          ...resident.toObject(),
          age: calculateAge(resident.dateOfBirth),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return handleApiAuthError(error);
  }
}
