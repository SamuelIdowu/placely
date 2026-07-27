// src/app/api/employer/listings/[id]/route.ts
// PATCH  /api/employer/listings/[id] — edit listing
// DELETE /api/employer/listings/[id] — toggle status (soft close)

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { employerProfileRepo, updateListingUseCase, toggleListingStatusUseCase } from '@/lib/container';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== 'EMPLOYER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const employer = await employerProfileRepo.findByUserId(session.user.id);
  if (!employer) {
    return NextResponse.json({ error: 'Employer profile not found' }, { status: 404 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await updateListingUseCase.execute({
      listingId: id,
      employerProfileId: employer.id,
      title: body.title,
      description: body.description,
      disciplines: body.disciplines,
      location: body.location,
      isRemote: body.isRemote,
    });

    return NextResponse.json({ listing: updated.toObject() });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update listing';
    return NextResponse.json({ error: message }, { status: 422 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== 'EMPLOYER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const employer = await employerProfileRepo.findByUserId(session.user.id);
  if (!employer) {
    return NextResponse.json({ error: 'Employer profile not found' }, { status: 404 });
  }

  try {
    const { id } = await params;
    const toggled = await toggleListingStatusUseCase.execute({
      listingId: id,
      employerProfileId: employer.id,
    });

    return NextResponse.json({ listing: toggled.toObject() });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to toggle listing status';
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
