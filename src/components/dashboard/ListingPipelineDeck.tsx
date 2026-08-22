import React from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, Briefcase } from 'lucide-react';

export interface ListingWithCount {
  id: string;
  title: string;
  location: string;
  isRemote: boolean;
  isOpen: boolean;
  applicantCount: number;
  createdAt: string;
}

interface ListingPipelineDeckProps {
  listings: ListingWithCount[];
}

export function ListingPipelineDeck({ listings }: ListingPipelineDeckProps) {
  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Active Placement Listings &amp; Review Pipeline
        </h2>
        <Link
          href="/employer/listings/new"
          className="text-xs font-semibold text-brand-indigo hover:text-brand-indigo-hover transition-colors"
        >
          + Create Role
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-card border border-dashed border-slate-200 py-10 px-6 bg-white text-center space-y-2.5">
          <Briefcase className="w-9 h-9 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">
              No active placement listings posted yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create your first verified placement opening to start receiving applications from ambitious Nigerian engineering undergraduates.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/employer/listings/new"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-bold transition-all shadow-xs"
            >
              Post SIWES Placement Opening <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-card p-5 border border-border hover:border-brand-indigo transition-all hover:shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-base">{listing.title}</span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      listing.isOpen
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {listing.isOpen ? 'OPEN' : 'CLOSED'}
                  </span>
                </div>
                <p className="text-xs text-body-muted font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {listing.location} {listing.isRemote && '· Remote'} · Posted {listing.createdAt}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-5">
                <div className="text-right">
                  <span className="text-xl font-black text-brand-indigo block leading-none">
                    {listing.applicantCount}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Candidates</span>
                </div>

                <Link
                  href={`/employer/listings/${listing.id}/applicants`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-bold transition-all shadow-xs"
                >
                  Review Applicants <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
