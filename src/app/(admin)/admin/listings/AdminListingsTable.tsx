'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Flag, RotateCcw, Building2, MapPin, Calendar, ShieldAlert } from 'lucide-react';
import { flagListing, restoreListing } from './actions';
import type { ListingWithEmployer } from '@/domain/ports/IListingRepository';

interface AdminListingsTableProps {
  initialListings: ListingWithEmployer[];
}

export function AdminListingsTable({ initialListings }: AdminListingsTableProps) {
  const [tab, setTab] = React.useState<'all' | 'active' | 'flagged'>('all');
  const [isSubmitting, setIsSubmitting] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const filteredListings = React.useMemo(() => {
    if (tab === 'active') return initialListings.filter((l) => !l.isModerated);
    if (tab === 'flagged') return initialListings.filter((l) => l.isModerated);
    return initialListings;
  }, [initialListings, tab]);

  const handleFlag = async (id: string) => {
    setIsSubmitting(id);
    setErrorMsg(null);
    try {
      await flagListing(id);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to flag listing');
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleRestore = async (id: string) => {
    setIsSubmitting(id);
    setErrorMsg(null);
    try {
      await restoreListing(id);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to restore listing');
    } finally {
      setIsSubmitting(null);
    }
  };

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-700 text-sm border border-red-200 rounded-[4px]">
          {errorMsg}
        </div>
      )}

      <Tabs value={tab} onValueChange={(val) => setTab(val as 'all' | 'active' | 'flagged')}>
        <TabsList className="bg-slate-100/80 p-1 rounded-xl">
          <TabsTrigger value="all" className="text-xs rounded-lg font-bold">
            All Listings ({initialListings.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="text-xs rounded-lg font-bold">
            Active ({initialListings.filter((l) => !l.isModerated).length})
          </TabsTrigger>
          <TabsTrigger value="flagged" className="text-xs rounded-lg font-bold">
            Flagged ({initialListings.filter((l) => l.isModerated).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-3.5">
          {filteredListings.length === 0 ? (
            <div className="p-10 text-center bg-white border border-dashed border-slate-200 rounded-2xl shadow-2xs">
              <ShieldAlert className="h-7 w-7 text-slate-400 mx-auto mb-2" />
              <h3 className="font-bold text-sm text-slate-900">No listings found</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                There are no listings matching the selected filter tab.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/70 border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    <tr>
                      <th className="py-3.5 px-4">Title & Employer</th>
                      <th className="py-3.5 px-4">Disciplines</th>
                      <th className="py-3.5 px-4">Location</th>
                      <th className="py-3.5 px-4">Posted Date</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Moderation</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-app-border">
                    {filteredListings.map((listing) => (
                      <tr
                        key={listing.id}
                        className={listing.isModerated ? 'bg-rose-50/40 hover:bg-rose-50/70' : 'hover:bg-slate-50/80'}
                      >
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="font-bold text-slate-900 truncate">{listing.title}</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <Building2 className="h-3 w-3 shrink-0" />
                            <span className="truncate">{listing.companyName}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {listing.disciplines.map((d) => (
                              <Badge key={d} variant="outline" className="text-[10px] bg-slate-50">
                                {d}
                              </Badge>
                            ))}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            <span>
                              {listing.location} {listing.isRemote ? '(Remote)' : ''}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <Badge
                            className={
                              listing.status === 'OPEN'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }
                          >
                            {listing.status}
                          </Badge>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {listing.isModerated ? (
                            <Badge className="bg-rose-100 text-rose-800 border-rose-200 font-semibold">
                              Flagged
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-slate-600 border-slate-200">
                              Active
                            </Badge>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          {listing.isModerated ? (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-emerald-700 border-emerald-200 hover:bg-emerald-50 h-7.5 rounded-full px-3 text-[11px] font-bold"
                                  disabled={isSubmitting === listing.id}
                                >
                                  <RotateCcw className="h-3 w-3 mr-1" />
                                  Restore
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="rounded-2xl">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="font-serif text-lg font-normal">Restore Listing</AlertDialogTitle>
                                  <AlertDialogDescription className="text-xs text-slate-600 leading-relaxed">
                                    Are you sure you want to restore &quot;{listing.title}&quot;? It will become visible again in public student search results.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="rounded-full text-xs font-bold">Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleRestore(listing.id)}
                                    className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4"
                                  >
                                    Restore Listing
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-rose-600 border-rose-200 hover:bg-rose-50 h-7.5 rounded-full px-3 text-[11px] font-bold"
                                  disabled={isSubmitting === listing.id}
                                >
                                  <Flag className="h-3 w-3 mr-1" />
                                  Flag
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="rounded-2xl">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="font-serif text-lg font-normal">Flag Listing</AlertDialogTitle>
                                  <AlertDialogDescription className="text-xs text-slate-600 leading-relaxed">
                                    Are you sure you want to flag &quot;{listing.title}&quot; for moderation? Flagged listings will be hidden from public student searches.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="rounded-full text-xs font-bold">Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleFlag(listing.id)}
                                    className="rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4"
                                  >
                                    Confirm Flag
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
