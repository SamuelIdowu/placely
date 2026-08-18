'use client';

import * as React from 'react';
import Link from 'next/link';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { MapPin, ArrowRight, Bookmark, Banknote, Clock, Sparkles } from 'lucide-react';
import type { ListingWithEmployer } from '@/domain/ports/IListingRepository';
import { getCompanyAvatarColor } from '@/lib/tokens';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface ListingCardProps {
  listing: ListingWithEmployer;
  hrefPrefix?: string;
  isSavedInitial?: boolean;
  viewMode?: 'grid' | 'list';
}

export function ListingCard({
  listing,
  hrefPrefix = '/listings',
  isSavedInitial = false,
  viewMode = 'grid',
}: ListingCardProps) {
  const isExternal = listing.sourceType === 'CURATED_EXTERNAL';
  const isVerified = !isExternal && listing.companyVerificationStatus === 'VERIFIED';
  const [isSaved, setIsSaved] = React.useState(isSavedInitial);

  const companyDisplayName = isExternal
    ? (listing.externalCompany || listing.companyName || 'Industry Partner')
    : (listing.companyName || 'Verified Employer');

  const avatarColor = getCompanyAvatarColor(companyDisplayName);
  const initials = companyDisplayName ? companyDisplayName.charAt(0).toUpperCase() : '?';

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsSaved(!isSaved);

    try {
      const res = await fetch('/api/student/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: listing.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsSaved(data.isSaved);
      } else {
        setIsSaved(isSavedInitial);
      }
    } catch {
      setIsSaved(isSavedInitial);
    }
  };

  if (viewMode === 'list') {
    return (
      <Link href={`${hrefPrefix}/${listing.id}`} className="block group">
        <Card
          variant="interactive"
          density="compact"
          className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs"
              style={{ background: avatarColor }}
            >
              {initials}
            </div>

            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground group-hover:text-brand-indigo transition-colors truncate">
                  {listing.title}
                </h3>
                {isVerified && <VerificationBadge size="sm" />}
                {isExternal && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[9px] px-1.5 py-0">
                    <Sparkles className="w-2.5 h-2.5 mr-0.5" /> Curated
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-body-muted">
                <span className="font-semibold text-foreground">{companyDisplayName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  {listing.location}
                </span>
                {listing.isRemote && (
                  <>
                    <span>•</span>
                    <span className="font-semibold text-brand-indigo">Remote</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Banknote className="w-3 h-3" />
              ₦65k–₦85k/mo
            </span>

            <button
              onClick={handleBookmarkToggle}
              aria-label={isSaved ? 'Remove from saved' : 'Save listing'}
              className={`p-2 rounded-full transition-all shrink-0 ${
                isSaved
                  ? 'text-brand-indigo bg-brand-indigo-light hover:bg-indigo-100'
                  : 'text-muted-foreground hover:text-brand-indigo hover:bg-muted'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </Card>
      </Link>
    );
  }

  // GRID MODE (DEFAULT)
  return (
    <Card
      variant="interactive"
      className="p-5 flex flex-col justify-between group h-full space-y-4"
    >
      <div className="space-y-3.5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs"
              style={{ background: avatarColor }}
            >
              {initials}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-foreground">{companyDisplayName}</span>
                {isVerified && <VerificationBadge size="sm" />}
                {isExternal && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[9px] px-1.5 py-0">
                    <Sparkles className="w-2.5 h-2.5 mr-0.5" /> Curated
                  </Badge>
                )}
              </div>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                {listing.location} {listing.isRemote && '· Remote'}
              </span>
            </div>
          </div>

          <button
            onClick={handleBookmarkToggle}
            aria-label={isSaved ? 'Remove from saved' : 'Save listing'}
            className={`p-2 rounded-full transition-all shrink-0 ${
              isSaved
                ? 'text-brand-indigo bg-brand-indigo-light hover:bg-indigo-100'
                : 'text-muted-foreground hover:text-brand-indigo hover:bg-muted'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-brand-indigo transition-colors">
            <Link href={`${hrefPrefix}/${listing.id}`}>{listing.title}</Link>
          </h3>
          <p className="text-xs text-body-muted line-clamp-2 mt-1.5 leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Discipline Chips & Stipend */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {listing.disciplines.slice(0, 2).map((disc) => (
            <span
              key={disc}
              className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-foreground"
            >
              {disc}
            </span>
          ))}

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 ml-auto">
            <Banknote className="w-2.5 h-2.5" />
            ₦60k–₦80k/mo
          </span>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="pt-3.5 mt-4 border-t border-border flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
          <Clock className="w-3 h-3 text-muted-foreground" />
          6 Months SIWES
        </span>

        <Link
          href={`${hrefPrefix}/${listing.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-indigo hover:text-brand-indigo-hover group-hover:translate-x-0.5 transition-transform"
        >
          {isExternal ? (
            <>Outreach &amp; Apply <ArrowRight className="w-3 h-3" /></>
          ) : (
            <>View &amp; Apply <ArrowRight className="w-3 h-3" /></>
          )}
        </Link>
      </div>
    </Card>
  );
}
