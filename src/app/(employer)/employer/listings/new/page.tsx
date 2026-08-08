import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { employerProfileRepo } from '@/lib/container';
import { redirect } from 'next/navigation';
import { NewListingForm } from './NewListingForm';
import { PendingVerificationBanner } from '@/components/shared/PendingVerificationBanner';

export const metadata: Metadata = { title: 'Post an Internship Listing — Placely' };

export default async function NewListingPage() {
  const session = await auth();
  if (!session || session.user.role !== 'EMPLOYER') {
    redirect('/auth/login');
  }

  const employer = await employerProfileRepo.findByUserId(session.user.id);
  const isVerified = employer?.verificationStatus === 'VERIFIED';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Post an Internship Listing</h1>
        <p className="text-sm text-slate-500">
          Reach qualified engineering students for SIWES internship placements.
        </p>
      </div>

      {!isVerified && (
        <PendingVerificationBanner status={employer?.verificationStatus || 'PENDING'} />
      )}

      <NewListingForm isVerified={isVerified} />
    </div>
  );
}
