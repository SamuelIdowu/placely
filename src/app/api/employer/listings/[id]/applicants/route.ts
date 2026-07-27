// src/app/api/employer/listings/[id]/applicants/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getApplicantsUseCase, employerProfileRepo } from '@/lib/container';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'EMPLOYER') {
    return NextResponse.json({ error: 'Unauthorized: Employer role required' }, { status: 401 });
  }

  const employerProfile = await employerProfileRepo.findByUserId(session.user.id);
  if (!employerProfile) {
    return NextResponse.json({ error: 'Employer profile not found' }, { status: 404 });
  }

  try {
    const result = await getApplicantsUseCase.execute({
      listingId: id,
      employerProfileId: employerProfile.id,
    });

    const formattedApplicants = result.applicants.map((a) => ({
      ...a.application.toObject(),
      student: a.student,
    }));

    return NextResponse.json({
      listingTitle: result.listingTitle,
      applicants: formattedApplicants,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch applicants';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
