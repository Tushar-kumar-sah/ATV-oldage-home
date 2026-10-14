import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ActivityLog from '@/models/ActivityLog';
import { requireSuperAdmin, handleApiAuthError } from '@/lib/auth-helpers';
import { getFallbackData } from '@/lib/localFallback';

export async function GET(req: NextRequest) {
  try {
    await requireSuperAdmin();

    const { searchParams } = new URL(req.url);
    const entityType = searchParams.get('entityType');
    const search = searchParams.get('search')?.trim().toLowerCase() || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '25', 10)));

    try {
      await connectDB();

      const query: any = {};
      if (entityType && entityType !== 'all') {
        query.entityType = entityType;
      }
      if (search) {
        query.$or = [
          { userName: { $regex: search, $options: 'i' } },
          { userEmail: { $regex: search, $options: 'i' } },
          { action: { $regex: search, $options: 'i' } },
          { details: { $regex: search, $options: 'i' } },
        ];
      }

      const total = await ActivityLog.countDocuments(query);
      const totalPages = Math.ceil(total / limit);
      const skip = (page - 1) * limit;

      const logs = await ActivityLog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      return NextResponse.json({
        logs,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      });
    } catch (dbErr) {
      // Local fallback
      const fallback = getFallbackData();
      let logs = [...(fallback.activityLogs || [])];

      if (entityType && entityType !== 'all') {
        logs = logs.filter((l) => l.entityType.toLowerCase() === entityType.toLowerCase());
      }

      if (search) {
        logs = logs.filter(
          (l) =>
            l.userName?.toLowerCase().includes(search) ||
            l.userEmail?.toLowerCase().includes(search) ||
            l.action?.toLowerCase().includes(search) ||
            l.details?.toLowerCase().includes(search)
        );
      }

      const total = logs.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const skip = (page - 1) * limit;
      const pagedLogs = logs.slice(skip, skip + limit);

      return NextResponse.json({
        logs: pagedLogs,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      });
    }
  } catch (error: any) {
    return handleApiAuthError(error);
  }
}
