'use server';

import { auth } from '@/lib/auth';
import { updateStudentProfileUseCase, uploadResumeUseCase } from '@/lib/container';
import { revalidatePath } from 'next/cache';

export async function saveStudentProfile(formData: {
  university: string;
  discipline: string;
  cgpa?: number;
  resumeUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  bio?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized. Please sign in.' };
  }

  const result = await updateStudentProfileUseCase.execute({
    userId: session.user.id,
    ...formData,
  });

  if (!result.success || !result.profile) {
    return { success: false, error: result.error ?? 'Failed to update profile' };
  }

  revalidatePath('/(student)/profile', 'page');
  return { success: true, profile: result.profile.toObject() };
}

export async function uploadStudentDocument(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized. Please sign in.' };
  }

  const file = formData.get('file') as File | null;
  const typeParam = formData.get('type') as string | null;

  if (!file) {
    return { success: false, error: 'No file provided' };
  }

  const type = typeParam === 'SCHOOL_ID' ? 'SCHOOL_ID' : 'RESUME';

  const result = await uploadResumeUseCase.execute({
    userId: session.user.id,
    file,
    type,
  });

  if (!result.success || !result.fileUrl) {
    return { success: false, error: result.error ?? 'Failed to upload document' };
  }

  revalidatePath('/(student)/profile', 'page');
  return { success: true, url: result.fileUrl };
}
