import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { employerProfileRepo, listingRepo } from '@/lib/container';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { EmployerListingsList } from './EmployerListingsList';

export const metadata: Metadata = { title: 'My Listings — Placely' };

export default async function EmployerListingsPage() {
  const session = await auth();
  if (!session || session.user.role !== 'EMPLOYER') {
    redirect('/auth/login');
  }

  const employer = await employerProfileRepo.findByUserId(session.user.id);
  if (!employer) redirect('/auth/login');

  const items = await listingRepo.findByEmployer(employer.id);
  const serializableItems = items.map((item) => ({
    listing: item.listing.toObject(),
    applicantCount: item.applicantCount,
  }));

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Listings</h1>
          <p className="text-sm text-slate-500">Manage your active and closed internship positions.</p>
        </div>

        <Link
          href="/employer/listings/new"
          className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium rounded-[4px] bg-slate-900 text-white hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Post New Listing
        </Link>
      </div>

      <EmployerListingsList initialItems={serializableItems} />
    </main>
  );
}
