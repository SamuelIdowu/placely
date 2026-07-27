'use server';

import { auth } from '@/lib/auth';
import { moderateListingUseCase } from '@/lib/container';
import { revalidatePath } from 'next/cache';

export async function flagListing(id: string) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const result = await moderateListingUseCase.execute({
    listingId: id,
    isModerated: true,
  });

  if (!result.success) {
    throw new Error(result.error || 'Failed to flag listing');
  }

  revalidatePath('/admin/listings');
  revalidatePath('/admin/dashboard');
  revalidatePath('/listings');
  return { success: true };
}

export async function restoreListing(id: string) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const result = await moderateListingUseCase.execute({
    listingId: id,
    isModerated: false,
  });

  if (!result.success) {
    throw new Error(result.error || 'Failed to restore listing');
  }

  revalidatePath('/admin/listings');
  revalidatePath('/admin/dashboard');
  revalidatePath('/listings');
  return { success: true };
}
