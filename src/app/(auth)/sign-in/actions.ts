'use server';

import { prisma } from '@/infrastructure/db/prisma.client';
import { signIn } from '@/lib/auth';
import { signInSchema } from '@/domain/value-objects/auth';
import { AuthError } from 'next-auth';

export type SignInActionResult = {
  success?: boolean;
  error?: string;
  code?: 'ACCOUNT_NOT_FOUND' | 'INVALID_PASSWORD' | 'NO_PASSWORD' | 'VALIDATION_ERROR' | 'UNKNOWN';
  redirectUrl?: string;
};

export async function signInAction(formData: FormData): Promise<SignInActionResult> {
  const rawEmail = (formData.get('email') as string) || '';
  const email = rawEmail.trim().toLowerCase();
  const password = (formData.get('password') as string) || '';
  const callbackUrl = (formData.get('callbackUrl') as string) || '';

  const validation = signInSchema.safeParse({ email, password });
  if (!validation.success) {
    const firstError = validation.error.issues[0]?.message || 'Invalid email or password.';
    return { error: firstError, code: 'VALIDATION_ERROR' };
  }

  // Pre-check user account status in database
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, role: true, passwordHash: true },
  });

  if (!user) {
    return {
      error: `No Placely account exists for ${email}. Please check your spelling or create an account.`,
      code: 'ACCOUNT_NOT_FOUND',
    };
  }

  if (!user.passwordHash) {
    return {
      error: 'This account was registered without a password. Please sign in via social provider or reset password.',
      code: 'NO_PASSWORD',
    };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    const defaultRedirect =
      user.role === 'EMPLOYER'
        ? '/employer/dashboard'
        : user.role === 'ADMIN'
        ? '/admin/dashboard'
        : '/dashboard';

    const finalRedirect = callbackUrl && callbackUrl.startsWith('/') ? callbackUrl : defaultRedirect;

    return { success: true, redirectUrl: finalRedirect };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            error: 'Incorrect password. Please check your credentials and try again.',
            code: 'INVALID_PASSWORD',
          };
        default:
          return {
            error: 'Authentication failed. Please try again.',
            code: 'UNKNOWN',
          };
      }
    }
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { error: message, code: 'UNKNOWN' };
  }
}
