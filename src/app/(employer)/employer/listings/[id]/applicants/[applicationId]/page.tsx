import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getThreadUseCase, applicationRepo, listingRepo, employerProfileRepo, studentProfileRepo } from '@/lib/container';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ApplicantActionButtons } from '../ApplicantActionButtons';
import { ApplicationMessagingSection } from '@/app/(student)/applications/[id]/ApplicationMessagingSection';
import type { ApplicationStatus } from '@/domain/entities/application';
import type { MessageProps } from '@/domain/entities/message';

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

  const listing = await listingRepo.findDetailsById(listingId);
  if (!listing) {
    notFound();
  }

  const employerProfile = await employerProfileRepo.findByUserId(session.user.id);
  if (!employerProfile || listing.employerProfileId !== employerProfile.id) {
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

  let initialMessages: MessageProps[] = [];
  let initialIsLocked = ['ACCEPTED', 'DECLINED'].includes(application.status);

  try {
    const threadResult = await getThreadUseCase.execute({
      applicationId: application.id,
      userId: session.user.id,
    });
    initialMessages = threadResult.messages.map((m) => m.toObject());
    if (typeof threadResult.isLocked === 'boolean') {
      initialIsLocked = threadResult.isLocked;
    }
  } catch (err) {
    console.error('Error prefetching messages on server:', err);
  }

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
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Applicants List
        </Link>
      </div>

      <Card className="rounded-lg shadow-sm border border-border bg-card">
        <CardHeader className="border-b border-border pb-6 space-y-4">
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
            <CardTitle className="text-2xl font-bold text-foreground">
              {student.university} Applicant
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base mt-1">
              Applied for <strong className="text-foreground">{listing.title}</strong> on {appliedDate}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Applicant Metadata Grid */}
          <div className="rounded-lg border border-border bg-secondary/50 p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Candidate Profile Summary
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 text-sm">
              <div>
                <span className="text-xs text-muted-foreground block uppercase tracking-wider font-semibold mb-1">University</span>
                <span className="font-medium text-foreground">{student.university}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block uppercase tracking-wider font-semibold mb-1">Discipline</span>
                <span className="font-medium text-foreground">{student.discipline}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block uppercase tracking-wider font-semibold mb-1">Profile Score</span>
                <span className="font-medium text-foreground">{student.profileCompleteness}%</span>
              </div>
              {student.resumeUrl ? (
                <div>
                  <span className="text-xs text-muted-foreground block uppercase tracking-wider font-semibold mb-1">Resume File</span>
                  <a
                    href={student.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-semibold"
                  >
                    View Resume PDF ↗
                  </a>
                </div>
              ) : (
                <div>
                  <span className="text-xs text-muted-foreground block uppercase tracking-wider font-semibold mb-1">Resume File</span>
                  <span className="text-muted-foreground font-medium">None uploaded</span>
                </div>
              )}
            </div>
          </div>

          {/* Cover Note */}
          {application.note && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Candidate Cover Note
              </h4>
              <div className="rounded-lg border border-border p-5 text-sm text-foreground bg-secondary/30 leading-relaxed whitespace-pre-wrap">
                {application.note}
              </div>
            </div>
          )}

          {/* Messaging Section */}
          <div className="pt-6 border-t border-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Messages
            </h4>
            <ApplicationMessagingSection
              applicationId={application.id}
              currentUserId={session.user.id}
              initialMessages={initialMessages}
              initialIsLocked={initialIsLocked}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
