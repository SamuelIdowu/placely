import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { listingRepo, studentProfileRepo, employerProfileRepo, applicationRepo } from '@/lib/container';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { ApplyForm } from './ApplyForm';
import { ArrowLeft, Building2, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

export default async function SubmitApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: listingId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/sign-in?callbackUrl=/listings/${listingId}/apply`);
  }

  if (session.user.role !== 'STUDENT') {
    redirect('/dashboard');
  }

  const listing = await listingRepo.findById(listingId);
  if (!listing) {
    notFound();
  }

  const employer = await employerProfileRepo.findById(listing.employerProfileId);
  const studentProfile = await studentProfileRepo.findByUserId(session.user.id);

  if (!studentProfile) {
    redirect('/student/onboarding');
  }

  const alreadyApplied = await applicationRepo.existsByListingAndStudent(listingId, studentProfile.id);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-6 pb-14">
      <Link
        href={`/listings/${listingId}`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#4f46e5] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Placement Details
      </Link>

      <div className="bg-white rounded-[24px] border border-[#e5e7eb] shadow-2xs overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#93939f]">
              SIWES Placement Application
            </span>
            {employer && (
              <VerificationBadge status={employer.verificationStatus} />
            )}
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-slate-900">
            {listing.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            {employer?.companyName ?? 'Verified Corporate Employer'} · {listing.location} {listing.isRemote && '(Remote Option)'}
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Profile Summary Card */}
          <div className="rounded-[18px] border border-slate-200/80 bg-slate-50/80 p-5 space-y-3.5">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#4f46e5]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Verified Student Profile Attached
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">University</span>
                <span className="font-semibold text-slate-900 truncate block">{studentProfile.university}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Discipline</span>
                <span className="font-semibold text-slate-900 truncate block">{studentProfile.discipline}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Verification</span>
                <span className="font-semibold text-emerald-700 capitalize">{studentProfile.verificationStatus.toLowerCase()}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Completeness</span>
                <span className="font-semibold text-slate-900">{studentProfile.profileCompleteness}%</span>
              </div>
            </div>
          </div>

          {/* Conditional state rendering */}
          {alreadyApplied ? (
            <div className="rounded-[18px] bg-indigo-50/70 border border-indigo-200 p-5 text-indigo-950 space-y-2">
              <p className="text-sm font-bold">You have already applied to this listing.</p>
              <p className="text-xs text-indigo-800">
                Your application has been received by {employer?.companyName ?? 'the employer'} and is currently being evaluated.
              </p>
              <div className="pt-2">
                <Link
                  href="/applications"
                  className="inline-flex items-center text-xs font-bold text-[#4f46e5] hover:text-[#4338ca]"
                >
                  Track in My Applications →
                </Link>
              </div>
            </div>
          ) : studentProfile.verificationStatus !== 'VERIFIED' ? (
            <div className="rounded-[18px] bg-amber-50 border border-amber-200 p-5 text-amber-900 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <p className="font-bold">Student Verification Required</p>
              </div>
              <p className="text-amber-800">
                SIWES listings require a verified university school ID before submitting direct applications.
              </p>
              <div className="pt-2">
                <Link
                  href="/profile/settings"
                  className="inline-flex items-center text-xs font-bold text-amber-900 hover:underline"
                >
                  Upload University School ID →
                </Link>
              </div>
            </div>
          ) : studentProfile.profileCompleteness < 50 ? (
            <div className="rounded-[18px] bg-amber-50 border border-amber-200 p-5 text-amber-900 space-y-2 text-xs">
              <p className="font-bold">Profile 50% Threshold Required</p>
              <p className="text-amber-800">
                Your profile completeness is {studentProfile.profileCompleteness}%. Please complete at least 50% of your academic profile to submit applications.
              </p>
              <div className="pt-2">
                <Link
                  href="/profile"
                  className="inline-flex items-center text-xs font-bold text-amber-900 hover:underline"
                >
                  Update Profile Now →
                </Link>
              </div>
            </div>
          ) : (
            <ApplyForm listingId={listingId} />
          )}
        </div>
      </div>
    </div>
  );
}
