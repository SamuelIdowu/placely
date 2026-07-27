// src/app/api/applications/[id]/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  applicationRepo,
  studentProfileRepo,
  employerProfileRepo,
  updateApplicationStatusUseCase,
  respondToOfferUseCase,
  listingRepo,
} from '@/lib/container';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const application = await applicationRepo.findById(id);
  if (!application) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  const listing = await listingRepo.findById(application.listingId);
  const student = await studentProfileRepo.findById(application.studentId);

  // Auth check: Must be student who owns application or employer who owns listing
  if (session.user.role === 'STUDENT') {
    const studentProfile = await studentProfileRepo.findByUserId(session.user.id);
    if (!studentProfile || studentProfile.id !== application.studentId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  } else if (session.user.role === 'EMPLOYER') {
    const employerProfile = await employerProfileRepo.findByUserId(session.user.id);
    if (!employerProfile || listing?.employerProfileId !== employerProfile.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  const employer = listing ? await employerProfileRepo.findById(listing.employerProfileId) : null;

  return NextResponse.json({
    application: application.toObject(),
    listing: listing
      ? {
          id: listing.id,
          title: listing.title,
          description: listing.description,
          location: listing.location,
          isRemote: listing.isRemote,
          companyName: employer?.companyName ?? 'Employer',
          verificationStatus: employer?.verificationStatus ?? 'PENDING',
        }
      : null,
    student: student
      ? {
          university: student.university,
          discipline: student.discipline,
          profileCompleteness: student.profileCompleteness,
          verificationStatus: student.verificationStatus,
        }
      : null,
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  try {
    if (session.user.role === 'EMPLOYER') {
      const employerProfile = await employerProfileRepo.findByUserId(session.user.id);
      if (!employerProfile) {
        return NextResponse.json({ error: 'Employer profile not found' }, { status: 404 });
      }

      const result = await updateApplicationStatusUseCase.execute({
        applicationId: id,
        employerProfileId: employerProfile.id,
        newStatus: body.status,
      });

      return NextResponse.json({ success: true, application: result.application.toObject() });
    } else if (session.user.role === 'STUDENT') {
      const studentProfile = await studentProfileRepo.findByUserId(session.user.id);
      if (!studentProfile) {
        return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
      }

      const result = await respondToOfferUseCase.execute({
        applicationId: id,
        studentProfileId: studentProfile.id,
        decision: body.status,
      });

      return NextResponse.json({ success: true, application: result.application.toObject() });
    }

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Update failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
