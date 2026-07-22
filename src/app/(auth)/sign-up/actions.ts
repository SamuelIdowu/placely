'use server';

import { prisma } from '@/infrastructure/db/prisma.client';
import bcrypt from 'bcryptjs';
import { registerStudentUseCase, registerEmployerUseCase } from '@/lib/container';

export async function signUpAction(formData: FormData) {
  const role = formData.get('role') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: 'An account with this email already exists.' };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: role as 'STUDENT' | 'EMPLOYER',
      },
    });

    if (role === 'STUDENT') {
      const firstName = formData.get('firstName') as string;
      const lastName = formData.get('lastName') as string;

      await registerStudentUseCase.execute({
        userId: user.id,
        university: formData.get('university') as string,
        discipline: formData.get('discipline') as string,
        cgpa: formData.get('cgpa') ? parseFloat(formData.get('cgpa') as string) : undefined,
        bio: formData.get('bio') as string,
      });
    } else if (role === 'EMPLOYER') {
      await registerEmployerUseCase.execute({
        userId: user.id,
        companyName: formData.get('companyName') as string,
        cacNumber: formData.get('cacNumber') as string,
        description: formData.get('description') as string | undefined,
        websiteUrl: formData.get('websiteUrl') as string | undefined,
      });
    } else {
      return { error: 'Invalid role selected.' };
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Failed to register account.' };
  }
}
