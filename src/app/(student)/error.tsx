'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, RefreshCw, LayoutDashboard } from 'lucide-react';

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
    <div className="py-16 flex flex-col items-center justify-center text-center px-4">
      <Card variant="subtle" className="max-w-md w-full p-8 rounded-card border border-border shadow-xs space-y-4">
        <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl w-fit mx-auto border border-rose-100">
          <AlertCircle className="h-7 w-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">Student Portal Error</h2>
          <p className="text-xs text-body-muted leading-relaxed">
            We encountered an issue loading student portal information. Please try refreshing.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button onClick={() => reset()} variant="indigo" size="sm" className="w-full sm:w-auto">
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Reload Page
          </Button>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <LayoutDashboard className="h-3.5 w-3.5 mr-1" />
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
