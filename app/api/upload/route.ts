import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiAuthError } from '@/lib/auth-helpers';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

export async function POST(req: NextRequest) {
  try {
    await requireAuth();

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Restrict size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds maximum allowed limit of 5MB.' },
        { status: 400 }
      );
    }

    // Restrict type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP images and PDF documents are allowed.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // If Cloudinary URL or keys are set in environment, upload to Cloudinary
    const cloudinaryUrl = process.env.CLOUDINARY_URL;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudinaryUrl || (cloudName && apiKey && apiSecret)) {
      try {
        const cName = cloudName || (cloudinaryUrl ? cloudinaryUrl.split('@')[1] : '');
        const uploadUrl = `https://api.cloudinary.com/v1_1/${cName}/auto/upload`;

        const cloudinaryFormData = new FormData();
        const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;
        cloudinaryFormData.append('file', base64Data);
        cloudinaryFormData.append('upload_preset', 'ml_default'); // or unauthenticated preset

        const uploadRes = await fetch(uploadUrl, {
          method: 'POST',
          body: cloudinaryFormData,
        });

        if (uploadRes.ok) {
          const result = await uploadRes.json();
          return NextResponse.json({
            url: result.secure_url || result.url,
            filename: file.name,
            fileType: file.type,
            size: file.size,
          });
        }
      } catch (cloudErr) {
        console.warn('Cloudinary upload fallback, serving stored asset data URI:', cloudErr);
      }
    }

    // Safe Data URI representation fallback for immediate local testing & serverless compatibility
    const base64String = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64String}`;

    return NextResponse.json({
      url: dataUri,
      filename: file.name,
      fileType: file.type,
      size: file.size,
    });
  } catch (error: any) {
    return handleApiAuthError(error);
  }
}
