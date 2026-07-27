import type { Metadata } from 'next';
import { browseListingsUseCase } from '@/lib/container';
import { FilterSidebar } from '@/components/listings/FilterSidebar';
import { FilterSheet } from '@/components/listings/FilterSheet';
import { ListingCard } from '@/components/listings/ListingCard';
import { Card, CardContent } from '@/components/ui/card';
import { SearchX } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Browse Placements — Placely' };

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
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Browse SIWES Internship Placements
          </h1>
          <p className="text-sm text-slate-500">
            Discover verified engineering internship opportunities across Nigeria.
          </p>
        </div>

        <FilterSheet />
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <FilterSidebar />

        <div className="flex-1 space-y-6 w-full">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>
              Showing {result.listings.length} of {result.total} {result.total === 1 ? 'placement' : 'placements'}
            </span>
            {(params.discipline || params.location || params.keyword) && (
              <span className="text-indigo-600 font-semibold">Filtered results</span>
            )}
          </div>

          {result.listings.length === 0 ? (
            <Card className="rounded-lg border border-slate-200 py-12">
              <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <SearchX className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-slate-900">No listings match your filters</h3>
                  <p className="text-sm text-slate-500 max-w-sm">
                    Try adjusting your discipline, location, or keyword search criteria to find available positions.
                  </p>
                </div>
              </CardContent>
            </Card>
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
                    className={`h-9 w-9 flex items-center justify-center rounded-[4px] text-sm font-medium transition-colors ${
                      isCurrent
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
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
    </main>
  );
}
