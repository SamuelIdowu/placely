// src/app/api/employer/listings/route.ts
// GET  /api/employer/listings — list current employer's listings
// POST /api/employer/listings — create new listing (verified employer only)

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { employerProfileRepo, listingRepo, createListingUseCase } from '@/lib/container';

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== 'EMPLOYER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const employer = await employerProfileRepo.findByUserId(session.user.id);
  if (!employer) {
    return NextResponse.json({ error: 'Employer profile not found' }, { status: 404 });
  }

  const items = await listingRepo.findByEmployer(employer.id);
  return NextResponse.json({
    listings: items.map((item) => ({
      ...item.listing.toObject(),
      applicantCount: item.applicantCount,
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== 'EMPLOYER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const employer = await employerProfileRepo.findByUserId(session.user.id);
  if (!employer) {
    return NextResponse.json({ error: 'Employer profile not found' }, { status: 404 });
  }

  try {
    const body = await req.json();
    const listing = await createListingUseCase.execute({
      employerProfileId: employer.id,
      title: body.title,
      description: body.description,
      disciplines: body.disciplines,
      location: body.location,
      isRemote: body.isRemote,
    });

    return NextResponse.json({ listing: listing.toObject() }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create listing';
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
