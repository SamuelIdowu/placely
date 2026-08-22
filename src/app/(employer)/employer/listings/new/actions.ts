'use server';

import { auth } from '@/lib/auth';
import { employerProfileRepo, createListingUseCase } from '@/lib/container';
import { revalidatePath } from 'next/cache';

export async function createListingAction(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== 'EMPLOYER') {
    return { success: false, error: 'Unauthorized: Employer account required' };
  }

  const employer = await employerProfileRepo.findByUserId(session.user.id);
  if (!employer) {
    return { success: false, error: 'Employer profile not found' };
  }

  if (employer.verificationStatus !== 'VERIFIED') {
    return {
      success: false,
      error: 'You must be verified before posting a listing. Please submit your CAC document for verification.',
    };
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const location = formData.get('location') as string;
  const isRemote = formData.get('isRemote') === 'true' || formData.get('isRemote') === 'on';
  const disciplines = formData.getAll('disciplines') as string[];
  const stipendAmount = formData.get('stipendAmount') ? Number(formData.get('stipendAmount')) : null;
  const isStipendNegotiable = formData.get('isStipendNegotiable') === 'true';
  const durationWeeks = formData.get('durationWeeks') ? Number(formData.get('durationWeeks')) : null;
  const requirements = formData.get('requirements') as string || null;
  const applicationDeadline = formData.get('applicationDeadline') ? new Date(formData.get('applicationDeadline') as string) : null;
  const maxApplicants = formData.get('maxApplicants') ? Number(formData.get('maxApplicants')) : null;

  try {
    const listing = await createListingUseCase.execute({
      employerProfileId: employer.id,
      title,
      description,
      disciplines,
      location,
      isRemote,
      stipendAmount,
      isStipendNegotiable,
      durationWeeks,
      requirements,
      applicationDeadline,
      maxApplicants,
    });

    revalidatePath('/employer/listings');
    revalidatePath('/listings');
    return { success: true, listingId: listing.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create listing';
    return { success: false, error: message };
  }
}
