'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Unhandled runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-app-bg text-app-fg px-4 py-12 text-center">
      <div className="max-w-md bg-white border border-app-border p-8 rounded-lg shadow-sm space-y-4">
        <div className="p-3 bg-rose-50 text-rose-600 rounded-full w-fit mx-auto">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Something went wrong</h1>
        <p className="text-xs text-muted-foreground">
          An unexpected system error occurred while processing your request. Please try again or return to home.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button onClick={() => reset()} variant="default" size="sm">
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Try Again
          </Button>

          <Link
            href="/"
            className="inline-flex items-center justify-center h-8 px-3 text-xs font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-[4px] transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
