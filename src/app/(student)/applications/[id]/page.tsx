import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { applicationRepo, listingRepo, employerProfileRepo, studentProfileRepo, messageRepo } from '@/lib/container';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { OfferResponseButtons } from './OfferResponseButtons';
import { ApplicationMessagingSection } from './ApplicationMessagingSection';
import type { ApplicationStatus } from '@/domain/entities/application';

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/sign-in?callbackUrl=/applications/${id}`);
  }

  const application = await applicationRepo.findById(id);
  if (!application) {
    notFound();
  }

  const listing = await listingRepo.findById(application.listingId);
  if (!listing) {
    notFound();
  }

  const employer = await employerProfileRepo.findById(listing.employerProfileId);
  const student = await studentProfileRepo.findById(application.studentId);

  // Auth check: student owner or employer owner
  if (session.user.role === 'STUDENT') {
    const currentStudent = await studentProfileRepo.findByUserId(session.user.id);
    if (!currentStudent || currentStudent.id !== application.studentId) {
      redirect('/applications');
    }
  } else if (session.user.role === 'EMPLOYER') {
    const currentEmployer = await employerProfileRepo.findByUserId(session.user.id);
    if (!currentEmployer || currentEmployer.id !== listing.employerProfileId) {
      redirect('/employer/dashboard');
    }
  }

  // Fetch initial thread messages
  const initialMessagesDomain = await messageRepo.findByApplication(id);
  const initialMessages = initialMessagesDomain.map((m) => m.toObject());
  const initialIsLocked = ['ACCEPTED', 'DECLINED'].includes(application.status);

  const appliedDate = new Date(application.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const updatedDate = new Date(application.updatedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div>
        <Link
          href={session.user.role === 'EMPLOYER' ? `/employer/listings/${listing.id}/applicants/${application.id}` : '/applications'}
          className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          ← {session.user.role === 'EMPLOYER' ? 'Back to Applicant Detail' : 'Back to My Applications'}
        </Link>
      </div>

      <Card className="rounded-lg border border-slate-200 shadow-sm bg-white">
        <CardHeader className="border-b border-slate-100 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <StatusBadge status={application.status as ApplicationStatus} className="text-sm px-3 py-1" />
            {employer && <VerificationBadge status={employer.verificationStatus} />}
          </div>

          <CardTitle className="text-2xl font-bold text-slate-900 mt-3">
            {listing.title}
          </CardTitle>
          <CardDescription className="text-slate-600 text-base">
            {employer?.companyName ?? 'Employer'} • {listing.location} {listing.isRemote && '(Remote Option)'}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Action box for student if OFFERED */}
          {session.user.role === 'STUDENT' && application.status === 'OFFERED' && (
            <OfferResponseButtons applicationId={application.id} />
          )}

          {/* Timeline / Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-md border border-slate-200 bg-slate-50/50 p-4 text-sm">
            <div>
              <span className="text-xs text-slate-500 block">Date Applied</span>
              <span className="font-semibold text-slate-900">{appliedDate}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Last Status Update</span>
              <span className="font-semibold text-slate-900">{updatedDate}</span>
            </div>
          </div>

          {/* Cover Note Section */}
          {application.note && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Submitted Cover Note
              </h4>
              <div className="rounded-md border border-slate-200 p-4 text-sm text-slate-700 bg-white leading-relaxed whitespace-pre-wrap">
                {application.note}
              </div>
            </div>
          )}

          {/* Student details for employer view */}
          {session.user.role === 'EMPLOYER' && student && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Applicant Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-500 block">University</span>
                  <span className="font-semibold text-slate-900">{student.university}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Discipline</span>
                  <span className="font-semibold text-slate-900">{student.discipline}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Profile Completeness</span>
                  <span className="font-semibold text-slate-900">{student.profileCompleteness}%</span>
                </div>
                {student.resumeUrl && (
                  <div>
                    <span className="text-xs text-slate-500 block">Attached Resume</span>
                    <a
                      href={student.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      View Resume PDF ↗
                    </a>
                  </div>
                )}
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
