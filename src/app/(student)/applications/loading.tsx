import * as React from 'react';
import { Skeleton } from '@/components/shared/Skeleton';

export default function StudentApplicationsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full max-w-80" />
      </div>

      <div className="bg-card border border-border rounded-card p-5 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
