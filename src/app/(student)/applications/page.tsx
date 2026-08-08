import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { studentProfileRepo } from '@/lib/container';
import { mockApplications, mockListings, mockEmployerProfiles } from '@/lib/mock';
import { ApplicationsViewManager } from './ApplicationsViewManager';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My SIWES Applications — Placely',
  description: 'Track your active SIWES applications, review offers, and access digital acceptance letters.',
};

export default async function MyApplicationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in?callbackUrl=/applications');
  }

  if (session.user.role !== 'STUDENT') {
    redirect('/employer/dashboard');
  }

  const studentProfile = await studentProfileRepo.findByUserId(session.user.id);
  if (!studentProfile) {
    redirect('/student/onboarding');
  }

  const rawApplications = mockApplications.map((app) => {
    const listing = mockListings.find((l) => l.id === app.listingId)!;
    const employer = mockEmployerProfiles.find((e) => e.id === listing.employerProfileId)!;
    return {
      application: app,
      listing: { ...listing.toObject(), employer },
    };
  });

  const applications = rawApplications.map((item) => ({
    id: item.application.id,
    listingId: item.listing.id,
    listingTitle: item.listing.title,
    companyName: item.listing.employer.companyName,
    verificationStatus: item.listing.employer.verificationStatus,
    location: item.listing.location,
    isRemote: item.listing.isRemote,
    status: item.application.status,
    appliedDate: new Date(item.application.createdAt).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  }));

  const offeredCount = applications.filter((a) => a.status === 'OFFERED').length;
  const shortlistedCount = applications.filter((a) => a.status === 'SHORTLISTED').length;

  return (
    <div className="w-full max-w-full space-y-5 pb-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#93939f]">
              SIWES Placement Funnel
            </span>
            {offeredCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                <Sparkles className="w-3 h-3" /> {offeredCount} Offer Awaiting Response
              </span>
            )}
          </div>
          <h1 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-slate-900 mt-1">
            My Applications & Offer Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Review status updates, respond to placement offers, and download university acceptance letters.
          </p>
        </div>

        <Link
          href="/listings"
          className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-full bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-semibold transition-all shrink-0 shadow-xs"
        >
          Explore More Placements <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <ApplicationsViewManager items={applications} />
    </div>
  );
}
