import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { MapPin, Building2, ArrowUpRight, Bookmark } from 'lucide-react';
import type { ListingWithEmployer } from '@/domain/ports/IListingRepository';

interface ListingCardProps {
  listing: ListingWithEmployer;
  hrefPrefix?: string;
}

export function ListingCard({ listing, hrefPrefix = '/listings' }: ListingCardProps) {
  const isVerified = listing.companyVerificationStatus === 'VERIFIED';

  return (
    <Card className="rounded-lg shadow-md hover:shadow-lg border border-slate-100 bg-white transition-all duration-200 group">
      <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 p-2 flex items-center justify-center font-bold text-slate-800 text-base shrink-0 overflow-hidden group-hover:border-indigo-200 transition-colors">
                {listing.companyName ? listing.companyName.charAt(0).toUpperCase() : <Building2 className="w-5 h-5 text-slate-400" />}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-500">{listing.companyName}</span>
                  {isVerified && <VerificationBadge size="sm" />}
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                  <Link href={`${hrefPrefix}/${listing.id}`}>{listing.title}</Link>
                </h3>
              </div>
            </div>

            <button
              aria-label="Save listing"
              className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-colors shrink-0"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>
        </div>

        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            {listing.disciplines.slice(0, 2).map((disc) => (
              <span
                key={disc}
                className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700"
              >
                {disc}
              </span>
            ))}
            {listing.isRemote && (
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                Remote
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div className="font-extrabold text-indigo-600 text-sm">
              SIWES Stipend Available
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {listing.location}
              </span>

              <Link
                href={`${hrefPrefix}/${listing.id}`}
                className="p-1.5 rounded-md bg-slate-50 text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors"
                title="View Details"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
