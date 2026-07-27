'use server';

import { auth } from '@/lib/auth';
import { updateApplicationStatusUseCase, employerProfileRepo } from '@/lib/container';
import { revalidatePath } from 'next/cache';
import type { ApplicationStatus } from '@/domain/entities/application';

export async function updateApplicantStatusAction(
  applicationId: string,
  listingId: string,
  newStatus: ApplicationStatus
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'EMPLOYER') {
    return { success: false, error: 'Unauthorized: Employer session required' };
  }

  const employerProfile = await employerProfileRepo.findByUserId(session.user.id);
  if (!employerProfile) {
    return { success: false, error: 'Employer profile not found' };
  }

  try {
    const result = await updateApplicationStatusUseCase.execute({
      applicationId,
      employerProfileId: employerProfile.id,
      newStatus,
    });

    revalidatePath(`/employer/listings/${listingId}/applicants`);
    revalidatePath(`/applications/${applicationId}`);
    revalidatePath('/employer/dashboard');

    return { success: true, status: result.application.status };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Status update failed';
    return { success: false, error: message };
  }
}
