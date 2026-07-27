'use server';

import { auth } from '@/lib/auth';
import { submitApplicationUseCase, studentProfileRepo } from '@/lib/container';
import { revalidatePath } from 'next/cache';

export async function submitApplicationAction(listingId: string, note?: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'STUDENT') {
    return { success: false, error: 'Unauthorized: Student session required' };
  }

  const studentProfile = await studentProfileRepo.findByUserId(session.user.id);
  if (!studentProfile) {
    return { success: false, error: 'Student profile not found. Please complete profile registration.' };
  }

  try {
    const result = await submitApplicationUseCase.execute({
      studentProfileId: studentProfile.id,
      listingId,
      note,
    });

    if (!result.success) {
      return { success: false, error: result.error };
    }

    revalidatePath(`/listings/${listingId}`);
    revalidatePath('/applications');
    revalidatePath('/dashboard');

    return { success: true, applicationId: result.application?.id };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Application submission failed';
    return { success: false, error: message };
  }
}
