// app/api/listings/route.ts
// GET  /api/listings?discipline=&location=&isRemote= — browse open listings
// POST /api/listings — employer posts a new listing

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { listingRepo, postListingUseCase, employerProfileRepo } from '@/lib/container';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const discipline = searchParams.get('discipline') ?? undefined;
  const location = searchParams.get('location') ?? undefined;
  const isRemoteParam = searchParams.get('isRemote');
  const isRemote = isRemoteParam === null ? undefined : isRemoteParam === 'true';

  const listings = await listingRepo.findOpen({ discipline, location, isRemote });
  return NextResponse.json({ listings: listings.map((l) => l.toObject()) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== 'EMPLOYER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await employerProfileRepo.findByUserId(session.user.id);
  if (!profile) {
    return NextResponse.json({ error: 'Employer profile not found' }, { status: 400 });
  }

  const body = await req.json();
  const result = await postListingUseCase.execute({
    employerProfileId: profile.id,
    title: body.title,
    description: body.description,
    disciplines: body.disciplines,
    location: body.location,
    isRemote: body.isRemote,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }

  return NextResponse.json({ listingId: result.listingId }, { status: 201 });
}
