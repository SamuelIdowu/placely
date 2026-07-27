// app/(student)/dashboard/page.tsx
// Protected: STUDENT role only

import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { studentProfileRepo, getMyApplicationsUseCase } from '@/lib/container';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import type { ApplicationStatus } from '@/domain/entities/application';

export const metadata: Metadata = {
  title: 'Student Dashboard — Placely',
};

export default async function StudentDashboardPage() {
  const session = await auth();
  if (!session || session.user.role !== 'STUDENT') redirect('/sign-in');

  const studentProfile = await studentProfileRepo.findByUserId(session.user.id);
  if (!studentProfile) redirect('/student/onboarding');

  const rawApplications = await getMyApplicationsUseCase.execute(studentProfile.id);

  const totalApps = rawApplications.length;
  const shortlistedApps = rawApplications.filter((a) => a.application.status === 'SHORTLISTED');
  const offeredApps = rawApplications.filter((a) => a.application.status === 'OFFERED');
  const acceptedApps = rawApplications.filter((a) => a.application.status === 'ACCEPTED');

  const recentApps = rawApplications.slice(0, 3);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Student Overview
            </h1>
            {studentProfile.isVerified && <VerificationBadge size="sm" showLabel />}
          </div>
          <p className="text-slate-500 text-sm mt-1">
            {studentProfile.university} • {studentProfile.discipline}
          </p>
        </div>
        <Link
          href="/listings"
          className="inline-flex items-center justify-center rounded-[4px] bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
        >
          Explore Open Placements →
        </Link>
      </div>

      {/* Verification Status Banner if pending or rejected */}
      {!studentProfile.isVerified && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-semibold">
              <span>⚠️ Account Verification Status: {studentProfile.verificationStatus}</span>
            </div>
            <p className="text-xs text-amber-800">
              Submit your school ID or official student documentation to get verified and start applying for placements.
            </p>
          </div>
          <Link
            href="/student/verification"
            className="inline-flex text-xs font-bold text-amber-900 underline hover:text-amber-950 whitespace-nowrap"
          >
            Upload Verification Docs →
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-lg border border-slate-200 shadow-sm bg-white p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Submitted
          </span>
          <div className="text-3xl font-bold text-slate-900 mt-2">{totalApps}</div>
          <span className="text-xs text-slate-400 mt-1 block">Applications</span>
        </Card>

        <Card className="rounded-lg border border-slate-200 shadow-sm bg-white p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Shortlisted
          </span>
          <div className="text-3xl font-bold text-blue-600 mt-2">{shortlistedApps.length}</div>
          <span className="text-xs text-slate-400 mt-1 block">Interview Stage</span>
        </Card>

        <Card className="rounded-lg border border-slate-200 shadow-sm bg-white p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-600">
            Offers Received
          </span>
          <div className="text-3xl font-bold text-purple-600 mt-2">{offeredApps.length}</div>
          <span className="text-xs text-slate-400 mt-1 block">Awaiting Decision</span>
        </Card>

        <Card className="rounded-lg border border-slate-200 shadow-sm bg-white p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Accepted
          </span>
          <div className="text-3xl font-bold text-emerald-600 mt-2">{acceptedApps.length}</div>
          <span className="text-xs text-slate-400 mt-1 block">Confirmed SIWES</span>
        </Card>
      </div>

      {/* Profile Completeness Card */}
      <Card className="rounded-lg border border-slate-200 shadow-sm bg-white p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900">Profile Completeness</h3>
            <p className="text-xs text-slate-500">
              Complete at least 50% of your academic profile and upload a resume to submit applications.
            </p>
          </div>
          <span className="text-lg font-extrabold text-slate-900">
            {studentProfile.profileCompleteness}%
          </span>
        </div>
        <Progress value={studentProfile.profileCompleteness} className="h-3" />
        {studentProfile.profileCompleteness < 50 && (
          <p className="text-xs text-amber-600 font-medium">
            ⚠️ Complete at least 50% of your profile to unlock placement applications.
          </p>
        )}
      </Card>

      {/* Recent Applications Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Recent Applications</h2>
          <Link href="/applications" className="text-sm font-semibold text-indigo-600 hover:underline">
            View All ({totalApps})
          </Link>
        </div>

        {recentApps.length === 0 ? (
          <Card className="p-8 text-center border border-dashed border-slate-300 rounded-xl bg-slate-50">
            <p className="text-slate-600 text-sm font-medium">You haven&apos;t applied for any placements yet.</p>
            <Link
              href="/listings"
              className="mt-3 inline-block text-xs font-semibold text-indigo-600 hover:underline"
            >
              Browse Open Opportunities
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentApps.map((item) => (
              <Link key={item.application.id} href={`/applications/${item.application.id}`}>
                <Card className="rounded-lg border border-slate-200 shadow-sm bg-white p-4 hover:border-slate-300 transition-all">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{item.listing.title}</span>
                        {item.listing.employer.verificationStatus === 'VERIFIED' && <VerificationBadge size="sm" />}
                      </div>
                      <span className="text-xs text-slate-500">{item.listing.employer.companyName} • {item.listing.location}</span>
                    </div>
                    <StatusBadge status={item.application.status as ApplicationStatus} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
