// src/app/api/applications/my/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getMyApplicationsUseCase, studentProfileRepo } from '@/lib/container';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized: Student role required' }, { status: 401 });
  }

  const studentProfile = await studentProfileRepo.findByUserId(session.user.id);
  if (!studentProfile) {
    return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
  }

  const applications = await getMyApplicationsUseCase.execute(studentProfile.id);
  const formatted = applications.map((item) => ({
    ...item.application.toObject(),
    listing: item.listing,
  }));

  return NextResponse.json({ applications: formatted });
}
