import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { MapPin, Calendar, Building2, ArrowRight } from 'lucide-react';
import type { ListingWithEmployer } from '@/domain/ports/IListingRepository';

interface ListingCardProps {
  listing: ListingWithEmployer;
  hrefPrefix?: string;
}

export function ListingCard({ listing, hrefPrefix = '/listings' }: ListingCardProps) {
  const isVerified = listing.companyVerificationStatus === 'VERIFIED';
  const formattedDate = new Date(listing.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Card className="rounded-lg shadow-sm border border-slate-200 hover:border-slate-300 transition-all hover:shadow-md group">
      <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{listing.companyName}</span>
              {isVerified && <VerificationBadge size="sm" />}
            </div>
            {listing.isRemote && (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                Remote
              </span>
            )}
          </div>

          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
            <Link href={`${hrefPrefix}/${listing.id}`}>{listing.title}</Link>
          </h3>

          <p className="text-sm text-slate-600 line-clamp-2">
            {listing.description}
          </p>
        </div>

        <div className="space-y-4 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap gap-1.5">
            {listing.disciplines.map((disc) => (
              <span
                key={disc}
                className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700"
              >
                {disc}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {listing.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formattedDate}
              </span>
            </div>

            <Link
              href={`${hrefPrefix}/${listing.id}`}
              className="inline-flex items-center gap-1 font-semibold text-slate-900 group-hover:text-indigo-600 text-xs"
            >
              View Details
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
