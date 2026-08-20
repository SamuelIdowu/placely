'use client';

import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ListingCard } from './ListingCard';
import type { ListingWithEmployer } from '@/domain/ports/IListingRepository';

interface ListingGridProps {
  listings: ListingWithEmployer[];
  hrefPrefix?: string;
}

export function ListingGrid({ listings, hrefPrefix = '/listings' }: ListingGridProps) {
  const [view, setView] = React.useState<'grid' | 'list'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('placely_listings_view') as 'grid' | 'list') || 'grid';
    }
    return 'grid';
  });

  const toggleView = (newView: 'grid' | 'list') => {
    setView(newView);
    localStorage.setItem('placely_listings_view', newView);
  };

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex items-center justify-end">
        <div className="inline-flex items-center gap-0.5 p-0.5 bg-slate-100 rounded-lg">
          <button
            onClick={() => toggleView('grid')}
            className={cn(
              'p-1.5 rounded-md transition-all cursor-pointer',
              view === 'grid'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            )}
            aria-label="Grid view"
            title="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleView('list')}
            className={cn(
              'p-1.5 rounded-md transition-all cursor-pointer',
              view === 'list'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            )}
            aria-label="List view"
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Listings */}
      {view === 'list' ? (
        <div className="space-y-2">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} hrefPrefix={hrefPrefix} viewMode="list" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} hrefPrefix={hrefPrefix} viewMode="grid" />
          ))}
        </div>
      )}
    </div>
  );
}
