// src/app/api/student/bookmarks/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { toggleSaveListingUseCase, getSavedListingsUseCase, studentProfileRepo } from '@/lib/container';

export async function GET() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await studentProfileRepo.findByUserId(session.user.id);
  if (!profile) {
    return NextResponse.json({ savedIds: [], listings: [] });
  }

  const [savedIds, listings] = await Promise.all([
    getSavedListingsUseCase.getSavedIds(profile.id),
    getSavedListingsUseCase.execute(profile.id),
  ]);

  return NextResponse.json({ savedIds, listings });
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await studentProfileRepo.findByUserId(session.user.id);
  if (!profile) {
    return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
  }

  try {
    const { listingId } = await req.json();
    if (!listingId) {
      return NextResponse.json({ error: 'listingId is required' }, { status: 400 });
    }

    const result = await toggleSaveListingUseCase.execute({
      studentProfileId: profile.id,
      listingId,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error('[POST /api/student/bookmarks] error:', err);
    return NextResponse.json({ error: 'Failed to update bookmark' }, { status: 500 });
  }
}
