'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, LayoutDashboard } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 py-12 text-center selection:bg-brand-indigo-light selection:text-brand-indigo">
      <Card variant="subtle" className="p-8 sm:p-10 rounded-card max-w-md w-full shadow-xs border border-border space-y-5">
        <div className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl w-fit mx-auto border border-rose-100">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Something went wrong
          </h1>
          <p className="text-xs sm:text-sm text-body-muted leading-relaxed">
            An unexpected error occurred while loading this page. Please try again or return to your dashboard.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button onClick={() => reset()} variant="indigo" size="default" className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Try Again
          </Button>

          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="outline" size="default" className="w-full sm:w-auto">
              <LayoutDashboard className="h-4 w-4 mr-1.5" />
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
