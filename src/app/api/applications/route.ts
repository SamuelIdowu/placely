// src/app/api/applications/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { submitApplicationUseCase, studentProfileRepo } from '@/lib/container';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized: Student role required' }, { status: 401 });
  }

  try {
    const studentProfile = await studentProfileRepo.findByUserId(session.user.id);
    if (!studentProfile) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    const body = await req.json();
    const result = await submitApplicationUseCase.execute({
      studentProfileId: studentProfile.id,
      listingId: body.listingId,
      note: body.note,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, application: result.application?.toObject() }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to submit application';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
