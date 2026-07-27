import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { listingRepo, studentProfileRepo, employerProfileRepo, applicationRepo } from '@/lib/container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { ApplyForm } from './ApplyForm';

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
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href={`/listings/${listingId}`}
          className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          ← Back to Listing Details
        </Link>
      </div>

      <Card className="rounded-lg border border-slate-200 shadow-sm bg-white">
        <CardHeader className="border-b border-slate-100 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              SIWES Placement Application
            </span>
            {employer && (
              <VerificationBadge status={employer.verificationStatus} />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900 mt-2">
            {listing.title}
          </CardTitle>
          <CardDescription className="text-slate-600 text-base">
            {employer?.companyName ?? 'Verified Employer'} • {listing.location} {listing.isRemote && '(Remote Option)'}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Profile Summary Card */}
          <div className="rounded-md border border-slate-200 bg-slate-50/50 p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Attached Profile Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500 block text-xs">University</span>
                <span className="font-semibold text-slate-900">{studentProfile.university}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Discipline</span>
                <span className="font-semibold text-slate-900">{studentProfile.discipline}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Verification Status</span>
                <span className="font-semibold text-slate-900 capitalize">{studentProfile.verificationStatus.toLowerCase()}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Profile Completeness</span>
                <span className="font-semibold text-slate-900">{studentProfile.profileCompleteness}%</span>
              </div>
            </div>
          </div>

          {/* Form / Alert Render */}
          {alreadyApplied ? (
            <div className="rounded-md bg-blue-50 border border-blue-200 p-4 text-blue-800 space-y-2">
              <p className="font-semibold">You have already applied to this listing.</p>
              <p className="text-sm">
                Your application has been received by {employer?.companyName ?? 'the employer'} and is currently under review.
              </p>
              <div className="pt-2">
                <Link
                  href="/applications"
                  className="inline-flex items-center text-sm font-bold text-blue-700 hover:text-blue-900 underline"
                >
                  View My Applications →
                </Link>
              </div>
            </div>
          ) : studentProfile.verificationStatus !== 'VERIFIED' ? (
            <div className="rounded-md bg-amber-50 border border-amber-200 p-4 text-amber-900 space-y-2">
              <p className="font-semibold">Verification Required</p>
              <p className="text-sm">
                Your student profile is currently pending verification. SIWES listings require verified student identity before submitting applications.
              </p>
              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center text-sm font-bold text-amber-800 hover:text-amber-950 underline"
                >
                  Go to Dashboard →
                </Link>
              </div>
            </div>
          ) : studentProfile.profileCompleteness < 50 ? (
            <div className="rounded-md bg-amber-50 border border-amber-200 p-4 text-amber-900 space-y-2">
              <p className="font-semibold">Incomplete Profile</p>
              <p className="text-sm">
                Your profile completeness is {studentProfile.profileCompleteness}%. Please complete at least 50% of your profile metrics to apply.
              </p>
            </div>
          ) : (
            <ApplyForm listingId={listingId} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
