import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getApplicantsUseCase, employerProfileRepo } from '@/lib/container';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ApplicantActionButtons } from './ApplicantActionButtons';
import type { ApplicationStatus } from '@/domain/entities/application';

export default async function ApplicantReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: listingId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/sign-in?callbackUrl=/employer/listings/${listingId}/applicants`);
  }

  if (session.user.role !== 'EMPLOYER') {
    redirect('/dashboard');
  }

  const employerProfile = await employerProfileRepo.findByUserId(session.user.id);
  if (!employerProfile) {
    redirect('/employer/onboarding');
  }

  let data;
  try {
    data = await getApplicantsUseCase.execute({
      listingId,
      employerProfileId: employerProfile.id,
    });
  } catch {
    notFound();
  }

  const { listingTitle, applicants } = data;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/employer/dashboard"
            className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            ← Back to Employer Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-2">
            Applicant Review
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Listing: <span className="font-semibold text-slate-900">{listingTitle}</span> ({applicants.length} Total Applicants)
          </p>
        </div>
      </div>

      {applicants.length === 0 ? (
        <Card className="rounded-lg border border-slate-200 shadow-sm bg-white p-12 text-center">
          <CardContent className="space-y-3 pt-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              👥
            </div>
            <CardTitle className="text-lg font-semibold text-slate-900">
              No applications yet for this listing
            </CardTitle>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              When verified students apply to this placement, their profiles and resume applications will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applicants.map((item) => {
            const app = item.application;
            const student = item.student;
            const appliedDate = new Date(app.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <Card key={app.id} className="rounded-lg border border-slate-200 shadow-sm bg-white p-5 space-y-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-lg text-slate-900">
                        {student.university}
                      </span>
                      <VerificationBadge status={student.verificationStatus} />
                      <StatusBadge status={app.status as ApplicationStatus} />
                    </div>

                    <div className="text-sm text-slate-600 space-x-2">
                      <span className="font-medium text-slate-900">Discipline: {student.discipline}</span>
                      <span>•</span>
                      <span>Applied {appliedDate}</span>
                    </div>

                    {/* Profile completeness bar */}
                    <div className="flex items-center gap-3 pt-1">
                      <span className="text-xs text-slate-500">Profile Completeness:</span>
                      <div className="w-32">
                        <Progress value={student.profileCompleteness} className="h-2" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">
                        {student.profileCompleteness}%
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {student.resumeUrl && (
                      <a
                        href={student.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-[4px] transition-colors"
                      >
                        📄 Resume PDF ↗
                      </a>
                    )}
                  </div>
                </div>

                {/* Cover Note Preview */}
                {app.note && (
                  <div className="rounded-md bg-slate-50 border border-slate-200 p-3 text-xs text-slate-700 space-y-1">
                    <span className="font-semibold text-slate-900 block uppercase tracking-wider text-[10px]">
                      Cover Note:
                    </span>
                    <p className="italic">{app.note}</p>
                  </div>
                )}

                {/* Status action buttons */}
                <div className="border-t border-slate-100 pt-3 flex flex-wrap items-center justify-between gap-3">
                  <Link
                    href={`/employer/listings/${listingId}/applicants/${app.id}`}
                    className="text-xs font-medium text-blue-600 hover:underline"
                  >
                    View Application Detail & Messaging →
                  </Link>

                  <ApplicantActionButtons
                    applicationId={app.id}
                    listingId={listingId}
                    currentStatus={app.status as ApplicationStatus}
                  />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
