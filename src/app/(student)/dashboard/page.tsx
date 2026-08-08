import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/infrastructure/db/prisma.client';
import { studentProfileRepo } from '@/lib/container';
import { mockApplications, mockListings, mockEmployerProfiles } from '@/lib/mock';
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
  const rawApplications = mockApplications.map((app) => {
    const listing = mockListings.find((l) => l.id === app.listingId)!;
    const employer = mockEmployerProfiles.find((e) => e.id === listing.employerProfileId)!;
    return {
      application: app,
      listing: { ...listing.toObject(), employer },
    };
  });

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
    appliedDate: '2 days ago',
    stipendText: '₦70,000/mo',
  }));

  // Curated matched placements for student's discipline
  const matchedListingsData = [
    {
      id: 'siwes-match-1',
      title: 'Robotics & Automation Trainee (SIWES)',
      companyName: 'Dangote Sugar Refinery',
      companyVerified: true,
      location: 'Ikeja, Lagos',
      stipendText: '₦80,000/mo',
      disciplines: [studentProfile.discipline, 'Mechatronics', 'Electrical'],
      skills: ['PLC', 'Automation', 'Sensors'],
      isRemote: false,
    },
    {
      id: 'siwes-match-2',
      title: 'Hardware & IoT Engineering Intern',
      companyName: 'Moove Africa',
      companyVerified: true,
      location: 'Victoria Island, Lagos',
      stipendText: '₦75,000/mo',
      disciplines: [studentProfile.discipline, 'Computer Engineering'],
      skills: ['Embedded C', 'Telemetry', 'Circuit Design'],
      isRemote: false,
    },
    {
      id: 'siwes-match-3',
      title: 'Instrumentation & Control Systems Intern',
      companyName: 'Nestle Nigeria Plc',
      companyVerified: true,
      location: 'Agbara, Ogun',
      stipendText: '₦65,000/mo',
      disciplines: [studentProfile.discipline, 'Mechanical Engineering'],
      skills: ['SCADA', 'Pneumatics', 'Calibration'],
      isRemote: false,
    },
    {
      id: 'siwes-match-4',
      title: 'CAD Modeling & Prototyping Intern',
      companyName: 'Innoson Vehicle Manufacturing',
      companyVerified: true,
      location: 'Nnewi, Anambra',
      stipendText: '₦60,000/mo',
      disciplines: [studentProfile.discipline, 'Mechatronics'],
      skills: ['SolidWorks', 'MATLAB', 'CNC'],
      isRemote: false,
    },
  ];

  /* User lookup for greetings */
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { firstName: true, lastName: true },
  });

  /* Greeting copy based on time of day */
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  /* Display name: first name only */
  const firstName =
    user?.firstName || (session.user?.name ? session.user.name.split(' ')[0] : '') || 'there';

  return (
    <div className="container mx-auto max-w-6xl space-y-5 pb-8">
      {/* ── 1. Welcome Feature Band & Profile Status (Approved Hero Section) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-stretch">
        {/* Greetings Card (Dark Bento) */}
        <div
          className="rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6"
          style={{ background: '#17171c' }}
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-white">
                {greeting}, {firstName}
              </h1>
              {studentProfile.isVerified && <VerificationBadge size="sm" />}
            </div>
            <p className="text-xs sm:text-sm font-medium" style={{ color: '#93939f' }}>
              {studentProfile.university} · {studentProfile.discipline}
            </p>
          </div>

          <Link
            href="/listings"
            className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 text-xs font-semibold text-white transition-colors shrink-0 bg-[#4f46e5] hover:bg-[#4338ca] rounded-full w-full sm:w-auto shadow-xs"
          >
            Explore Placements <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Profile Completeness Card (White Bento Style with Circular Progress) */}
        <div
          className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 relative overflow-hidden group border border-slate-200/90 shadow-2xs"
        >
          {/* Subtle background dot pattern */}
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative shrink-0 flex items-center justify-center">
            <CircularProgress
              value={studentProfile.profileCompleteness}
              size={80}
              strokeWidth={7}
              progressColor="text-[#4f46e5]"
              trackColor="text-[#f1f5f9]"
            />
          </div>

          <div className="space-y-2 relative z-10 w-full text-center sm:text-left">
            <div>
              <h3 className="font-display text-base font-semibold" style={{ color: '#111827' }}>
                Profile Completeness
              </h3>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#6b7280' }}>
                Complete at least 50% of your academic profile to unlock premium placements.
              </p>
            </div>

            <div className="flex flex-col xl:flex-row xl:items-center gap-2.5 pt-0.5 w-full justify-between">
              {studentProfile.profileCompleteness < 50 ? (
                <div
                  className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold shrink-0"
                  style={{ background: '#fffbeb', color: '#f59e0b', border: '1px solid #fcd34d' }}
                >
                  Action Required: 50% needed
                </div>
              ) : (
                <div
                  className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold shrink-0"
                  style={{ background: '#ecfdf5', color: '#10b981', border: '1px solid #a7f3d0' }}
                >
                  <CheckCircle2 className="w-3 h-3" /> Ready to Apply
                </div>
              )}

              <Link
                href="/profile"
                className="inline-flex items-center justify-center gap-1 text-xs font-bold transition-colors hover:text-[#4338ca] shrink-0 text-[#4f46e5]"
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
          <SiwesLogbookCard
            currentWeek={4}
            totalWeeks={24}
            loggedDays={16}
            supervisorName="Engr. Babatunde"
            isSupervisorSigned={true}
          />

          {/* Nigerian Engineering Market & Stipend Barometer */}
          <MarketStipendBarometer />
        </div>
      </div>
    </div>
  );
}
