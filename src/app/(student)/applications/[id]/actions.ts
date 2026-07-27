'use server';

import { auth } from '@/lib/auth';
import { respondToOfferUseCase, sendMessageUseCase, studentProfileRepo } from '@/lib/container';
import { revalidatePath } from 'next/cache';

export async function respondToOfferAction(applicationId: string, decision: 'ACCEPTED' | 'DECLINED') {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'STUDENT') {
    return { success: false, error: 'Unauthorized: Student role required' };
  }

  const studentProfile = await studentProfileRepo.findByUserId(session.user.id);
  if (!studentProfile) {
    return { success: false, error: 'Student profile not found' };
  }

  try {
    const result = await respondToOfferUseCase.execute({
      applicationId,
      studentProfileId: studentProfile.id,
      decision,
    });

    revalidatePath(`/applications/${applicationId}`);
    revalidatePath('/applications');
    revalidatePath('/dashboard');

    return { success: true, status: result.application.status };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Action failed';
    return { success: false, error: message };
  }
}

export async function sendStudentMessageAction(applicationId: string, body: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'STUDENT') {
    return { success: false, error: 'Unauthorized: Student role required' };
  }

  try {
    const message = await sendMessageUseCase.execute({
      applicationId,
      senderUserId: session.user.id,
      body,
    });

    revalidatePath(`/applications/${applicationId}`);
    return { success: true, message: message.toObject() };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to send message';
    return { success: false, error: msg };
  }
}
