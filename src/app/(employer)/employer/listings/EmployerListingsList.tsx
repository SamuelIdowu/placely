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
      <Card className="rounded-lg shadow-sm border border-slate-200 py-12">
        <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-slate-900">You haven&apos;t posted any listings yet</h3>
            <p className="text-sm text-slate-500 max-w-sm">
              Create your first SIWES internship listing to start connecting with verified engineering students.
            </p>
          </div>
          <Link
            href="/employer/listings/new"
            className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium rounded-[4px] bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Post New Listing
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {initialItems.map(({ listing, applicantCount }) => {
        const isOpen = listing.status === 'OPEN';
        return (
          <Card
            key={listing.id}
            className="rounded-lg shadow-sm border border-slate-200 hover:border-slate-300 transition-colors"
          >
            <CardContent className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-slate-900 hover:text-slate-700">
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

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {listing.location} {listing.isRemote && '(Remote)'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {applicantCount} {applicantCount === 1 ? 'Applicant' : 'Applicants'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {listing.disciplines.map((disc) => (
                    <span
                      key={disc}
                      className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700"
                    >
                      {disc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <Link
                  href={`/employer/listings/${listing.id}/edit`}
                  className="inline-flex items-center justify-center h-8 px-3 text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-[4px] transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-[4px]">
                      <MoreVertical className="w-4 h-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
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
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
