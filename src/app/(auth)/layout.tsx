import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background text-foreground py-10 px-4 sm:px-6 selection:bg-brand-indigo-light selection:text-brand-indigo">
      <div className="mb-6 text-center space-y-1">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-brand-indigo text-white font-serif text-lg flex items-center justify-center font-bold shadow-2xs">
            P
          </div>
          <span className="font-serif text-2xl font-normal tracking-tight text-foreground">
            Placely<span className="text-brand-indigo">.ng</span>
          </span>
        </Link>
        <p className="text-xs text-body-muted font-medium">
          Accredited SIWES Placement Marketplace
        </p>
      </div>
      <Card variant="default" className="w-full max-w-md p-6 sm:p-8 shadow-xs border border-border">
        {children}
      </Card>
    </div>
  );
}
