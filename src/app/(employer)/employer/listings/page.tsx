import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { employerProfileRepo, listingRepo } from '@/lib/container';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { EmployerListingsList } from './EmployerListingsList';

export const metadata: Metadata = { title: 'My Listings — Placely' };

export default async function EmployerListingsPage() {
  const session = await auth();
  if (!session || session.user.role !== 'EMPLOYER') {
    redirect('/sign-in');
  }

  const employer = await employerProfileRepo.findByUserId(session.user.id);
  if (!employer) redirect('/auth/login');

  const items = await listingRepo.findByEmployer(employer.id);
  const serializableItems = items.map((item) => ({
    listing: item.listing.toObject(),
    applicantCount: item.applicantCount,
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="My Listings"
        description="Manage your active, draft, and closed SIWES internship placements."
        breadcrumbs={[
          { label: "Employer Portal", href: "/employer/dashboard" },
          { label: "My Listings" },
        ]}
        actions={
          <Link href="/employer/listings/new">
            <Button variant="indigo" size="default" className="gap-2">
              <Plus className="w-4 h-4" />
              Post New Listing
            </Button>
          </Link>
        }
      />

      <EmployerListingsList initialItems={serializableItems} />
    </div>
  );
}
