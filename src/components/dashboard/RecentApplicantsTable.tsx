import React from 'react';
import Link from 'next/link';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { ApplicationStatus } from '@/domain/entities/application';
import { ArrowRight, Users } from 'lucide-react';
import { getCompanyAvatarColor } from '@/lib/tokens';

export interface ApplicantItemData {
  id: string;
  listingTitle: string;
  studentName: string;
  university: string;
  discipline: string;
  status: ApplicationStatus;
  appliedDate?: string;
}

interface RecentApplicantsTableProps {
  applicants: ApplicantItemData[];
  totalCount: number;
}

export function RecentApplicantsTable({
  applicants,
  totalCount,
}: RecentApplicantsTableProps) {
  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Recent Applicants
        </h2>
        <Link
          href="/employer/listings"
          className="text-xs font-semibold text-brand-indigo hover:text-brand-indigo-hover transition-colors"
        >
          View All ({totalCount})
        </Link>
      </div>

      {applicants.length === 0 ? (
        <div className="p-8 text-center rounded-[20px] bg-card border border-dashed border-border">
          <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium text-muted-foreground">
            No applicants have applied yet.
          </p>
          <Link
            href="/employer/listings/new"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-brand-indigo hover:text-brand-indigo-hover"
          >
            Post a SIWES Opening <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          {applicants.map((item) => {
            const initials = item.studentName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);
            const avatarColor = getCompanyAvatarColor(item.studentName);

            return (
              <div
                key={item.id}
                className="bg-card rounded-xl p-4 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all border border-border hover:border-brand-indigo hover:bg-brand-indigo-light/30 shadow-2xs"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs"
                    style={{ background: avatarColor }}
                  >
                    {initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">
                        {item.studentName}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>{item.university}</span>
                      <span>·</span>
                      <span>{item.discipline}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground mt-0.5 block">
                      Applied to: {item.listingTitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3.5 border-t sm:border-t-0 pt-2.5 sm:pt-0 border-border">
                  <span className="text-[11px] text-muted-foreground">
                    {item.appliedDate ?? 'Recently'}
                  </span>
                  <StatusBadge status={item.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
