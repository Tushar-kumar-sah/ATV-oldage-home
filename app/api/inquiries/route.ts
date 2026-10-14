import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Inquiry from '@/models/Inquiry';
import { requireAuth, handleApiAuthError } from '@/lib/auth-helpers';
import { InquirySchema } from '@/lib/validators';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { logActivity } from '@/lib/audit';

/**
 * POST /api/inquiries
 * Public submission endpoint with rate limiting (5 inquiries per 10 minutes per IP)
 */
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateCheck = checkRateLimit(`inquiry:${ip}`, 5, 10 * 60 * 1000);

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: 'Too many inquiries submitted from this connection. Please wait a few minutes before trying again.',
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validation = InquirySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.format() },
        { status: 400 }
      );
    }

    try {
      await connectDB();
      const inquiry = await Inquiry.create({
        ...validation.data,
        status: 'New',
      });

      // Dual-write to fallback store for guaranteed zero-loss persistence
      try {
        const { addInquiry } = await import('@/lib/localFallback');
        addInquiry(validation.data as any);
      } catch {}

      await logActivity({
        userName: validation.data.name,
        userEmail: validation.data.email,
        action: 'PUBLIC_INQUIRY_SUBMITTED',
        entityType: 'Inquiry',
        entityId: inquiry._id.toString(),
        details: `New inquiry submitted regarding "${validation.data.subject}" for care: ${validation.data.careNeeded}`,
        ipAddress: ip,
      });

      return NextResponse.json(
        {
          message: 'Thank you for reaching out to Anand Dham. Our care coordinator will contact you shortly.',
          inquiryId: inquiry._id,
        },
        { status: 201 }
      );
    } catch (dbErr) {
      const { addInquiry } = await import('@/lib/localFallback');
      const savedInq = addInquiry(validation.data as any);
      return NextResponse.json(
        {
          message: 'Thank you for reaching out to Anand Dham. Our care coordinator will contact you shortly.',
          inquiryId: savedInq._id,
        },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error('Error submitting inquiry:', error);
    return NextResponse.json({ error: 'Failed to process inquiry. Please try again later.' }, { status: 500 });
  }
}

/**
 * GET /api/inquiries
 * Admin protected endpoint
 */
export async function GET(req: NextRequest) {
  try {
    await requireAuth();

    try {
      await connectDB();
      const { searchParams } = new URL(req.url);
      const status = searchParams.get('status');
      const search = searchParams.get('search')?.trim() || '';

      const query: any = {};
      if (status && status !== 'all') {
        query.status = status;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { message: { $regex: search, $options: 'i' } },
        ];
      }

      const inquiries = await Inquiry.find(query).sort({ createdAt: -1 });
      return NextResponse.json({ inquiries });
    } catch (dbErr) {
      const { getFallbackData } = await import('@/lib/localFallback');
      const fallback = getFallbackData();
      return NextResponse.json({ inquiries: fallback.inquiries });
    }
  } catch (error: any) {
    return handleApiAuthError(error);
  }
}
