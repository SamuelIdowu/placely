import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { employerProfileRepo, listingRepo, getApplicantsUseCase } from '@/lib/container';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { ApplicationStatus } from '@/domain/entities/application';

export const metadata: Metadata = {
  title: 'All Applicants — Placely',
  description: 'Review all student applicants across your SIWES placement listings.',
};

export default async function EmployerApplicationsPage() {
  const session = await auth();
  if (!session || session.user.role !== 'EMPLOYER') redirect('/sign-in');

  const employerProfile = await employerProfileRepo.findByUserId(session.user.id);
  if (!employerProfile) redirect('/employer/onboarding');

  const listings = await listingRepo.findByEmployerProfileId(employerProfile.id);

  const allApplicants: {
    id: string;
    listingId: string;
    listingTitle: string;
    studentName: string;
    university: string;
    discipline: string;
    status: ApplicationStatus;
    appliedDate: string;
  }[] = [];

  for (const listing of listings) {
    let applicants: { application: { id: string; status: ApplicationStatus; createdAt: Date }; student: { university: string; discipline: string; user: { firstName?: string | null; lastName?: string | null; email: string } } }[] = [];
    try {
      const result = await getApplicantsUseCase.execute({
        listingId: listing.id,
        employerProfileId: employerProfile.id,
      });
      applicants = result.applicants;
    } catch {
      applicants = [];
    }

    for (const item of applicants) {
      const name = [item.student.user.firstName, item.student.user.lastName].filter(Boolean).join(' ') || item.student.user.email.split('@')[0];
      allApplicants.push({
        id: item.application.id,
        listingId: listing.id,
        listingTitle: listing.title,
        studentName: name,
        university: item.student.university,
        discipline: item.student.discipline,
        status: item.application.status,
        appliedDate: new Date(item.application.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      });
    }
  }

  const sorted = allApplicants.sort(
    (a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">All Applicants</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {allApplicants.length} total applicant{allApplicants.length !== 1 ? 's' : ''} across all listings
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-card border border-dashed border-slate-200 py-12 px-6 bg-white text-center space-y-3">
          <Users className="w-10 h-10 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">No applicants yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When students apply to your listings, they will appear here for review.
            </p>
          </div>
          <Link
            href="/employer/listings/new"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-bold transition-all shadow-xs"
          >
            Post a Listing <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          {sorted.map((app) => (
            <Link
              key={app.id}
              href={`/employer/listings/${app.listingId}/applicants/${app.id}`}
              className="block group"
            >
              <div className="bg-white rounded-card p-4 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-border group-hover:border-brand-indigo group-hover:bg-brand-indigo-light/30 transition-all shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground group-hover:text-brand-indigo transition-colors">
                      {app.studentName}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>{app.university}</span>
                    <span>·</span>
                    <span>{app.discipline}</span>
                    <span>·</span>
                    <span>Applied to: {app.listingTitle}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 border-t sm:border-t-0 pt-2.5 sm:pt-0 border-border">
                  <span className="text-[11px] text-muted-foreground">{app.appliedDate}</span>
                  <StatusBadge status={app.status} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
