'use server';

import { auth } from '@/lib/auth';
import { updateApplicationStatusUseCase, sendMessageUseCase, employerProfileRepo } from '@/lib/container';
import { revalidatePath } from 'next/cache';
import type { ApplicationStatus } from '@/domain/entities/application';

export async function updateApplicantStatusFromDetailAction(
  applicationId: string,
  listingId: string,
  newStatus: ApplicationStatus
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'EMPLOYER') {
    return { success: false, error: 'Unauthorized: Employer role required' };
  }

  const employerProfile = await employerProfileRepo.findByUserId(session.user.id);
  if (!employerProfile) {
    return { success: false, error: 'Employer profile not found' };
  }

  try {
    const updated = await updateApplicationStatusUseCase.execute({
      applicationId,
      employerProfileId: employerProfile.id,
      newStatus,
    });

    revalidatePath(`/employer/listings/${listingId}/applicants/${applicationId}`);
    revalidatePath(`/employer/listings/${listingId}/applicants`);
    revalidatePath(`/student/applications/${applicationId}`);

    return { success: true, status: updated.application.status };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Status update failed';
    return { success: false, error: message };
  }
}

export async function sendEmployerMessageAction(applicationId: string, body: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'EMPLOYER') {
    return { success: false, error: 'Unauthorized: Employer role required' };
  }

  try {
    const message = await sendMessageUseCase.execute({
      applicationId,
      senderUserId: session.user.id,
      body,
    });

    revalidatePath(`/employer/listings/[id]/applicants/${applicationId}`, 'page');
    return { success: true, message: message.toObject() };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to send message';
    return { success: false, error: msg };
  }
}
