import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { employerProfileRepo, listingRepo, applicationRepo } from '@/lib/container';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import {
  Plus,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  MapPin,
} from 'lucide-react';

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

  for (const listing of listings) {
    const apps = await applicationRepo.findByListingId(listing.id);
    totalApplicantsCount += apps.length;
    shortlistedCount += apps.filter((a) => a.status === 'SHORTLISTED').length;
    offeredCount += apps.filter((a) => a.status === 'OFFERED').length;

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
    <div className="space-y-4 sm:space-y-5">
      {/* ── Top Hero Banner (Deep Bento Card) ── */}
      <div
        className="rounded-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 text-white bg-surface-dark"
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-white">
              {employerProfile.companyName}
            </h1>
            <VerificationBadge status={employerProfile.verificationStatus} size="sm" />
          </div>
          <p className="text-xs sm:text-sm font-medium text-surface-dark-muted">
            Corporate Portal · RC/CAC: {employerProfile.cacNumber || 'Pending CAC'} · {session.user.email}
          </p>
        </div>

        <Link
          href="/employer/listings/new"
          className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 text-xs font-semibold text-white bg-brand-indigo hover:bg-brand-indigo-hover rounded-full transition-all shrink-0 shadow-xs w-full sm:w-auto relative z-10"
        >
          <Plus className="w-3.5 h-3.5" /> Post New SIWES Opening
        </Link>
      </div>

      {/* ── CAC Verification Notice Banner if PENDING ── */}
      {employerProfile.verificationStatus !== 'VERIFIED' && (
        <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-950 shadow-2xs">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-4.5 h-4.5 text-amber-600 mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <div className="font-bold text-xs">
                CAC Business Verification Status: {employerProfile.verificationStatus}
              </div>
              <p className="text-xs text-amber-800">
                Upload your CAC Registration Certificate to display the verified corporate badge on your placement listings and attract high-CGPA engineering candidates.
              </p>
            </div>
          </div>
          <Link
            href="/employer/profile/settings"
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 shrink-0"
          >
            Upload CAC Document <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* ── 3-Metric High-Contrast Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        {/* Active Openings */}
        <div
          className="bg-white rounded-card p-4.5 sm:p-5 border border-slate-200/90 shadow-2xs transition-all hover:shadow-xs border-l-4 border-l-brand-indigo"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Active SIWES Openings
          </span>
          <div className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mt-1.5">
            {listings.length}
          </div>
          <span className="text-xs text-body-muted mt-0.5 block">Live Placement Roles</span>
        </div>

        {/* Total Applicants */}
        <div
          className="bg-white rounded-card p-4.5 sm:p-5 border border-slate-200/90 shadow-2xs transition-all hover:shadow-xs border-l-4 border-l-stat-blue"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Total Student Applicants
          </span>
          <div className="text-3xl sm:text-4xl font-bold tracking-tight text-stat-blue mt-1.5">
            {totalApplicantsCount}
          </div>
          <span className="text-xs text-body-muted mt-0.5 block">Verified Undergraduates</span>
        </div>

        {/* Shortlisted / Interview */}
        <div
          className="bg-white rounded-card p-4.5 sm:p-5 border border-slate-200/90 shadow-2xs transition-all hover:shadow-xs border-l-4 border-l-stat-emerald"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Shortlisted &amp; Offers
          </span>
          <div className="text-3xl sm:text-4xl font-bold tracking-tight text-stat-emerald mt-1.5">
            {shortlistedCount + offeredCount}
          </div>
          <span className="text-xs text-body-muted mt-0.5 block">In Active Evaluation</span>
        </div>
      </div>

      {/* ── Active SIWES Listings & Applicant Review Deck ── */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Active Placement Listings &amp; Review Pipeline
          </h2>
          <Link
            href="/employer/listings/new"
            className="text-xs font-semibold text-brand-indigo hover:text-brand-indigo-hover transition-colors"
          >
            + Create Role
          </Link>
        </div>

        {listingsWithApplicantCounts.length === 0 ? (
          <div className="rounded-card border border-dashed border-slate-200 py-10 px-6 bg-white text-center space-y-2.5">
            <Briefcase className="w-9 h-9 text-slate-400 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">
                No active placement listings posted yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Create your first verified placement opening to start receiving applications from ambitious Nigerian engineering undergraduates.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/employer/listings/new"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-bold transition-all shadow-xs"
              >
                Post SIWES Placement Opening <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {listingsWithApplicantCounts.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-card p-5 border border-border hover:border-brand-indigo transition-all hover:shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{listing.title}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        listing.isOpen
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {listing.isOpen ? 'OPEN' : 'CLOSED'}
                    </span>
                  </div>
                  <p className="text-xs text-body-muted font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {listing.location} {listing.isRemote && '· Remote'} • Posted {listing.createdAt}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5">
                  <div className="text-right">
                    <span className="text-xl font-black text-brand-indigo block leading-none">
                      {listing.applicantCount}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">Candidates</span>
                  </div>

                  <Link
                    href={`/employer/listings/${listing.id}/applicants`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Review Applicants <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
