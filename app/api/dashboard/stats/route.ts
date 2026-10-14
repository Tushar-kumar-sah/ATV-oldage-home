import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Resident from '@/models/Resident';
import Room from '@/models/Room';
import Inquiry from '@/models/Inquiry';
import User from '@/models/User';
import Staff from '@/models/Staff';
import { requireAuth, handleApiAuthError } from '@/lib/auth-helpers';

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

export async function GET(req: NextRequest) {
  try {
    await requireAuth();

    try {
      await connectDB();

    // 1. Total residents
    const [totalResidents, activeResidents, onLeaveResidents, dischargedResidents] = await Promise.all([
      Resident.countDocuments({ isDeleted: false }),
      Resident.countDocuments({ isDeleted: false, status: 'Active' }),
      Resident.countDocuments({ isDeleted: false, status: 'On Leave' }),
      Resident.countDocuments({ isDeleted: false, status: 'Discharged' }),
    ]);

    // 2. Rooms and beds calculation
    const rooms = await Room.find({});
    const totalRooms = rooms.length;
    let totalBeds = 0;
    let occupiedBeds = 0;

    for (const r of rooms) {
      totalBeds += r.capacity;
      occupiedBeds += r.occupiedBeds;
    }
    const availableBeds = Math.max(0, totalBeds - occupiedBeds);
    const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

    // 3. New inquiries
    const newInquiries = await Inquiry.countDocuments({ status: 'New' });

    // 4. Pending user approvals
    const pendingApprovals = await User.countDocuments({ status: 'pending' });

    // 5. Total staff
    const activeStaff = await Staff.countDocuments({ status: 'Active' });

    // 6. Recent admissions (last 5)
    const recentAdmissionsRaw = await Resident.find({ isDeleted: false })
      .sort({ admissionDate: -1 })
      .limit(5)
      .select('fullName admissionNumber admissionDate roomNumber status gender photoUrl dateOfBirth')
      .lean();

    const recentAdmissions = recentAdmissionsRaw.map((r: any) => ({
      ...r,
      age: calculateAge(r.dateOfBirth),
    }));

    // 7. Upcoming birthdays in the next 30 days
    const allActiveResidents = await Resident.find({ isDeleted: false, status: 'Active' })
      .select('fullName dateOfBirth roomNumber photoUrl')
      .lean();

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    const upcomingBirthdays = allActiveResidents
      .map((r: any) => {
        const dob = new Date(r.dateOfBirth);
        const birthMonth = dob.getMonth();
        const birthDay = dob.getDate();

        // Calculate days until birthday this year or next
        let nextBday = new Date(today.getFullYear(), birthMonth, birthDay);
        if (nextBday < today) {
          nextBday = new Date(today.getFullYear() + 1, birthMonth, birthDay);
        }

        const diffTime = nextBday.getTime() - today.getTime();
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
          _id: r._id,
          fullName: r.fullName,
          dateOfBirth: r.dateOfBirth,
          roomNumber: r.roomNumber,
          photoUrl: r.photoUrl,
          turningAge: calculateAge(r.dateOfBirth) + 1,
          daysRemaining,
        };
      })
      .filter((b) => b.daysRemaining >= 0 && b.daysRemaining <= 30)
      .sort((a, b) => a.daysRemaining - b.daysRemaining);

    // 8. Gender breakdown
    const maleCount = await Resident.countDocuments({ isDeleted: false, gender: 'Male', status: 'Active' });
    const femaleCount = await Resident.countDocuments({ isDeleted: false, gender: 'Female', status: 'Active' });
    const otherCount = activeResidents - (maleCount + femaleCount);

    return NextResponse.json({
      stats: {
        totalResidents,
        activeResidents,
        onLeaveResidents,
        dischargedResidents,
        totalRooms,
        totalBeds,
        occupiedBeds,
        availableBeds,
        occupancyRate,
        newInquiries,
        pendingApprovals,
        activeStaff,
        genderBreakdown: {
          male: maleCount,
          female: femaleCount,
          other: otherCount,
        },
      },
      recentAdmissions,
      upcomingBirthdays,
    });
    } catch (dbErr) {
      const { getFallbackData } = await import('@/lib/localFallback');
      const fallback = getFallbackData();
      return NextResponse.json({
        stats: {
          totalResidents: fallback.residents.length,
          activeResidents: fallback.residents.length,
          onLeaveResidents: 0,
          dischargedResidents: 0,
          totalRooms: fallback.rooms.length,
          totalBeds: 5,
          occupiedBeds: 2,
          availableBeds: 3,
          occupancyRate: 40,
          newInquiries: fallback.inquiries.length,
          pendingApprovals: 0,
          activeStaff: fallback.staff.length,
          genderBreakdown: { male: 1, female: 1, other: 0 },
        },
        recentAdmissions: fallback.residents.map((r: any) => ({
          _id: r._id,
          fullName: r.name,
          admissionNumber: 'ADM-2023-001',
          admissionDate: r.admissionDate,
          roomNumber: r.roomNumber,
          status: 'Active',
          gender: r.gender,
          age: r.age,
        })),
        upcomingBirthdays: [],
      });
    }
  } catch (error: any) {
    return handleApiAuthError(error);
  }
}
