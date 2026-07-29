import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { studentProfileRepo, getMyApplicationsUseCase } from '@/lib/container';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { AnalyticsTrendChart } from '@/components/shared/AnalyticsTrendChart';
import { BookOpen, CheckCircle2, ArrowRight } from 'lucide-react';
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
    <div className="container mx-auto max-w-6xl space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
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
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm gap-1.5"
        >
          Explore Open Placements <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Verification Status Banner if pending or rejected */}
      {!studentProfile.isVerified && (
        <div className="rounded-lg border border-amber-200 bg-amber-50/80 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-semibold">
              <span>⚠️ Account Verification Status: {studentProfile.verificationStatus}</span>
            </div>
            <p className="text-xs text-amber-800">
              Submit your school ID or official student documentation to earn a verified badge and unlock applications.
            </p>
          </div>
          <Link
            href="/student/verification"
            className="inline-flex text-xs font-bold text-indigo-700 hover:text-indigo-900 underline whitespace-nowrap"
          >
            Upload Verification Docs →
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-lg border border-slate-100 shadow-md hover:shadow-lg transition-all bg-white p-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Submitted
          </span>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{totalApps}</div>
          <span className="text-xs text-slate-400 mt-1 block">Applications</span>
        </Card>

        <Card className="rounded-lg border border-slate-100 shadow-md hover:shadow-lg transition-all bg-white p-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
            Shortlisted
          </span>
          <div className="text-3xl font-extrabold text-blue-600 mt-2">{shortlistedApps.length}</div>
          <span className="text-xs text-slate-400 mt-1 block">Interview Stage</span>
        </Card>

        <Card className="rounded-lg border border-slate-100 shadow-md hover:shadow-lg transition-all bg-white p-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">
            Offers Received
          </span>
          <div className="text-3xl font-extrabold text-purple-600 mt-2">{offeredApps.length}</div>
          <span className="text-xs text-slate-400 mt-1 block">Awaiting Decision</span>
        </Card>

        <Card className="rounded-lg border border-slate-100 shadow-md hover:shadow-lg transition-all bg-white p-5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
            Accepted
          </span>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2">{acceptedApps.length}</div>
          <span className="text-xs text-slate-400 mt-1 block">Confirmed SIWES</span>
        </Card>
      </div>

      {/* Market Analytics Trend Chart */}
      <AnalyticsTrendChart
        title="SIWES Placement & Stipend Trends"
        subtitle="Real-time market analytics tracking placement demand & stipend averages across Nigeria"
      />

      {/* Logbook Tracker & Profile Completeness Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Completeness Card */}
        <Card className="rounded-lg border border-slate-100 shadow-md bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Profile Completeness</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete at least 50% of your academic profile to submit applications.
              </p>
            </div>
            <span className="text-xl font-black text-indigo-600">
              {studentProfile.profileCompleteness}%
            </span>
          </div>
          <Progress value={studentProfile.profileCompleteness} className="h-2.5 bg-slate-100" />
          {studentProfile.profileCompleteness < 50 && (
            <p className="text-xs text-amber-600 font-semibold">
              ⚠️ Complete at least 50% of your profile to unlock placement applications.
            </p>
          )}
        </Card>

        {/* Quick Logbook Tracker Widget */}
        <Card className="rounded-lg border border-slate-100 shadow-md bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">SIWES Logbook Tracker</h3>
                <p className="text-xs text-slate-500">Weekly activity & supervisor sign-offs</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Week 4 Active
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <span className="text-slate-600 font-medium">Logged Entries: 16 Days</span>
            <Link
              href="/logbook"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Open Logbook →
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent Applications Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Recent Applications</h2>
          <Link href="/applications" className="text-xs font-bold text-indigo-600 hover:underline">
            View All ({totalApps})
          </Link>
        </div>

        {recentApps.length === 0 ? (
          <Card className="p-8 text-center border border-dashed border-slate-300 rounded-xl bg-white shadow-xs">
            <p className="text-slate-600 text-sm font-medium">You haven&apos;t applied for any placements yet.</p>
            <Link
              href="/listings"
              className="mt-3 inline-block text-xs font-bold text-indigo-600 hover:underline"
            >
              Browse Open Opportunities
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentApps.map((item) => (
              <Link key={item.application.id} href={`/applications/${item.application.id}`}>
                <Card className="rounded-lg border border-slate-100 shadow-md hover:shadow-lg transition-all bg-white p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{item.listing.title}</span>
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
