import React from 'react';
import Link from 'next/link';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { Plus, ArrowRight } from 'lucide-react';
import type { VerificationStatus } from '@/domain/entities/employer-profile';

interface EmployerWelcomeBandProps {
  companyName: string;
  cacNumber: string;
  email: string;
  verificationStatus: VerificationStatus;
}

export function EmployerWelcomeBand({
  companyName,
  cacNumber,
  email,
  verificationStatus,
}: EmployerWelcomeBandProps) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="rounded-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 bg-surface-dark">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <h1 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-white">
            {greeting}, {companyName}
          </h1>
          <VerificationBadge status={verificationStatus} size="sm" />
        </div>
        <p className="text-xs sm:text-sm font-medium text-surface-dark-muted">
          Corporate Portal · RC/CAC: {cacNumber || 'Pending CAC'} · {email}
        </p>
      </div>

      <Link
        href="/employer/listings/new"
        className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 text-xs font-semibold text-white bg-brand-indigo hover:bg-brand-indigo-hover rounded-full transition-all shrink-0 shadow-xs w-full sm:w-auto relative z-10"
      >
        <Plus className="w-3.5 h-3.5" /> Post New SIWES Opening
      </Link>
    </div>
  );
}
