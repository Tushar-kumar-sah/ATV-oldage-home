import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Room from '@/models/Room';
import { requireAuth, requireSuperAdmin, handleApiAuthError } from '@/lib/auth-helpers';
import { RoomSchema } from '@/lib/validators';
import { logActivity } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const floor = searchParams.get('floor');

    try {
      await connectDB();

      const query: any = {};
      if (status && status !== 'all') {
        query.status = status;
      }
      if (floor && floor !== 'all') {
        query.floor = parseInt(floor, 10);
      }

      const rooms = await Room.find(query).sort({ floor: 1, roomNumber: 1 });
      return NextResponse.json({ rooms });
    } catch (dbErr) {
      const { getFallbackData } = await import('@/lib/localFallback');
      const fallback = getFallbackData();
      let rooms = fallback.rooms || [];
      if (status && status !== 'all') {
        rooms = rooms.filter((r: any) => r.status === status);
      }
      if (floor && floor !== 'all') {
        rooms = rooms.filter((r: any) => r.floor === parseInt(floor, 10));
      }
      return NextResponse.json({ rooms });
    }
  } catch (error: any) {
    return handleApiAuthError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    await connectDB();

    const body = await req.json();
    const validation = RoomSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;

    try {
      await connectDB();

      // Check duplicate room number
      const existing = await Room.findOne({ roomNumber: data.roomNumber });
      if (existing) {
        return NextResponse.json(
          { error: `Room ${data.roomNumber} already exists.` },
          { status: 400 }
        );
      }

      // Initialize bed slots according to capacity
      const beds = [];
      for (let i = 1; i <= data.capacity; i++) {
        beds.push({
          bedNumber: `Bed ${i}`,
          isOccupied: false,
        });
      }

      const room = await Room.create({
        ...data,
        occupiedBeds: 0,
        beds,
      });

      await logActivity({
        userId: session.user.id,
        userName: session.user.name || '',
        userEmail: session.user.email || '',
        userRole: session.user.role,
        action: 'CREATE_ROOM',
        entityType: 'Room',
        entityId: room._id.toString(),
        details: `Created Room ${room.roomNumber} (${room.roomType}, Capacity: ${room.capacity}) on Floor ${room.floor}`,
      });

      return NextResponse.json({ message: 'Room created successfully', room }, { status: 201 });
    } catch (dbErr) {
      const { addRoom } = await import('@/lib/localFallback');
      const beds = [];
      for (let i = 1; i <= data.capacity; i++) {
        beds.push({
          bedNumber: `Bed ${i}`,
          isOccupied: false,
        });
      }
      const room = addRoom({
        ...data,
        occupiedBeds: 0,
        beds,
      });
      return NextResponse.json({ message: 'Room created successfully (local store)', room }, { status: 201 });
    }
  } catch (error: any) {
    return handleApiAuthError(error);
  }
}
