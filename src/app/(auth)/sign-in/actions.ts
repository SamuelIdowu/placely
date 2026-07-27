'use server';

import { signIn } from '@/lib/auth';
import { signInSchema } from '@/domain/value-objects/auth';
import { AuthError } from 'next-auth';

export async function signInAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validation = signInSchema.safeParse({ email, password });
  if (!validation.success) {
    const firstError = validation.error.issues[0]?.message || 'Invalid input data.';
    return { error: firstError };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid email or password.' };
        default:
          return { error: 'Authentication failed. Please try again.' };
      }
    }
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { error: message };
  }
}
