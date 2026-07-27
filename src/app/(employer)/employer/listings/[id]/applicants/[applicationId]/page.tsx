import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { applicationRepo, listingRepo, employerProfileRepo, studentProfileRepo, messageRepo } from '@/lib/container';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ApplicantActionButtons } from '../ApplicantActionButtons';
import { ApplicationMessagingSection } from '@/app/(student)/applications/[id]/ApplicationMessagingSection';
import type { ApplicationStatus } from '@/domain/entities/application';

export default async function EmployerApplicantDetailPage({
  params,
}: {
  params: Promise<{ id: string; applicationId: string }>;
}) {
  const { id: listingId, applicationId } = await params;
  const session = await auth();

  if (!session?.user?.id || session.user.role !== 'EMPLOYER') {
    redirect(`/sign-in?callbackUrl=/employer/listings/${listingId}/applicants/${applicationId}`);
  }

  const employerProfile = await employerProfileRepo.findByUserId(session.user.id);
  if (!employerProfile) {
    redirect('/employer/dashboard');
  }

  const listing = await listingRepo.findById(listingId);
  if (!listing || listing.employerProfileId !== employerProfile.id) {
    notFound();
  }

  const application = await applicationRepo.findById(applicationId);
  if (!application || application.listingId !== listingId) {
    notFound();
  }

  const student = await studentProfileRepo.findById(application.studentId);
  if (!student) {
    notFound();
  }

  const initialMessagesDomain = await messageRepo.findByApplication(applicationId);
  const initialMessages = initialMessagesDomain.map((m) => m.toObject());
  const initialIsLocked = ['ACCEPTED', 'DECLINED'].includes(application.status);

  const appliedDate = new Date(application.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div>
        <Link
          href={`/employer/listings/${listingId}/applicants`}
          className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          ← Back to Applicants List
        </Link>
      </div>

      <Card className="rounded-lg border border-slate-200 shadow-sm bg-white">
        <CardHeader className="border-b border-slate-100 pb-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <StatusBadge status={application.status as ApplicationStatus} className="text-sm px-3 py-1" />
              <VerificationBadge status={student.verificationStatus} />
            </div>

            {/* Action buttons (Shortlist / Offer / Decline) */}
            <ApplicantActionButtons
              applicationId={application.id}
              listingId={listingId}
              currentStatus={application.status as ApplicationStatus}
            />
          </div>

          <div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              {student.university} Applicant
            </CardTitle>
            <CardDescription className="text-slate-600 text-base mt-1">
              Applied for <strong className="text-slate-900">{listing.title}</strong> on {appliedDate}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Applicant Metadata Grid */}
          <div className="rounded-md border border-slate-200 bg-slate-50/50 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Candidate Profile Summary
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-xs text-slate-500 block">University</span>
                <span className="font-semibold text-slate-900">{student.university}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Discipline</span>
                <span className="font-semibold text-slate-900">{student.discipline}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Profile Score</span>
                <span className="font-semibold text-slate-900">{student.profileCompleteness}%</span>
              </div>
              {student.resumeUrl ? (
                <div>
                  <span className="text-xs text-slate-500 block">Resume File</span>
                  <a
                    href={student.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    View Resume PDF ↗
                  </a>
                </div>
              ) : (
                <div>
                  <span className="text-xs text-slate-500 block">Resume File</span>
                  <span className="text-slate-400">None uploaded</span>
                </div>
              )}
            </div>
          </div>

          {/* Cover Note */}
          {application.note && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Candidate Cover Note
              </h4>
              <div className="rounded-md border border-slate-200 p-4 text-sm text-slate-700 bg-white leading-relaxed whitespace-pre-wrap">
                {application.note}
              </div>
            </div>
          )}

          {/* Messaging Section */}
          <ApplicationMessagingSection
            applicationId={application.id}
            currentUserId={session.user.id}
            initialMessages={initialMessages}
            initialIsLocked={initialIsLocked}
          />
        </CardContent>
      </Card>
    </div>
  );
}
