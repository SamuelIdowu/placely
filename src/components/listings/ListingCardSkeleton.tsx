import * as React from 'react';
import { Skeleton } from '@/components/shared/Skeleton';

export function ListingCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-card p-5 shadow-xs space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />

      <div className="flex items-center gap-2 pt-2">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </div>
  );
}
