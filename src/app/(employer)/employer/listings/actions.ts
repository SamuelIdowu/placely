'use server';

import { auth } from '@/lib/auth';
import { employerProfileRepo, toggleListingStatusUseCase } from '@/lib/container';
import { revalidatePath } from 'next/cache';

export async function toggleListingStatusAction(listingId: string) {
  const session = await auth();
  if (!session || session.user.role !== 'EMPLOYER') {
    return { success: false, error: 'Unauthorized' };
  }

  const employer = await employerProfileRepo.findByUserId(session.user.id);
  if (!employer) {
    return { success: false, error: 'Employer profile not found' };
  }

  try {
    const updated = await toggleListingStatusUseCase.execute({
      listingId,
      employerProfileId: employer.id,
    });

    revalidatePath('/employer/listings');
    revalidatePath('/listings');
    return { success: true, status: updated.status };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to toggle status';
    return { success: false, error: message };
  }
}
