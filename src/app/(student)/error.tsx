'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function StudentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Student route error:', error);
  }, [error]);

  return (
    <div className="py-12 flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-md bg-white border border-app-border p-6 rounded-lg shadow-sm space-y-3">
        <AlertCircle className="h-8 w-8 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Student Portal Error</h2>
        <p className="text-xs text-muted-foreground">
          We encountered an error loading student portal information. Please try refreshing.
        </p>

        <div className="flex items-center justify-center gap-2 pt-2">
          <Button onClick={() => reset()} size="sm">
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Reload Page
          </Button>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center h-8 px-3 text-xs font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-[4px] transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
