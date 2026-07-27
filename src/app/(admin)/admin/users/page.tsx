// app/(admin)/admin/users/page.tsx

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/infrastructure/db/prisma.client';
import { AdminUsersClient } from './AdminUsersClient';

export const metadata: Metadata = { title: 'User Management — Placely Admin' };

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') redirect('/');

  const users = await prisma.user.findMany({
    include: {
      student: {
        select: {
          id: true,
          university: true,
          discipline: true,
          verificationStatus: true,
          resumeUrl: true,
        },
      },
      employer: {
        select: {
          id: true,
          companyName: true,
          cacNumber: true,
          verificationStatus: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Search platform users, view account roles, check verification statuses, and inspect user profile histories.
        </p>
      </div>

      <AdminUsersClient initialUsers={users} />
    </div>
  );
}
