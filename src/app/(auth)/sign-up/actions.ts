'use server';

import { prisma } from '@/infrastructure/db/prisma.client';
import bcrypt from 'bcryptjs';
import { registerStudentUseCase, registerEmployerUseCase } from '@/lib/container';
import { signUpStudentSchema, signUpEmployerSchema } from '@/domain/value-objects/auth';

export async function signUpAction(formData: FormData) {
  const role = (formData.get('role') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;

  if (role === 'STUDENT') {
    const university = (formData.get('university') as string)?.trim();
    const discipline = (formData.get('discipline') as string)?.trim();
    const rawCgpa = formData.get('cgpa') as string;
    const parsedCgpa = rawCgpa ? parseFloat(rawCgpa) : undefined;
    const cgpa = (parsedCgpa !== undefined && !isNaN(parsedCgpa)) ? parsedCgpa : undefined;
    const bio = (formData.get('bio') as string)?.trim() || undefined;

    const validation = signUpStudentSchema.safeParse({
      email,
      password,
      university,
      discipline,
      cgpa,
      bio,
    });

    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid student registration data.';
      return { error: firstError };
    }
  } else if (role === 'EMPLOYER') {
    const companyName = (formData.get('companyName') as string)?.trim();
    const cacNumber = (formData.get('cacNumber') as string)?.trim();
    const description = (formData.get('description') as string)?.trim() || undefined;
    const websiteUrl = (formData.get('websiteUrl') as string)?.trim() || undefined;

    const validation = signUpEmployerSchema.safeParse({
      email,
      password,
      companyName,
      cacNumber,
      description,
      websiteUrl,
    });

    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid employer registration data.';
      return { error: firstError };
    }
  } else {
    return { error: 'Invalid role selected.' };
  }

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
      await registerStudentUseCase.execute({
        userId: user.id,
        university: formData.get('university') as string,
        discipline: formData.get('discipline') as string,
        cgpa: formData.get('cgpa') ? parseFloat(formData.get('cgpa') as string) : undefined,
        bio: (formData.get('bio') as string) || undefined,
      });
    } else {
      await registerEmployerUseCase.execute({
        userId: user.id,
        companyName: formData.get('companyName') as string,
        cacNumber: formData.get('cacNumber') as string,
        description: (formData.get('description') as string) || undefined,
        websiteUrl: (formData.get('websiteUrl') as string) || undefined,
      });
    }

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to register account.';
    return { error: message };
  }
}
