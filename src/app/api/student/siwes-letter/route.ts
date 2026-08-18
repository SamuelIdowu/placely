// src/app/api/student/siwes-letter/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateSiwesLetterUseCase, studentProfileRepo } from '@/lib/container';
import { StudentProfile } from '@/domain/entities/student-profile';
import { createId } from '@paralleldrive/cuid2';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized: Student role required' }, { status: 401 });
  }

  try {
    let studentProfile = await studentProfileRepo.findByUserId(session.user.id);
    
    // Auto-provision profile if not yet created so students can preview/draft letters immediately
    if (!studentProfile) {
      const now = new Date();
      try {
        studentProfile = await studentProfileRepo.save(
          new StudentProfile({
            id: createId(),
            userId: session.user.id,
            university: 'University of Lagos',
            discipline: 'Computer Science & Engineering',
            profileCompleteness: 50,
            verificationStatus: 'PENDING',
            createdAt: now,
            updatedAt: now,
          })
        );
      } catch {
        // Fall back gracefully
      }
    }

    const body = await req.json();
    const studentName = session.user.name?.trim() || 'Placely Student';

    const result = await generateSiwesLetterUseCase.execute({
      studentProfileId: studentProfile?.id,
      studentName,
      university: body.university || studentProfile?.university || 'University of Lagos',
      discipline: body.discipline || studentProfile?.discipline || 'Computer Science & Engineering',
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
