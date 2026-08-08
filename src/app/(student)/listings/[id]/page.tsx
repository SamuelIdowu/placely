import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { mockListings, mockEmployerProfiles, mockStudentProfiles } from '@/lib/mock';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import {
  MapPin,
  Calendar,
  Building2,
  CheckCircle2,
  ShieldAlert,
  ArrowLeft,
  Briefcase,
  Banknote,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = mockListings.find((l) => l.id === id);
  if (!listing) return { title: 'Placement Not Found — Placely' };
  const employer = mockEmployerProfiles.find((e) => e.id === listing.employerProfileId);
  return { title: `${listing.title} at ${employer?.companyName || 'Company'} — Placely` };
}

function getCompanyColor(name: string): string {
  const colors = [
    '#4f46e5', '#1863dc', '#10b981', '#ff7759',
    '#8b5cf6', '#0891b2', '#d97706', '#059669',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
  return colors[Math.abs(hash) % colors.length];
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = mockListings.find((l) => l.id === id);

  if (!listing || listing.isModerated || listing.status !== 'OPEN') {
    notFound();
  }

  const session = await auth();
  let isStudentVerified = false;

  if (session && session.user.role === 'STUDENT') {
    const student = mockStudentProfiles.find((s) => s.userId === session.user.id);
    if (student) {
      isStudentVerified = student.verificationStatus === 'VERIFIED';
    }
  }

  // Assuming current user is verified for mock fallback
  if (session && !mockStudentProfiles.find((s) => s.userId === session.user.id)) {
    isStudentVerified = true;
  }

  const employer = mockEmployerProfiles.find((e) => e.id === listing.employerProfileId);
  const isVerifiedEmployer = employer?.verificationStatus === 'VERIFIED';
  const companyName = employer?.companyName || 'Verified Corporate Partner';
  const avatarColor = getCompanyColor(companyName);
  const initials = companyName.charAt(0).toUpperCase();

  const formattedDate = new Date(listing.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5 pb-8">
      {/* Back link */}
      <Link
        href="/listings"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#4f46e5] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Placement Opportunities
      </Link>

      {/* Main Placement Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
        {/* Header Band */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-3.5">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-xs"
                style={{ background: avatarColor }}
              >
                {initials}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">{companyName}</span>
                  {isVerifiedEmployer && <VerificationBadge size="md" showLabel />}
                </div>

                <h1 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-slate-900">
                  {listing.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {listing.location} {listing.isRemote && '(Remote / Hybrid)'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Posted {formattedDate}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    6 Months SIWES
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Apply Button */}
            <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
              {session?.user.role === 'STUDENT' ? (
                isStudentVerified ? (
                  <Link
                    href={`/listings/${listing.id}/apply`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#4f46e5] hover:bg-[#4338ca] text-white text-sm font-semibold transition-all shadow-xs w-full md:w-auto"
                  >
                    Apply for Placement <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    href="/profile/settings"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs w-full md:w-auto"
                  >
                    Verify Student ID to Apply
                  </Link>
                )
              ) : (
                <Link
                  href="/sign-in"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#4f46e5] hover:bg-[#4338ca] text-white text-sm font-semibold transition-all shadow-xs w-full md:w-auto"
                >
                  Sign In as Student to Apply
                </Link>
              )}
            </div>
          </div>

          {/* Quick Info Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200/60">
            <div className="p-3 rounded-xl bg-white border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Monthly Stipend
              </span>
              <span className="text-sm font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                <Banknote className="w-3.5 h-3.5" /> ₦75,000 / mo
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Placement Duration
              </span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600" /> 6 Months (Full-Time)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200/80 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Compliance Status
              </span>
              <span className="text-sm font-bold text-indigo-700 mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> ITF Form 8 Approved
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {session?.user.role === 'STUDENT' && !isStudentVerified && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Verification Required Before Submitting</span>
                Your student profile must be verified with your university school ID to submit official SIWES applications.
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              About the Placement & Industrial Training
            </h2>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {listing.description}
            </div>
          </div>

          {/* Target Disciplines */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Target Engineering & Technology Disciplines
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {listing.disciplines.map((disc) => (
                <div
                  key={disc}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-800 p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{disc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* University Acceptance & Logbook Support */}
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-1.5">
            <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
              Official University Handoff Guaranteed
            </h3>
            <p className="text-xs text-indigo-800 leading-relaxed">
              Upon receiving and accepting an offer for this role, Placely automatically generates an official digital SIWES Placement Letter with the company&apos;s CAC registration and supervisor details for submission to your university SIWES coordinator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
