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
    <div className="max-w-6xl mx-auto space-y-5 pb-8">
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#93939f]">
          Identity &amp; Role Management
        </span>
        <h1 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-slate-900">
          User Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Search platform users, view account roles, check verification statuses, and inspect user profile histories.
        </p>
      </div>

      <AdminUsersClient initialUsers={users} />
    </div>
  );
}
