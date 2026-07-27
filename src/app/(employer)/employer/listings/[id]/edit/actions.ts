'use server';

import { auth } from '@/lib/auth';
import { employerProfileRepo, updateListingUseCase } from '@/lib/container';
import { revalidatePath } from 'next/cache';

export async function updateListingAction(listingId: string, formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== 'EMPLOYER') {
    return { success: false, error: 'Unauthorized: Employer account required' };
  }

  const employer = await employerProfileRepo.findByUserId(session.user.id);
  if (!employer) {
    return { success: false, error: 'Employer profile not found' };
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const location = formData.get('location') as string;
  const isRemote = formData.get('isRemote') === 'true' || formData.get('isRemote') === 'on';
  const disciplines = formData.getAll('disciplines') as string[];

  try {
    const updated = await updateListingUseCase.execute({
      listingId,
      employerProfileId: employer.id,
      title,
      description,
      disciplines,
      location,
      isRemote,
    });

    revalidatePath('/employer/listings');
    revalidatePath(`/student/listings/${listingId}`);
    revalidatePath('/listings');
    return { success: true, listingId: updated.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update listing';
    return { success: false, error: message };
  }
}
