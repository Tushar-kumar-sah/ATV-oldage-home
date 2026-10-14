import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Room from '@/models/Room';
import { requireAuth, requireSuperAdmin, handleApiAuthError } from '@/lib/auth-helpers';
import { RoomSchema } from '@/lib/validators';
import { logActivity } from '@/lib/audit';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    await connectDB();

    const { id } = params;
    const room = await Room.findById(id);

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const body = await req.json();
    const validation = RoomSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Check capacity reduction constraint: cannot reduce below occupied beds
    if (data.capacity < room.occupiedBeds) {
      return NextResponse.json(
        {
          error: `Cannot reduce room capacity to ${data.capacity} because ${room.occupiedBeds} beds are currently occupied.`,
        },
        { status: 400 }
      );
    }

    room.roomNumber = data.roomNumber;
    room.floor = data.floor;
    room.roomType = data.roomType;
    room.capacity = data.capacity;
    room.monthlyRate = data.monthlyRate;
    room.amenities = data.amenities;
    room.status = data.status;
    room.notes = data.notes || '';

    // Adjust beds array length if capacity increased
    while (room.beds.length < data.capacity) {
      room.beds.push({
        bedNumber: `Bed ${room.beds.length + 1}`,
        isOccupied: false,
      });
    }

    await room.save();

    await logActivity({
      userId: session.user.id,
      userName: session.user.name || '',
      userEmail: session.user.email || '',
      userRole: session.user.role,
      action: 'UPDATE_ROOM',
      entityType: 'Room',
      entityId: room._id.toString(),
      details: `Updated Room ${room.roomNumber} (${room.status})`,
    });

    return NextResponse.json({ message: 'Room updated successfully', room });
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
    const room = await Room.findById(id);

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    if (room.occupiedBeds > 0) {
      return NextResponse.json(
        { error: `Cannot delete Room ${room.roomNumber} because it currently has ${room.occupiedBeds} active residents.` },
        { status: 400 }
      );
    }

    await Room.findByIdAndDelete(id);

    await logActivity({
      userId: session.user.id,
      userName: session.user.name || '',
      userEmail: session.user.email || '',
      userRole: session.user.role,
      action: 'DELETE_ROOM',
      entityType: 'Room',
      entityId: id,
      details: `Super Admin deleted Room ${room.roomNumber}`,
    });

    return NextResponse.json({ message: `Room ${room.roomNumber} deleted successfully.` });
  } catch (error: any) {
    return handleApiAuthError(error);
  }
}
