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
    <main className="container max-w-6xl py-8 px-4 sm:px-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Verification Queue</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review pending Student ID cards and Corporate CAC documents submitted for verification.
        </p>
      </div>

      <VerificationQueueTable
        items={paginatedResult.items}
        total={paginatedResult.total}
        page={paginatedResult.page}
        totalPages={paginatedResult.totalPages}
      />
    </main>
  );
}
