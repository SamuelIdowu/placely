// app/(admin)/admin/listings/page.tsx

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { listingRepo } from '@/lib/container';
import { AdminListingsTable } from './AdminListingsTable';

export const metadata: Metadata = { title: 'Listings Moderation — Placely Admin' };

export default async function ListingModerationPage() {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') redirect('/');

  const listings = await listingRepo.findAllForAdmin();

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-8">
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#93939f]">
          Listing Moderation &amp; Quality Control
        </span>
        <h1 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-slate-900">
          Listings Moderation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Audit SIWES placement listings across all employers. Flag non-compliant listings or restore previously moderated placements.
        </p>
      </div>

      <AdminListingsTable initialListings={listings} />
    </div>
  );
}
