// app/api/admin/listings/[id]/moderate/route.ts
// PATCH /api/admin/listings/[id]/moderate — admin approves or closes a listing

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { moderateListingUseCase } from '@/lib/container';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { approve } = body;

  const result = await moderateListingUseCase.execute({
    listingId: id,
    approve: Boolean(approve),
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }

  return NextResponse.json({ success: true });
}
