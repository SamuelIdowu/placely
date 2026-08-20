import * as React from 'react';
import { ListingCardSkeleton } from '@/components/listings/ListingCardSkeleton';
import { Skeleton } from '@/components/shared/Skeleton';

export default function ListingsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full max-w-96" />
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-36" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
