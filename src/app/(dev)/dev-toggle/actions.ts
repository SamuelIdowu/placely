'use server';

import { prisma } from '@/infrastructure/db/prisma.client';
import { auth, signIn, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';

const SEED_ACCOUNTS = {
  student: { email: 'student@unilag.edu.ng', password: 'Placely2026!' },
  employer: { email: 'hr@paystack.com', password: 'Placely2026!' },
  admin: { email: 'admin@placely.ng', password: 'Placely2026!' },
} as const;

type Role = 'STUDENT' | 'EMPLOYER' | 'ADMIN';

export async function switchAccount(role: Role) {
  const account = SEED_ACCOUNTS[role.toLowerCase() as keyof typeof SEED_ACCOUNTS];
  if (!account) return;

  await signOut({ redirect: false });
  await signIn('credentials', {
    email: account.email,
    password: account.password,
    redirect: false,
  });

  const dashboardMap: Record<Role, string> = {
    STUDENT: '/dashboard',
    EMPLOYER: '/employer/dashboard',
    ADMIN: '/admin/dashboard',
  };

  redirect(dashboardMap[role]);
}

export async function toggleVerification(status: 'PENDING' | 'VERIFIED' | 'REJECTED') {
  const session = await auth();
  if (!session?.user?.id) return;

  const userId = session.user.id;

  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
  });

  if (studentProfile) {
    await prisma.studentProfile.update({
      where: { userId },
      data: { verificationStatus: status },
    });
    redirect('/dashboard');
  }

  const employerProfile = await prisma.employerProfile.findUnique({
    where: { userId },
  });

  if (employerProfile) {
    await prisma.employerProfile.update({
      where: { userId },
      data: { verificationStatus: status },
    });
    redirect('/employer/dashboard');
  }
}

export async function getDevState() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userId = session.user.id;
  const role = session.user.role as Role;

  let verificationStatus: string | null = null;

  if (role === 'STUDENT') {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      select: { verificationStatus: true },
    });
    verificationStatus = profile?.verificationStatus ?? null;
  } else if (role === 'EMPLOYER') {
    const profile = await prisma.employerProfile.findUnique({
      where: { userId },
      select: { verificationStatus: true },
    });
    verificationStatus = profile?.verificationStatus ?? null;
  }

  return {
    role,
    email: session.user.email ?? 'unknown',
    verificationStatus,
  };
}
