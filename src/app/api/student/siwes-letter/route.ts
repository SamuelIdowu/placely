// src/app/api/student/siwes-letter/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateSiwesLetterUseCase, studentProfileRepo } from '@/lib/container';

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

    const result = await generateSiwesLetterUseCase.execute({
      studentProfileId: studentProfile.id,
      studentName,
      targetCompany: body.targetCompany,
      targetLocation: body.targetLocation,
      contactPerson: body.contactPerson,
      durationMonths: body.durationMonths ? Number(body.durationMonths) : 6,
      matricNumber: body.matricNumber,
      skills: body.skills,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate SIWES letter';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
