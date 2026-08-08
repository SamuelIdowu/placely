"use client";

import React, { useState } from 'react';
import { ListViewControls } from '@/components/shared/ListViewControls';
import { ListingCard } from '@/components/listings/ListingCard';
import type { ListingWithEmployer } from '@/domain/ports/IListingRepository';
import Link from 'next/link';
import { Bookmark } from 'lucide-react';

export function SavedViewManager({ savedListings }: { savedListings: ListingWithEmployer[] }) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredListings = savedListings.filter(
    (listing) =>
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      <ListViewControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewChange={setViewMode}
        placeholder="Search saved placements..."
      />

      {filteredListings.length === 0 ? (
        <div className="bg-card rounded-lg border border-border py-16 px-4 text-center shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-full bg-secondary text-muted-foreground flex items-center justify-center mx-auto">
            <Bookmark className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">
              {searchQuery ? "No matches found" : "No saved placements yet"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {searchQuery 
                ? "Try adjusting your search terms to find what you're looking for." 
                : "Click the bookmark icon on any placement card in the marketplace to save opportunities for easy access."}
            </p>
          </div>
          {!searchQuery && (
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              Browse Listings
            </Link>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} isSavedInitial={true} viewMode={viewMode} />
          ))}
        </div>
      )}
    </div>
  );
}
