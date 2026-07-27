'use server';

import { auth } from '@/lib/auth';
import { approveVerificationUseCase, rejectVerificationUseCase } from '@/lib/container';
import { revalidatePath } from 'next/cache';

export async function approveVerification(verificationRequestId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized. Admin access required.' };
  }

  const result = await approveVerificationUseCase.execute({
    verificationRequestId,
    reviewerEmail: session.user.email || '',
  });

  if (!result.success) {
    return { success: false, error: result.error ?? 'Failed to approve verification' };
  }

  revalidatePath('/(admin)/admin/verifications', 'page');
  return { success: true };
}

export async function rejectVerification(verificationRequestId: string, adminNote: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized. Admin access required.' };
  }

  const result = await rejectVerificationUseCase.execute({
    verificationRequestId,
    adminNote,
    reviewerEmail: session.user.email || '',
  });

  if (!result.success) {
    return { success: false, error: result.error ?? 'Failed to reject verification' };
  }

  revalidatePath('/(admin)/admin/verifications', 'page');
  return { success: true };
}
