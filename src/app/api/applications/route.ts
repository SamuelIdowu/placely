// app/api/applications/route.ts
// POST /api/applications — student submits an application
// GET  /api/applications — student fetches their own applications

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { submitApplicationUseCase, getMyApplicationsUseCase, studentProfileRepo } from '@/lib/container';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { listingId, note } = body;
  if (!listingId) {
    return NextResponse.json({ error: 'listingId required' }, { status: 400 });
  }

  // Resolve StudentProfile from User.id stored in session
  const profile = await studentProfileRepo.findByUserId(session.user.id);
  if (!profile) {
    return NextResponse.json({ error: 'Student profile not found — complete setup first' }, { status: 400 });
  }

  const result = await submitApplicationUseCase.execute({
    listingId,
    studentId: profile.id,
    note,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }

  return NextResponse.json({ applicationId: result.applicationId }, { status: 201 });
}

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await studentProfileRepo.findByUserId(session.user.id);
  if (!profile) {
    return NextResponse.json({ applications: [] });
  }

  const result = await getMyApplicationsUseCase.execute({ studentId: profile.id });
  return NextResponse.json(result);
}
