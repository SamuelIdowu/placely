// src/app/api/student/outreach/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { dispatchSiwesOutreachUseCase, studentProfileRepo } from '@/lib/container';

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
    const studentName = session.user.name?.trim() || 'Placely Student';

    const origin = req.headers.get('origin') || process.env.NEXTAUTH_URL || 'https://placely.app';

    const result = await dispatchSiwesOutreachUseCase.execute({
      studentProfileId: studentProfile.id,
      studentName,
      listingId: body.listingId,
      targetCompany: body.targetCompany,
      targetEmail: body.targetEmail,
      targetLocation: body.targetLocation,
      durationMonths: body.durationMonths ? Number(body.durationMonths) : 6,
      matricNumber: body.matricNumber,
      note: body.note,
      appBaseUrl: origin,
    });

    return NextResponse.json({
      success: true,
      applicationId: result.application.id,
      claimUrl: result.claimUrl,
    }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to dispatch SIWES outreach';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
