// src/app/api/student/upload/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { uploadResumeUseCase } from '@/lib/container';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const typeParam = formData.get('type') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided in form data' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'File size exceeds maximum allowed limit (5MB)' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, JPG, PNG, and WEBP documents are allowed.' },
        { status: 400 }
      );
    }

    const fileNameLower = file.name.toLowerCase();
    if (
      fileNameLower.endsWith('.exe') ||
      fileNameLower.endsWith('.sh') ||
      fileNameLower.endsWith('.bat') ||
      fileNameLower.endsWith('.js')
    ) {
      return NextResponse.json({ error: 'Executable file types are forbidden.' }, { status: 400 });
    }

    const type = typeParam === 'SCHOOL_ID' ? 'SCHOOL_ID' : 'RESUME';

    const result = await uploadResumeUseCase.execute({
      userId: session.user.id,
      file,
      type,
    });

    if (!result.success || !result.fileUrl) {
      return NextResponse.json({ error: result.error ?? 'Upload failed' }, { status: 400 });
    }

    return NextResponse.json({ success: true, url: result.fileUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
