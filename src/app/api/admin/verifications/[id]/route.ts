// app/api/admin/verifications/[id]/route.ts
// PATCH /api/admin/verifications/[id] — admin approves or rejects a verification request

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { approveVerificationUseCase } from '@/lib/container';

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
  const { approve, adminNote } = body;

  const result = await approveVerificationUseCase.execute({
    verificationRequestId: id,
    approve: Boolean(approve),
    adminNote,
    reviewerEmail: session.user.email!,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }

  return NextResponse.json({ success: true });
}
