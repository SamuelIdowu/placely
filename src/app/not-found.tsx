import Link from 'next/link';
import { Compass, ArrowRight, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function NotFound() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center bg-background text-foreground px-6 py-12 text-center selection:bg-brand-indigo-light selection:text-brand-indigo">
      <Card variant="subtle" className="max-w-lg w-full p-8 sm:p-12 space-y-6 shadow-xs border border-border">
        {/* Badge & Icon */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-brand-indigo-light text-brand-indigo flex items-center justify-center border border-indigo-100 shadow-2xs">
            <Compass className="w-7 h-7 animate-pulse" />
          </div>
          <Badge
            variant="outline"
            className="bg-brand-indigo-light text-brand-indigo border-indigo-200 text-xs font-semibold px-3 py-1 uppercase tracking-wider font-display"
          >
            404 Error — Page Not Found
          </Badge>
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-3">
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-foreground leading-tight">
            Lost in Placement?
          </h1>
          <p className="text-sm sm:text-base text-body-muted leading-relaxed max-w-sm mx-auto">
            The page or SIWES placement listing you are looking for might have been moved, expired, or doesn&apos;t exist.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="indigo" size="lg" className="w-full sm:w-auto gap-2">
              <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
            </Button>
          </Link>

          <Link href="/listings" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
              Browse Listings <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </Card>
    </main>
  );
}
