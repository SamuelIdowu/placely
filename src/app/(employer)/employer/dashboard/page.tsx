// app/(employer)/employer/dashboard/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { employerProfileRepo, listingRepo, applicationRepo } from '@/lib/container';
import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { VerificationBadge } from '@/components/shared/VerificationBadge';

export const metadata: Metadata = { title: 'Employer Dashboard — Placely' };

export default async function EmployerDashboardPage() {
  const session = await auth();
  if (!session || session.user.role !== 'EMPLOYER') redirect('/sign-in');

  const employerProfile = await employerProfileRepo.findByUserId(session.user.id);
  if (!employerProfile) redirect('/employer/onboarding');

  const listings = await listingRepo.findByEmployerProfileId(employerProfile.id);

  let totalApplicantsCount = 0;
  let shortlistedCount = 0;
  const listingsWithApplicantCounts = [];

  for (const listing of listings) {
    const apps = await applicationRepo.findByListingId(listing.id);
    totalApplicantsCount += apps.length;
    shortlistedCount += apps.filter((a) => a.status === 'SHORTLISTED').length;

    const isOpen = typeof listing.isOpen === 'function' ? listing.isOpen() : listing.status === 'OPEN';

    listingsWithApplicantCounts.push({
      id: listing.id,
      title: listing.title,
      location: listing.location,
      isRemote: listing.isRemote,
      isOpen,
      applicantCount: apps.length,
      createdAt: new Date(listing.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    });
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {employerProfile.companyName}
            </h1>
            <VerificationBadge status={employerProfile.verificationStatus} />
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Employer Portal • Account: {session.user.email}
          </p>
        </div>

        <Link
          href="/employer/listings/create"
          className="inline-flex items-center justify-center rounded-[4px] bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
        >
          + Post New SIWES Listing
        </Link>
      </div>

      {/* Verification Status Alert Banner if PENDING */}
      {employerProfile.verificationStatus !== 'VERIFIED' && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900">
          <div className="space-y-1">
            <div className="font-semibold text-sm">
              ⚠️ CAC Business Verification Pending ({employerProfile.verificationStatus})
            </div>
            <p className="text-xs text-amber-800">
              Upload your CAC registration documents to display the verified emerald badge on your listings and boost candidate trust.
            </p>
          </div>
          <Link
            href="/employer/verification"
            className="inline-flex text-xs font-bold text-amber-900 underline hover:text-amber-950 whitespace-nowrap"
          >
            Upload CAC Document →
          </Link>
        </div>
      )}

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-lg border border-slate-200 shadow-sm bg-white p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Active Listings
          </span>
          <div className="text-3xl font-bold text-slate-900 mt-2">{listings.length}</div>
          <span className="text-xs text-slate-400 mt-1 block">Open Placement Roles</span>
        </Card>

        <Card className="rounded-lg border border-slate-200 shadow-sm bg-white p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Total Applicants
          </span>
          <div className="text-3xl font-bold text-blue-600 mt-2">{totalApplicantsCount}</div>
          <span className="text-xs text-slate-400 mt-1 block">Across All Listings</span>
        </Card>

        <Card className="rounded-lg border border-slate-200 shadow-sm bg-white p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-600">
            Shortlisted Candidates
          </span>
          <div className="text-3xl font-bold text-purple-600 mt-2">{shortlistedCount}</div>
          <span className="text-xs text-slate-400 mt-1 block">In Interview Pipeline</span>
        </Card>
      </div>

      {/* Listings & Applicants Summary */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">SIWES Listings &amp; Applicants</h2>
        </div>

        {listingsWithApplicantCounts.length === 0 ? (
          <Card className="rounded-lg border border-slate-200 shadow-sm bg-white p-12 text-center">
            <CardContent className="space-y-3 pt-6">
              <CardTitle className="text-lg font-semibold text-slate-900">
                No active listings posted yet
              </CardTitle>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Create your first verified placement role to start receiving applications from top Nigerian engineering students.
              </p>
              <div className="pt-2">
                <Link
                  href="/employer/listings/create"
                  className="inline-flex items-center justify-center rounded-[4px] bg-black px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                >
                  Post Placement Listing
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {listingsWithApplicantCounts.map((listing) => (
              <Card key={listing.id} className="rounded-lg border border-slate-200 shadow-sm bg-white p-5 hover:border-slate-300 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-base">{listing.title}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${listing.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                        {listing.isOpen ? 'OPEN' : 'CLOSED'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {listing.location} {listing.isRemote && '(Remote)'} • Posted {listing.createdAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-slate-900">{listing.applicantCount}</span>
                      <span className="text-xs text-slate-500 block">Applicants</span>
                    </div>

                    <Link
                      href={`/employer/listings/${listing.id}/applicants`}
                      className="inline-flex items-center justify-center rounded-[4px] bg-black px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                    >
                      Review Applicants →
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
