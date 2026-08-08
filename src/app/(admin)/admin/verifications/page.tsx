// app/(admin)/admin/verifications/page.tsx

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { verificationRepo } from '@/lib/container';
import { VerificationQueueTable } from './VerificationQueueTable';

export const metadata: Metadata = { title: 'Verification Queue — Placely Admin' };

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function VerificationsQueuePage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  const resolvedParams = await searchParams;
  const page = Math.max(1, parseInt(resolvedParams.page ?? '1', 10) || 1);
  const limit = 20;

  const paginatedResult = await verificationRepo.findPendingAll({ page, limit });

  return (
    <div className="max-w-6xl space-y-5 pb-8 mx-auto">
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#93939f]">
          Institutional Compliance
        </span>
        <h1 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-slate-900">
          Admin Verification Queue
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Review pending Student ID cards and Corporate CAC documents submitted for institutional verification.
        </p>
      </div>

      <VerificationQueueTable
        items={paginatedResult.items}
        total={paginatedResult.total}
        page={paginatedResult.page}
        totalPages={paginatedResult.totalPages}
      />
    </div>
  );
}
