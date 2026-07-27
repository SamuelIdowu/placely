// src/app/api/employer/profile/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { employerProfileRepo, updateEmployerProfileUseCase } from '@/lib/container';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await employerProfileRepo.findByUserId(session.user.id);
  if (!profile) {
    return NextResponse.json({ error: 'Employer profile not found' }, { status: 404 });
  }

  return NextResponse.json({ profile: profile.toObject() });
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = await updateEmployerProfileUseCase.execute({
      userId: session.user.id,
      ...body,
    });

    if (!result.success || !result.profile) {
      return NextResponse.json({ error: result.error ?? 'Failed to update profile' }, { status: 400 });
    }

    return NextResponse.json({ profile: result.profile.toObject() });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid request payload';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
