'use server';

import { auth } from '@/lib/auth';
import { updateEmployerProfileUseCase, uploadCacDocumentUseCase } from '@/lib/container';
import { revalidatePath } from 'next/cache';

export async function saveEmployerProfile(formData: {
  companyName: string;
  cacNumber: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized. Please sign in.' };
  }

  const result = await updateEmployerProfileUseCase.execute({
    userId: session.user.id,
    ...formData,
  });

  if (!result.success || !result.profile) {
    return { success: false, error: result.error ?? 'Failed to update company profile' };
  }

  revalidatePath('/(employer)/employer/profile', 'page');
  return { success: true, profile: result.profile.toObject() };
}

export async function uploadEmployerCac(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized. Please sign in.' };
  }

  const file = formData.get('file') as File | null;
  if (!file) {
    return { success: false, error: 'No CAC document file provided' };
  }

  const result = await uploadCacDocumentUseCase.execute({
    userId: session.user.id,
    file,
  });

  if (!result.success || !result.documentUrl) {
    return { success: false, error: result.error ?? 'Failed to upload CAC document' };
  }

  revalidatePath('/(employer)/employer/profile', 'page');
  return { success: true, url: result.documentUrl };
}
