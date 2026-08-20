import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/infrastructure/db/prisma.client';
import { studentProfileRepo, getMyApplicationsUseCase, listingRepo } from '@/lib/container';
import { CircularProgress } from '@/components/ui/circular-progress';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { DashboardActionBanner } from '@/components/dashboard/DashboardActionBanner';
import { SiwesPipelineStages } from '@/components/dashboard/SiwesPipelineStages';
import { MatchedPlacementsCarousel } from '@/components/dashboard/MatchedPlacementsCarousel';
import { SiwesLogbookCard } from '@/components/dashboard/SiwesLogbookCard';
import { RecentApplicationsTable } from '@/components/dashboard/RecentApplicationsTable';
import { MarketStipendBarometer } from '@/components/dashboard/MarketStipendBarometer';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { ApplicationStatus } from '@/domain/entities/application';

export const metadata: Metadata = {
  title: 'Student SIWES Dashboard — Placely',
  description: 'Track your SIWES placement applications, matched engineering opportunities, and digital logbook.',
};

export default async function StudentDashboardPage() {
  const session = await auth();
  if (!session || session.user.role !== 'STUDENT') redirect('/sign-in');

  const studentProfile = await studentProfileRepo.findByUserId(session.user.id);
  if (!studentProfile) redirect('/student/onboarding');

  // Load applications with attached listing & employer details
  const rawApplications = await getMyApplicationsUseCase.execute(studentProfile.id);

  const totalApps = rawApplications.length;
  const shortlistedApps = rawApplications.filter((a) => a.application.status === 'SHORTLISTED');
  const offeredApps = rawApplications.filter((a) => a.application.status === 'OFFERED');
  const acceptedApps = rawApplications.filter((a) => a.application.status === 'ACCEPTED');

  const recentAppsData = rawApplications.slice(0, 4).map((item) => ({
    id: item.application.id,
    listingId: item.listing.id,
    title: item.listing.title,
    companyName: item.listing.employer.companyName,
    companyVerified: item.listing.employer.verificationStatus === 'VERIFIED',
    location: item.listing.location,
    status: item.application.status as ApplicationStatus,
    appliedDate: new Date(item.application.createdAt).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  }));

  // Matched placements from real listings in student's discipline
  const { listings: matchedRaw } = await listingRepo.findPublic({
    discipline: studentProfile.discipline,
    pageSize: 4,
  });
  const matchedListingsData = matchedRaw.map((l) => ({
    id: l.id,
    title: l.title,
    companyName: l.companyName,
    companyVerified: l.companyVerificationStatus === 'VERIFIED',
    location: l.location,
    disciplines: l.disciplines,
    isRemote: l.isRemote,
  }));

  /* User lookup for greetings */
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { firstName: true, lastName: true, email: true },
  });

  /* Greeting copy based on time of day */
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  /* Determine profile display name */
  let profileName = '';
  if (user?.firstName && user.firstName.trim()) {
    profileName = user.lastName && user.lastName.trim()
      ? `${user.firstName.trim()} ${user.lastName.trim()}`
      : user.firstName.trim();
  } else if (session.user?.name && session.user.name.trim() && session.user.name.trim().toLowerCase() !== 'there') {
    profileName = session.user.name.trim();
  } else {
    const email = user?.email || session.user?.email;
    if (email) {
      const emailPrefix = email.split('@')[0];
      const parts = emailPrefix.split(/[._-]/).filter(Boolean);
      if (parts.length > 0) {
        profileName = parts
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join(' ');
      }
    }
  }

  if (!profileName) {
    profileName = studentProfile.discipline
      ? `${studentProfile.discipline} Scholar`
      : 'Student Scholar';
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* ── 1. Welcome Feature Band & Profile Status (Approved Hero Section) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-stretch">
        {/* Greetings Card (Dark Bento) */}
        <div
          className="rounded-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 bg-surface-dark"
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-white">
                {greeting}, {profileName}
              </h1>
              {studentProfile.isVerified && <VerificationBadge size="sm" />}
            </div>
            <p className="text-xs sm:text-sm font-medium text-surface-dark-muted">
              {studentProfile.university} · {studentProfile.discipline}
            </p>
          </div>

          <Link
            href="/listings"
            className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 text-xs font-semibold text-white transition-colors shrink-0 bg-brand-indigo hover:bg-brand-indigo-hover rounded-full w-full sm:w-auto shadow-xs"
          >
            Explore Placements <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Profile Completeness Card (White Bento Style with Circular Progress) */}
        <div
          className="bg-white rounded-card p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 relative overflow-hidden group border border-slate-200/90 shadow-2xs"
        >
          <div className="relative shrink-0 flex items-center justify-center">
            <CircularProgress
              value={studentProfile.profileCompleteness}
              size={80}
              strokeWidth={7}
              progressColor="text-brand-indigo"
              trackColor="text-muted"
            />
          </div>

          <div className="space-y-2 relative z-10 w-full text-center sm:text-left">
            <div>
              <h3 className="font-display text-base font-semibold text-foreground">
                Profile Completeness
              </h3>
              <p className="text-xs mt-0.5 leading-relaxed text-body-muted">
                Complete at least 50% of your academic profile to unlock premium placements.
              </p>
            </div>

            <div className="flex flex-col xl:flex-row xl:items-center gap-2.5 pt-0.5 w-full justify-between">
              {studentProfile.profileCompleteness < 50 ? (
                <div
                  className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold shrink-0 bg-amber-50 text-amber-600 border border-amber-300"
                >
                  Action Required: 50% needed
                </div>
              ) : (
                <div
                  className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold shrink-0 bg-emerald-50 text-emerald-600 border border-emerald-300"
                >
                  <CheckCircle2 className="w-3 h-3" /> Ready to Apply
                </div>
              )}

              <Link
                href="/profile"
                className="inline-flex items-center justify-center gap-1 text-xs font-bold transition-colors hover:text-brand-indigo-hover shrink-0 text-brand-indigo"
              >
                Update Profile <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Dynamic Action & Verification Banner ── */}
      <DashboardActionBanner
        offeredCount={offeredApps.length}
        offeredCompanyName={offeredApps[0]?.listing.employer.companyName}
        offeredApplicationId={offeredApps[0]?.application.id}
        isVerified={studentProfile.isVerified}
        verificationStatus={studentProfile.verificationStatus}
        profileCompleteness={studentProfile.profileCompleteness}
      />

      {/* ── 3. 4-Stage SIWES Placement Pipeline ── */}
      <SiwesPipelineStages
        totalApps={totalApps}
        shortlistedCount={shortlistedApps.length}
        offeredCount={offeredApps.length}
        acceptedCount={acceptedApps.length}
      />

      {/* ── 4. Main 2-Column Dashboard Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
        {/* Left Column (2 Cols): Matched Opportunities & Recent Applications */}
        <div className="lg:col-span-2 space-y-5">
          {/* Matched Placements Carousel / Grid */}
          <MatchedPlacementsCarousel
            discipline={studentProfile.discipline}
            university={studentProfile.university}
            listings={matchedListingsData}
          />

          {/* Recent Applications Activity */}
          <RecentApplicationsTable
            applications={recentAppsData}
            totalCount={totalApps}
          />
        </div>

        {/* Right Column (1 Col): SIWES Logbook Tracker & Market Barometer */}
        <div className="lg:col-span-1 space-y-5">
          {/* Digital SIWES Logbook & ITF Card */}
          <SiwesLogbookCard />

          {/* Nigerian Engineering Market & Stipend Barometer */}
          <MarketStipendBarometer />
        </div>
      </div>
    </div>
  );
}
