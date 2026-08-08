import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getApplicantsUseCase, employerProfileRepo } from '@/lib/container';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { ApplicantActionButtons } from './ApplicantActionButtons';
import type { ApplicationStatus } from '@/domain/entities/application';
import {
  GraduationCap,
  FileText,
  Clock,
  ArrowLeft,
  ArrowRight,
  MessageSquare,
  Users,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

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
    <div className="container mx-auto max-w-5xl space-y-5 pb-8">
      {/* ── Header Deck ── */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-2.5">
        <Link
          href="/employer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Employer Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#93939f]">
              Placement Applicant Pipeline
            </span>
            <h1 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-slate-900">
              {listingTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#75758a]">
              Review verified engineering students, check coursework portfolios, and extend 6-month placement offers.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 px-3.5 py-2.5 rounded-xl shrink-0 text-right">
            <span className="text-xl font-black text-[#4f46e5] block leading-none">
              {applicants.length}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Total Candidates
            </span>
          </div>
        </div>
      </div>

      {/* ── Applicant Cards ── */}
      {applicants.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 py-10 px-6 text-center space-y-2.5">
          <Users className="w-9 h-9 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">
              No applications received yet for this listing
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When verified engineering students apply to this opening, their academic records, CGPA, and resume PDFs will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3.5">
          {applicants.map((item) => {
            const app = item.application;
            const student = item.student;
            const appliedDate = new Date(app.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all space-y-3.5"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-serif text-lg sm:text-xl font-normal text-slate-900">
                        {student.university}
                      </span>
                      <VerificationBadge status={student.verificationStatus} size="sm" />
                      <StatusBadge status={app.status as ApplicationStatus} />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#75758a] font-medium">
                      <span className="text-slate-900 font-bold">
                        Discipline: {student.discipline}
                      </span>
                      <span>•</span>
                      <span>Applied {appliedDate}</span>
                      <span>•</span>
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                        Profile: {student.profileCompleteness}% Complete
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {student.resumeUrl && (
                      <a
                        href={student.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#4f46e5]" /> View Resume PDF ↗
                      </a>
                    )}
                  </div>
                </div>

                {/* Cover Note Section */}
                {app.note && (
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-xs text-slate-700 space-y-1">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-[#93939f] block">
                      Applicant Cover Statement:
                    </span>
                    <p className="leading-relaxed font-normal italic text-slate-800">
                      &quot;{app.note}&quot;
                    </p>
                  </div>
                )}

                {/* Bottom Action Strip */}
                <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <Link
                    href={`/employer/listings/${listingId}/applicants/${app.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4f46e5] hover:text-[#4338ca] transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Open Direct Placement Thread →
                  </Link>

                  <ApplicantActionButtons
                    applicationId={app.id}
                    listingId={listingId}
                    currentStatus={app.status as ApplicationStatus}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
