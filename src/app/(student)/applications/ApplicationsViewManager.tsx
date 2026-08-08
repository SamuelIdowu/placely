"use client";

import React, { useState } from 'react';
import { ListViewControls } from '@/components/shared/ListViewControls';
import { ApplicationStatus } from '@/domain/entities/application';
import Link from 'next/link';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MapPin, ArrowRight, Banknote, Sparkles, Building2 } from 'lucide-react';

export type ApplicationItem = {
  id: string;
  listingId: string;
  listingTitle: string;
  companyName: string;
  verificationStatus: string;
  location: string;
  isRemote: boolean;
  status: string;
  appliedDate: string;
};

function getCompanyColor(name: string): string {
  const colors = [
    '#4f46e5', '#1863dc', '#10b981', '#ff7759',
    '#8b5cf6', '#0891b2', '#d97706', '#059669',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
  return colors[Math.abs(hash) % colors.length];
}

export function ApplicationsViewManager({ items }: { items: ApplicationItem[] }) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter(
    (app) =>
      app.listingTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeApps = filteredItems.filter((a) => ['APPLIED', 'SHORTLISTED'].includes(a.status));
  const offerApps = filteredItems.filter((a) => a.status === 'OFFERED');
  const completedApps = filteredItems.filter((a) => ['ACCEPTED', 'DECLINED'].includes(a.status));

  return (
    <div className="w-full space-y-4.5">
      <ListViewControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewChange={setViewMode}
        placeholder="Search applications by role or company..."
      />

      <Tabs defaultValue="all" className="w-full space-y-4">
        <TabsList className="bg-slate-100 p-1 rounded-full w-full sm:max-w-md grid grid-cols-4 border border-slate-200">
          <TabsTrigger value="all" className="text-xs font-bold rounded-full py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-xs">
            All ({filteredItems.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="text-xs font-bold rounded-full py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-xs">
            Active ({activeApps.length})
          </TabsTrigger>
          <TabsTrigger value="offers" className="text-xs font-bold rounded-full py-1.5 data-[state=active]:bg-white data-[state=active]:text-amber-700 data-[state=active]:shadow-xs">
            Offers ({offerApps.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs font-bold rounded-full py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-xs">
            Done ({completedApps.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <ApplicationsList items={filteredItems} viewMode={viewMode} />
        </TabsContent>

        <TabsContent value="active" className="mt-0">
          <ApplicationsList items={activeApps} viewMode={viewMode} />
        </TabsContent>

        <TabsContent value="offers" className="mt-0">
          <ApplicationsList items={offerApps} viewMode={viewMode} />
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          <ApplicationsList items={completedApps} viewMode={viewMode} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ApplicationsList({
  items,
  viewMode,
}: {
  items: ApplicationItem[];
  viewMode: "grid" | "list";
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 py-10 bg-white text-center p-6 space-y-2.5">
        <Building2 className="w-9 h-9 text-slate-400 mx-auto" />
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900">No applications in this category</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don&apos;t have any active submissions matching this status. Explore open placements to submit an application.
          </p>
        </div>
        <Link
          href="/listings"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4f46e5] hover:text-[#4338ca] pt-1"
        >
          Browse Open Listings <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {items.map((app) => {
          const avatarColor = getCompanyColor(app.companyName);
          const initials = app.companyName ? app.companyName.charAt(0).toUpperCase() : '?';

          return (
            <Link key={app.id} href={`/applications/${app.id}`} className="block group h-full">
              <div className="bg-white rounded-2xl p-4.5 sm:p-5 border border-slate-200/90 group-hover:border-[#4f46e5] group-hover:bg-[#f8f7ff] transition-all hover:shadow-xs flex flex-col justify-between h-full shadow-2xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs"
                        style={{ background: avatarColor }}
                      >
                        {initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">{app.companyName}</span>
                          {app.verificationStatus === 'VERIFIED' && <VerificationBadge size="sm" />}
                        </div>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {app.location} {app.isRemote && '· Remote'}
                        </span>
                      </div>
                    </div>

                    <StatusBadge status={app.status as ApplicationStatus} />
                  </div>

                  <h3 className="text-sm font-bold text-[#212121] group-hover:text-[#4f46e5] transition-colors line-clamp-2">
                    {app.listingTitle}
                  </h3>
                </div>

                <div className="pt-3.5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Applied {app.appliedDate}</span>
                  <span className="font-bold text-[#4f46e5] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    View Details <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    );
  }

  // LIST MODE (DEFAULT)
  return (
    <div className="space-y-2.5">
      {items.map((app) => {
        const avatarColor = getCompanyColor(app.companyName);
        const initials = app.companyName ? app.companyName.charAt(0).toUpperCase() : '?';

        return (
          <Link key={app.id} href={`/applications/${app.id}`} className="block group">
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#e5e7eb] group-hover:border-[#4f46e5] group-hover:bg-[#f8f7ff] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs"
                  style={{ background: avatarColor }}
                >
                  {initials}
                </div>

                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#212121] group-hover:text-[#4f46e5] transition-colors truncate">
                      {app.listingTitle}
                    </h3>
                    {app.verificationStatus === 'VERIFIED' && <VerificationBadge size="sm" />}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#75758a]">
                    <span className="font-semibold text-slate-800">{app.companyName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {app.location} {app.isRemote && '(Remote)'}
                    </span>
                    <span>•</span>
                    <span>Applied {app.appliedDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                {app.status === 'OFFERED' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                    <Sparkles className="w-3 h-3" /> Offer Received
                  </span>
                )}
                <StatusBadge status={app.status as ApplicationStatus} />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
