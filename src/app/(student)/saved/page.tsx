import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getSavedListingsUseCase, studentProfileRepo } from '@/lib/container';
import { mockListings, mockEmployerProfiles } from '@/lib/mock';
import { Bookmark, Compass } from 'lucide-react';
import Link from 'next/link';
import { SavedViewManager } from './SavedViewManager';

import type { ListingWithEmployer } from '@/domain/ports/IListingRepository';

export const metadata: Metadata = {
  title: 'Saved Placements | Placely',
  description: 'View your bookmarked SIWES placement opportunities.',
};

export default async function SavedListingsPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== 'STUDENT') {
    redirect('/auth/signin?callbackUrl=/saved');
  }

  const profile = await studentProfileRepo.findByUserId(session.user.id);
  // const savedListings = profile ? await getSavedListingsUseCase.execute(profile.id) : [];
  
  // Use mock listings 1 and 3 as "saved" for visualization
  const savedListings: ListingWithEmployer[] = [mockListings[0], mockListings[2]].map(listing => {
    const employer = mockEmployerProfiles.find(e => e.id === listing.employerProfileId)!;
    return {
      ...listing.toObject(),
      companyName: employer.companyName,
      companyLogoUrl: employer.toObject().logoUrl ?? null,
      companyVerificationStatus: employer.verificationStatus,
    };
  });

  return (
    <div className="w-full max-w-full space-y-5 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-slate-900 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-indigo-600 fill-indigo-100" /> Saved Placements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Bookmarked industrial training positions ready for application.
          </p>
        </div>

        <Link
          href="/listings"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#4f46e5] hover:bg-[#4338ca] text-white font-semibold text-xs transition-colors shadow-xs"
        >
          <Compass className="w-3.5 h-3.5" /> Explore More
        </Link>
      </div>

      <SavedViewManager savedListings={savedListings} />
    </div>
  );
}
