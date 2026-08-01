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
import {
  BookOpen,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import type { ApplicationStatus } from '@/domain/entities/application';

export const metadata: Metadata = {
  title: 'Student Dashboard — Placely',
};

/** Deterministic avatar color from company name */
function getCompanyColor(name: string): string {
  const colors = [
    '#4f46e5', '#1863dc', '#10b981', '#ff7759',
    '#8b5cf6', '#0891b2', '#d97706', '#059669',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
  return colors[Math.abs(hash) % colors.length];
}

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

  /* Greeting copy */
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  /* Display name: first name only */
  const firstName = (session.user.name ?? 'there').split(' ')[0];

  return (
    <div className="container mx-auto max-w-6xl space-y-7">

      {/* ── Welcome Feature Band (Cohere dark product strip) ── */}
      <div
        className="rounded-[22px] p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
        style={{ background: '#17171c' }}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-normal tracking-tight text-white">
              {greeting}, {firstName}
            </h1>
            {studentProfile.isVerified && <VerificationBadge size="sm" />}
          </div>
          <p className="text-sm" style={{ color: '#93939f' }}>
            {studentProfile.university} · {studentProfile.discipline}
          </p>

          {/* Profile progress bar — subtle on dark */}
          <div className="pt-2 space-y-1.5 max-w-xs">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#93939f' }}>
              <span>Profile</span>
              <span style={{ color: '#4f46e5' }}>{studentProfile.profileCompleteness}%</span>
            </div>
            <div className="h-1 rounded-full w-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div
                className="h-1 rounded-full transition-all duration-700"
                style={{
                  width: `${studentProfile.profileCompleteness}%`,
                  background: '#4f46e5',
                }}
              />
            </div>
          </div>
        </div>

        <Link
          href="/listings"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white transition-colors shrink-0 bg-[#4f46e5] hover:bg-[#4338ca] rounded-[32px]"
        >
          Explore Placements <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* ── Verification Banner (improved, not emoji-based) ── */}
      {!studentProfile.isVerified && (
        <div
          className="rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          style={{
            background: '#fffbeb',
            borderLeft: '4px solid #f59e0b',
          }}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-amber-900">
                Account Verification: {studentProfile.verificationStatus}
              </p>
              <p className="text-xs text-amber-700">
                Submit your school ID or official student documentation to earn a verified badge and unlock applications.
              </p>
            </div>
          </div>
          <Link
            href="/student/verification"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 whitespace-nowrap shrink-0"
          >
            Upload Docs <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* ── Stats Grid — Left-Border Accent (Cohere flat, no shadow) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Applications */}
        <div
          className="bg-white rounded-lg p-5 transition-colors hover:bg-slate-50/60"
          style={{ border: '1px solid #e5e7eb', borderLeft: '4px solid #4f46e5' }}
        >
          <span className="block text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: '#93939f' }}>
            Total Submitted
          </span>
          <div className="text-4xl font-bold mt-2" style={{ color: '#4f46e5' }}>{totalApps}</div>
          <span className="text-xs mt-1 block" style={{ color: '#75758a' }}>Applications</span>
        </div>

        {/* Shortlisted */}
        <div
          className="bg-white rounded-lg p-5 transition-colors hover:bg-slate-50/60"
          style={{ border: '1px solid #e5e7eb', borderLeft: '4px solid #1863dc' }}
        >
          <span className="block text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: '#93939f' }}>
            Shortlisted
          </span>
          <div className="text-4xl font-bold mt-2" style={{ color: '#1863dc' }}>{shortlistedApps.length}</div>
          <span className="text-xs mt-1 block" style={{ color: '#75758a' }}>Interview Stage</span>
        </div>

        {/* Offers */}
        <div
          className="bg-white rounded-lg p-5 transition-colors hover:bg-slate-50/60"
          style={{ border: '1px solid #e5e7eb', borderLeft: '4px solid #ff7759' }}
        >
          <span className="block text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: '#93939f' }}>
            Offers Received
          </span>
          <div className="text-4xl font-bold mt-2" style={{ color: '#ff7759' }}>{offeredApps.length}</div>
          <span className="text-xs mt-1 block" style={{ color: '#75758a' }}>Awaiting Decision</span>
        </div>

        {/* Accepted */}
        <div
          className="bg-white rounded-lg p-5 transition-colors hover:bg-slate-50/60"
          style={{ border: '1px solid #e5e7eb', borderLeft: '4px solid #10b981' }}
        >
          <span className="block text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: '#93939f' }}>
            Accepted
          </span>
          <div className="text-4xl font-bold mt-2" style={{ color: '#10b981' }}>{acceptedApps.length}</div>
          <span className="text-xs mt-1 block" style={{ color: '#75758a' }}>Confirmed SIWES</span>
        </div>
      </div>

      {/* ── Market Analytics Trend Chart ── */}
      <AnalyticsTrendChart
        title="SIWES Placement & Stipend Trends"
        subtitle="Real-time market analytics tracking placement demand & stipend averages across Nigeria"
      />

      {/* ── Logbook + Profile Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Completeness Card */}
        <div
          className="bg-white rounded-lg p-6 space-y-4"
          style={{ border: '1px solid #e5e7eb' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-base" style={{ color: '#212121' }}>Profile Completeness</h3>
              <p className="text-xs mt-0.5" style={{ color: '#75758a' }}>
                Complete at least 50% of your academic profile to submit applications.
              </p>
            </div>
            <span
              className="text-sm font-bold px-2.5 py-1 rounded-full"
              style={{ color: '#4f46e5', background: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.15)' }}
            >
              {studentProfile.profileCompleteness}%
            </span>
          </div>
          {/* Thin Cohere-style progress bar */}
          <div className="h-1.5 rounded-full w-full" style={{ background: '#f1f5f9' }}>
            <div
              className="h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${studentProfile.profileCompleteness}%`, background: '#4f46e5' }}
            />
          </div>
          {studentProfile.profileCompleteness < 50 && (
            <p className="text-xs font-semibold" style={{ color: '#f59e0b' }}>
              Complete at least 50% to unlock placement applications.
            </p>
          )}
        </div>

        {/* Logbook Tracker — Dark contrast element */}
        <div
          className="rounded-lg p-6 space-y-4"
          style={{ background: '#17171c' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-md flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-base text-white">SIWES Logbook Tracker</h3>
                <p className="text-xs" style={{ color: '#93939f' }}>Weekly activity & supervisor sign-offs</p>
              </div>
            </div>
            <span
              className="px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"
              style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Week 4 Active
            </span>
          </div>

          <div
            className="flex items-center justify-between text-xs pt-1"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span style={{ color: '#93939f' }}>Logged Entries: 16 Days</span>
            <Link
              href="/logbook"
              className="font-bold transition-colors text-[#93939f] hover:text-white"
            >
              Open Logbook →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Recent Applications ── */}
      <div className="space-y-4">
        {/* Cohere mono-label section header */}
        <div className="flex items-center justify-between">
          <h2
            className="text-[11px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: '#93939f' }}
          >
            Recent Applications
          </h2>
          <Link
            href="/applications"
            className="text-xs font-semibold transition-colors"
            style={{ color: '#4f46e5' }}
          >
            View All ({totalApps})
          </Link>
        </div>

        {recentApps.length === 0 ? (
          <div
            className="p-8 text-center rounded-xl bg-white"
            style={{ border: '1px dashed #e5e7eb' }}
          >
            <p className="text-sm font-medium" style={{ color: '#75758a' }}>
              You haven&apos;t applied for any placements yet.
            </p>
            <Link
              href="/listings"
              className="mt-3 inline-block text-xs font-bold"
              style={{ color: '#4f46e5' }}
            >
              Browse Open Opportunities
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentApps.map((item) => {
              const initials = item.listing.employer.companyName?.[0]?.toUpperCase() ?? '?';
              const avatarColor = getCompanyColor(item.listing.employer.companyName ?? '');
              return (
                <Link key={item.application.id} href={`/applications/${item.application.id}`}>
                  <div
                    className="bg-white rounded-lg p-4 flex items-center justify-between gap-4 transition-all border border-[#e5e7eb] hover:border-[#4f46e5] hover:bg-[#f8f7ff]"
                  >
                    <div className="flex items-center gap-3">
                      {/* Company initial avatar */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ background: avatarColor }}
                      >
                        {initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm" style={{ color: '#212121' }}>
                            {item.listing.title}
                          </span>
                          {item.listing.employer.verificationStatus === 'VERIFIED' && (
                            <VerificationBadge size="sm" />
                          )}
                        </div>
                        <span className="text-xs" style={{ color: '#75758a' }}>
                          {item.listing.employer.companyName} · {item.listing.location}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={item.application.status as ApplicationStatus} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
