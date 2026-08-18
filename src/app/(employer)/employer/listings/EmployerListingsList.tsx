'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ListingProps } from '@/domain/entities/listing';
import { toggleListingStatusAction } from './actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { MoreVertical, Edit3, Power, Users, MapPin, Plus, Briefcase } from 'lucide-react';

interface EmployerListingItem {
  listing: ListingProps;
  applicantCount: number;
}

interface EmployerListingsListProps {
  initialItems: EmployerListingItem[];
}

export function EmployerListingsList({ initialItems }: EmployerListingsListProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  async function handleToggleStatus(listingId: string) {
    setLoadingId(listingId);
    await toggleListingStatusAction(listingId);
    setLoadingId(null);
    router.refresh();
  }

  if (initialItems.length === 0) {
    return (
      <EmptyState
        icon={Briefcase}
        title="You haven't posted any listings yet"
        description="Create your first SIWES internship listing to start connecting with verified engineering students across Nigeria."
        action={
          <Link href="/employer/listings/new">
            <Button variant="indigo" size="default" className="gap-2">
              <Plus className="w-4 h-4" />
              Post New Listing
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {initialItems.map(({ listing, applicantCount }) => {
        const isOpen = listing.status === 'OPEN';
        return (
          <Card
            key={listing.id}
            variant="interactive"
            className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-foreground hover:text-brand-indigo transition-colors">
                  <Link href={`/employer/listings/${listing.id}/edit`}>{listing.title}</Link>
                </h3>
                <Badge
                  variant={isOpen ? 'accepted' : 'draft'}
                  className="text-xs"
                >
                  {isOpen ? 'Open' : 'Closed'}
                </Badge>
                {listing.isModerated && (
                  <Badge variant="destructive" className="text-xs">
                    Moderated
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-body-muted">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  {listing.location} {listing.isRemote && '(Remote)'}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-muted-foreground" />
                  {applicantCount} {applicantCount === 1 ? 'Applicant' : 'Applicants'}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {listing.disciplines.map((disc) => (
                  <span
                    key={disc}
                    className="inline-flex items-center rounded-md bg-muted px-2.5 py-0.5 text-xs font-semibold text-foreground"
                  >
                    {disc}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <Link href={`/employer/listings/${listing.id}/edit`}>
                <Button variant="outline" size="sm" className="gap-1">
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 rounded-xl border border-border">
                  <DropdownMenuItem asChild>
                    <Link href={`/employer/listings/${listing.id}/edit`} className="cursor-pointer">
                      <Edit3 className="w-4 h-4 mr-2" /> Edit Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={loadingId === listing.id}
                    onClick={() => handleToggleStatus(listing.id)}
                    className="cursor-pointer"
                  >
                    <Power className="w-4 h-4 mr-2" />
                    {isOpen ? 'Close Listing' : 'Reopen Listing'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
