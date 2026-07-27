import * as React from 'react';
import { Skeleton } from '@/components/shared/Skeleton';

export default function EmployerListingsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-32 rounded-[4px]" />
      </div>

      <div className="bg-white border border-app-border rounded-lg p-4 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-slate-100 last:border-0 gap-3">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-64" />
              <Skeleton className="h-3 w-40" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-[4px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
