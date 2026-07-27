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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Listings Moderation</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Audit SIWES placement listings across all employers. Flag non-compliant listings or restore previously moderated placements.
        </p>
      </div>

      <AdminListingsTable initialListings={listings} />
    </div>
  );
}
