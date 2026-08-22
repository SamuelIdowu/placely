import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { employerProfileRepo, listingRepo } from '@/lib/container';
import { redirect, notFound } from 'next/navigation';
import { EditListingForm } from './EditListingForm';

export const metadata: Metadata = { title: 'Edit Internship Listing — Placely' };

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session || session.user.role !== 'EMPLOYER') {
    redirect('/sign-in');
  }

  const { id } = await params;
  const employer = await employerProfileRepo.findByUserId(session.user.id);
  if (!employer) redirect('/auth/login');

  const listingEntity = await listingRepo.findById(id);
  if (!listingEntity) notFound();

  const listing = listingEntity.toObject();
  if (listing.employerProfileId !== employer.id) {
    redirect('/employer/listings');
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Internship Listing</h1>
        <p className="text-sm text-slate-500">Update listing details for applicants.</p>
      </div>

      <EditListingForm listing={listing} />
    </div>
  );
}
