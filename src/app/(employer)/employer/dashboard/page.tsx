import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { employerProfileRepo, listingRepo, getApplicantsUseCase } from '@/lib/container';
import { EmployerWelcomeBand } from '@/components/dashboard/EmployerWelcomeBand';
import { EmployerPipelineStages } from '@/components/dashboard/EmployerPipelineStages';
import { ListingPipelineDeck } from '@/components/dashboard/ListingPipelineDeck';
import { RecentApplicantsTable } from '@/components/dashboard/RecentApplicantsTable';
import { PendingVerificationBanner } from '@/components/shared/PendingVerificationBanner';
import type { ApplicationStatus } from '@/domain/entities/application';

export const metadata: Metadata = {
  title: 'Employer SIWES Dashboard — Placely',
  description: 'Manage SIWES internship openings, review verified Nigerian engineering student applicants, and extend placement offers.',
};

export default async function EmployerDashboardPage() {
  const session = await auth();
  if (!session || session.user.role !== 'EMPLOYER') redirect('/sign-in');

  const employerProfile = await employerProfileRepo.findByUserId(session.user.id);
  if (!employerProfile) redirect('/employer/onboarding');

  const listings = await listingRepo.findByEmployerProfileId(employerProfile.id);

  let totalApplicantsCount = 0;
  let shortlistedCount = 0;
  let offeredCount = 0;
  const listingsWithApplicantCounts = [];
  const allApplicants: {
    id: string;
    listingTitle: string;
    studentName: string;
    university: string;
    discipline: string;
    status: ApplicationStatus;
    appliedDate: string;
  }[] = [];

  for (const listing of listings) {
    let applicants: { application: { id: string; status: ApplicationStatus; createdAt: Date }; student: { university: string; discipline: string; user: { firstName?: string | null; lastName?: string | null; email: string } } }[] = [];
    try {
      const result = await getApplicantsUseCase.execute({
        listingId: listing.id,
        employerProfileId: employerProfile.id,
      });
      applicants = result.applicants;
    } catch {
      applicants = [];
    }

    totalApplicantsCount += applicants.length;
    shortlistedCount += applicants.filter((a) => a.application.status === 'SHORTLISTED').length;
    offeredCount += applicants.filter((a) => a.application.status === 'OFFERED').length;

    const isOpen = typeof listing.isOpen === 'function' ? listing.isOpen() : listing.status === 'OPEN';

    listingsWithApplicantCounts.push({
      id: listing.id,
      title: listing.title,
      location: listing.location,
      isRemote: listing.isRemote,
      isOpen,
      applicantCount: applicants.length,
      createdAt: new Date(listing.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    });

    for (const item of applicants) {
      const name = [item.student.user.firstName, item.student.user.lastName].filter(Boolean).join(' ') || item.student.user.email.split('@')[0];
      allApplicants.push({
        id: item.application.id,
        listingTitle: listing.title,
        studentName: name,
        university: item.student.university,
        discipline: item.student.discipline,
        status: item.application.status,
        appliedDate: new Date(item.application.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      });
    }
  }

  const recentApplicants = allApplicants
    .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Welcome Hero */}
      <EmployerWelcomeBand
        companyName={employerProfile.companyName}
        cacNumber={employerProfile.cacNumber}
        email={session.user.email || ''}
        verificationStatus={employerProfile.verificationStatus}
      />

      {/* Verification Banner */}
      <PendingVerificationBanner
        status={employerProfile.verificationStatus}
      />

      {/* Pipeline Stages */}
      <EmployerPipelineStages
        activeOpenings={listings.length}
        totalApplicants={totalApplicantsCount}
        shortlistedAndOffers={shortlistedCount + offeredCount}
      />

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-5">
          <ListingPipelineDeck listings={listingsWithApplicantCounts} />
        </div>

        {/* Right Column (1 Col) */}
        <div className="lg:col-span-1 space-y-5">
          <RecentApplicantsTable
            applicants={recentApplicants}
            totalCount={totalApplicantsCount}
          />
        </div>
      </div>
    </div>
  );
}
