import type { Metadata } from 'next';
import { browseListingsUseCase } from '@/lib/container';
import { FilterSidebar } from '@/components/shared/FilterSidebar';
import { FilterSheet } from '@/components/listings/FilterSheet';
import { ListingCard } from '@/components/listings/ListingCard';
import { EmployerLogoCarousel } from '@/components/shared/EmployerLogoCarousel';
import { SearchX, Building2, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Browse SIWES Placements — Placely',
  description: 'Verified SIWES placements and industrial training opportunities for engineering students across Nigeria.',
};

interface SearchParamsProps {
  discipline?: string;
  location?: string;
  keyword?: string;
  isRemote?: string;
  page?: string;
}

export default async function ListingsBrowsePage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsProps>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const pageSize = 10;

  const result = await browseListingsUseCase.execute({
    discipline: params.discipline,
    location: params.location,
    keyword: params.keyword,
    isRemote: params.isRemote === 'true' ? true : undefined,
    page,
    pageSize,
  });

  const totalPages = Math.ceil(result.total / pageSize);

  return (
    <div className="space-y-5">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Direct Industry Attachment
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Sparkles className="w-2.5 h-2.5" /> 100% Verified CAC
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-slate-900 mt-1">
            SIWES Placement Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Verified 3-month and 6-month industrial training placements across Nigeria&apos;s leading engineering sectors.
          </p>
        </div>

        <FilterSheet />
      </div>

      {/* Main Filter & Listing Grid */}
      <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 items-start w-full">
        {/* Desktop Filter Sidebar */}
        <FilterSidebar />

        {/* Content Area */}
        <div className="flex-1 space-y-6 w-full min-w-0">
          <EmployerLogoCarousel />

          {/* Result Count and Active Filters bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>
              Showing <span className="font-bold text-slate-900">{result.listings.length}</span> of {result.total} {result.total === 1 ? 'placement' : 'placements'}
            </span>
            {(params.discipline || params.location || params.keyword) && (
              <span className="text-brand-indigo font-semibold bg-brand-indigo-light px-2.5 py-0.5 rounded-full border border-indigo-100">
                Filtered results
              </span>
            )}
          </div>

          {result.listings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-10 px-6 bg-white text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-brand-indigo-light flex items-center justify-center text-brand-indigo mx-auto">
                <SearchX className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">No placements match your active filters</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing your discipline or location filter to explore open engineering training opportunities.
                </p>
              </div>
              <Link
                href="/listings"
                className="inline-block mt-2 text-xs font-bold text-brand-indigo hover:text-brand-indigo-hover"
              >
                Clear all filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} hrefPrefix="/listings" />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const isCurrent = p === page;
                const newSearchParams = new URLSearchParams(params as Record<string, string>);
                newSearchParams.set('page', p.toString());

                return (
                  <Link
                    key={p}
                    href={`/listings?${newSearchParams.toString()}`}
                    className={`h-9 w-9 flex items-center justify-center rounded-full text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-brand-indigo text-white shadow-xs'
                        : 'bg-white border border-border text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
