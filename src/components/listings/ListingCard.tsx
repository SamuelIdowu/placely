'use client';

import * as React from 'react';
import Link from 'next/link';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { MapPin, ArrowRight, Bookmark, Banknote, Clock } from 'lucide-react';
import type { ListingWithEmployer } from '@/domain/ports/IListingRepository';

interface ListingCardProps {
  listing: ListingWithEmployer;
  hrefPrefix?: string;
  isSavedInitial?: boolean;
  viewMode?: 'grid' | 'list';
}

function getCompanyColor(name: string): string {
  const colors = [
    '#4f46e5', '#1863dc', '#10b981', '#ff7759',
    '#8b5cf6', '#0891b2', '#d97706', '#059669',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
  return colors[Math.abs(hash) % colors.length];
}

export function ListingCard({
  listing,
  hrefPrefix = '/listings',
  isSavedInitial = false,
  viewMode = 'grid',
}: ListingCardProps) {
  const isVerified = listing.companyVerificationStatus === 'VERIFIED';
  const [isSaved, setIsSaved] = React.useState(isSavedInitial);

  const avatarColor = getCompanyColor(listing.companyName || '');
  const initials = listing.companyName ? listing.companyName.charAt(0).toUpperCase() : '?';

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
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#e5e7eb] group-hover:border-[#4f46e5] group-hover:bg-[#f8f7ff] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs"
              style={{ background: avatarColor }}
            >
              {initials}
            </div>

            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#212121] group-hover:text-[#4f46e5] transition-colors truncate">
                  {listing.title}
                </h3>
                {isVerified && <VerificationBadge size="sm" />}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-[#75758a]">
                <span className="font-semibold text-slate-800">{listing.companyName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {listing.location}
                </span>
                {listing.isRemote && (
                  <>
                    <span>•</span>
                    <span className="font-semibold text-[#4f46e5]">Remote</span>
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
                  ? 'text-[#4f46e5] bg-indigo-50 hover:bg-indigo-100'
                  : 'text-slate-400 hover:text-[#4f46e5] hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </Link>
    );
  }

  // GRID MODE (DEFAULT)
  return (
    <div className="bg-white rounded-[20px] p-5 border border-[#e5e7eb] hover:border-[#4f46e5] transition-all hover:shadow-xs flex flex-col justify-between group h-full">
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
                <span className="text-xs font-bold text-slate-900">{listing.companyName}</span>
                {isVerified && <VerificationBadge size="sm" />}
              </div>
              <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                {listing.location} {listing.isRemote && '· Remote'}
              </span>
            </div>
          </div>

          <button
            onClick={handleBookmarkToggle}
            aria-label={isSaved ? 'Remove from saved' : 'Save listing'}
            className={`p-2 rounded-full transition-all shrink-0 ${
              isSaved
                ? 'text-[#4f46e5] bg-indigo-50 hover:bg-indigo-100'
                : 'text-slate-400 hover:text-[#4f46e5] hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-base font-bold text-[#212121] leading-snug group-hover:text-[#4f46e5] transition-colors">
            <Link href={`${hrefPrefix}/${listing.id}`}>{listing.title}</Link>
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Discipline Chips & Stipend */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {listing.disciplines.slice(0, 2).map((disc) => (
            <span
              key={disc}
              className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700"
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
      <div className="pt-3.5 mt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" />
          6 Months SIWES
        </span>

        <Link
          href={`${hrefPrefix}/${listing.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#4f46e5] hover:text-[#4338ca] group-hover:translate-x-0.5 transition-transform"
        >
          View & Apply <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
