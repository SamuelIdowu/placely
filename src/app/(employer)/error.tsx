'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, RefreshCw, Briefcase } from 'lucide-react';

export default function EmployerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Employer route error:', error);
  }, [error]);

  const handleReload = () => {
    try {
      reset();
    } catch {
      window.location.reload();
    }
  };

  return (
    <div className="py-16 flex flex-col items-center justify-center text-center px-4">
      <Card variant="subtle" className="max-w-md w-full p-8 rounded-card border border-border shadow-xs space-y-4">
        <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl w-fit mx-auto border border-rose-100">
          <AlertCircle className="h-7 w-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">Employer Portal Error</h2>
          <p className="text-xs text-body-muted leading-relaxed">
            An error occurred in the employer console. Please retry or return to your listings dashboard.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button onClick={handleReload} variant="indigo" size="sm" className="w-full sm:w-auto">
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Reload Page
          </Button>
          <Link href="/employer/dashboard" className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Briefcase className="h-3.5 w-3.5 mr-1" />
              Employer Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
