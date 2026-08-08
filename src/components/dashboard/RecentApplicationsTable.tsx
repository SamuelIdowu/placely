import React from "react";
import Link from "next/link";
import { VerificationBadge } from "@/components/shared/VerificationBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { ApplicationStatus } from "@/domain/entities/application";
import { ArrowRight, Building2, Calendar, Banknote } from "lucide-react";
import { getCompanyAvatarColor } from "@/lib/tokens";

export interface ApplicationItemData {
  id: string;
  listingId: string;
  title: string;
  companyName: string;
  companyVerified: boolean;
  location: string;
  status: ApplicationStatus;
  appliedDate?: string;
  stipendText?: string;
}

export interface RecentApplicationsTableProps {
  applications: ApplicationItemData[];
  totalCount: number;
}

export function RecentApplicationsTable({
  applications,
  totalCount,
}: RecentApplicationsTableProps) {
  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Recent SIWES Submissions
        </h2>
        <Link
          href="/applications"
          className="text-xs font-semibold text-brand-indigo hover:text-brand-indigo-hover transition-colors"
        >
          View All ({totalCount})
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="p-8 text-center rounded-[20px] bg-card border border-dashed border-border">
          <Building2 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium text-muted-foreground">
            You haven&apos;t applied for any SIWES placements yet.
          </p>
          <Link
            href="/listings"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-brand-indigo hover:text-brand-indigo-hover"
          >
            Browse Open Opportunities <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          {applications.map((item) => {
            const initials = item.companyName?.[0]?.toUpperCase() ?? "?";
            const avatarColor = getCompanyAvatarColor(item.companyName ?? "");

            return (
              <Link key={item.id} href={`/applications/${item.id}`} className="block group">
                <div className="bg-card rounded-xl p-4 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all border border-border group-hover:border-brand-indigo group-hover:bg-brand-indigo-light/30 shadow-2xs">
                  <div className="flex items-center gap-3.5">
                    {/* Avatar */}
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs"
                      style={{ background: avatarColor }}
                    >
                      {initials}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground group-hover:text-brand-indigo transition-colors">
                          {item.title}
                        </span>
                        {item.companyVerified && <VerificationBadge size="sm" />}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span>{item.companyName}</span>
                        <span>·</span>
                        <span>{item.location}</span>
                        {item.stipendText && (
                          <>
                            <span>·</span>
                            <span className="font-semibold text-stat-emerald">{item.stipendText}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3.5 border-t sm:border-t-0 pt-2.5 sm:pt-0 border-border">
                    <span className="text-[11px] text-muted-foreground">
                      Applied {item.appliedDate ?? "Recently"}
                    </span>
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
