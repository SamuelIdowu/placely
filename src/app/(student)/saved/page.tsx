import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getSavedListingsUseCase, studentProfileRepo } from '@/lib/container';
import { ListingCard } from '@/components/listings/ListingCard';
import { Bookmark, Compass } from 'lucide-react';
import Link from 'next/link';

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
  const savedListings = profile ? await getSavedListingsUseCase.execute(profile.id) : [];

  return (
    <div className="w-full max-w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <Bookmark className="w-7 h-7 text-indigo-600 fill-indigo-600/20" /> Saved Placements
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Bookmarked industrial training positions ready for application.
          </p>
        </div>

        <Link
          href="/listings"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-sm"
        >
          <Compass className="w-4 h-4" /> Explore More
        </Link>
      </div>

      {savedListings.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 py-16 px-4 text-center shadow-md space-y-4">
          <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Bookmark className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">No saved placements yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click the bookmark icon on any placement card in the marketplace to save opportunities for easy access.
            </p>
          </div>
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Browse Listings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} isSavedInitial={true} />
          ))}
        </div>
      )}
    </div>
  );
}
