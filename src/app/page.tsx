import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  GraduationCap,
  Building2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  MapPin,
  Briefcase,
  Layers,
  Banknote,
  FileCheck,
} from 'lucide-react';
import { mockListings, mockEmployerProfiles } from '@/lib/mock';
import { VerificationBadge } from '@/components/shared/VerificationBadge';

export const metadata: Metadata = {
  title: 'Placely — SIWES Placement & Industrial Training Marketplace in Nigeria',
  description:
    'Verified SIWES placement opportunities for engineering students across Nigeria. Connect directly with vetted corporate employers offering transparent monthly stipends.',
  openGraph: {
    title: 'Placely — SIWES Placement Marketplace',
    description:
      'Connect Nigerian engineering students with verified corporate employers for 3 to 6-month SIWES internship programs.',
    type: "website",
  },
};

const TOP_UNIVERSITIES = [
  'University of Lagos (UNILAG)',
  'Ahmadu Bello University (ABU Zaria)',
  'Obafemi Awolowo University (OAU)',
  'Federal University of Technology Owerri (FUTO)',
  'Covenant University',
  'Al-Hikmah University',
  'University of Nigeria (UNN)',
  'University of Ibadan (UI)',
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fcfcfd] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e5e7eb] py-3.5 px-6 sm:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-[#4f46e5] text-white font-serif text-lg flex items-center justify-center shadow-2xs font-bold">
            P
          </div>
          <span className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-slate-900">
            Placely<span className="text-[#4f46e5]">.ng</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#75758a]">
          <Link href="/listings" className="hover:text-slate-900 transition-colors">
            Browse SIWES Openings
          </Link>
          <Link href="#disciplines" className="hover:text-slate-900 transition-colors">
            Engineering Tracks
          </Link>
          <Link href="#stipends" className="hover:text-slate-900 transition-colors">
            Stipend Barometer
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-bold text-white bg-[#4f46e5] hover:bg-[#4338ca] rounded-full transition-all shadow-2xs"
          >
            Get Started <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* ── Hero Section (Editorial Serif Headline) ── */}
      <section className="pt-20 pb-16 px-6 sm:px-12 max-w-6xl mx-auto w-full">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.08em] bg-indigo-50 border border-indigo-100 text-[#4f46e5]">
            <Sparkles className="w-3.5 h-3.5" /> SIWES Placement Marketplace in Nigeria
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal leading-[1.08] tracking-tight text-slate-950">
            Verified industrial placements. Zero hustle.
          </h1>

          <p className="text-base sm:text-lg text-[#75758a] leading-relaxed max-w-2xl font-normal">
            Connecting ambitious Nigerian engineering undergraduates with verified corporate employers for 3- to 6-month SIWES attachments with transparent monthly stipends and institutional validation.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <Link
              href="/listings"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
            >
              Explore SIWES Openings <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/sign-up?role=EMPLOYER"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs sm:text-sm font-bold transition-all"
            >
              Hire Engineering Interns
            </Link>
          </div>
        </div>
      </section>

      {/* ── Universities Ticker Strip ── */}
      <section className="py-8 border-y border-[#e5e7eb] bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 block mb-4">
            Trusted by Engineering Undergraduates Across Top Nigerian Institutions
          </span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-600">
            {TOP_UNIVERSITIES.map((uni) => (
              <span key={uni} className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
                <GraduationCap className="w-3.5 h-3.5 text-[#4f46e5]" /> {uni}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3-Pillar Bento Grid ── */}
      <section id="disciplines" className="py-20 px-6 sm:px-12 max-w-6xl mx-auto w-full space-y-12">
        <div className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#93939f]">
            The Placely Edge
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
            Engineered for Nigerian Students &amp; Industry Leaders
          </h2>
          <p className="text-xs sm:text-sm text-[#75758a] max-w-xl">
            Eliminating the months-long manual search for industrial attachment slots with direct matches, accredited courses, and verified corporate standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Discipline Matching */}
          <div className="bg-white rounded-[24px] p-7 border border-[#e5e7eb] shadow-2xs space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#4f46e5] flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-normal text-slate-900">
                NUC-Accredited Engineering Tracks
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Filter placements by Mechatronics, Computer, Electrical/Electronics, Mechanical, Civil, Chemical, and Petroleum engineering disciplines.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
              {['Mechatronics', 'Software', 'Electrical', 'Mechanical'].map((track) => (
                <span
                  key={track}
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700"
                >
                  {track}
                </span>
              ))}
            </div>
          </div>

          {/* Card 2: Stipend Transparency */}
          <div className="bg-white rounded-[24px] p-7 border border-[#e5e7eb] shadow-2xs space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Banknote className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-normal text-slate-900">
                Guaranteed Monthly Stipends
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                No unpaid exploitative internships. See transparent monthly allowances (₦50k–₦120k/mo) or transport/lunch packages upfront on every listing.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Avg. Lagos/Abuja: ₦75,000 / month
              </span>
            </div>
          </div>

          {/* Card 3: Institutional CAC Verification */}
          <div className="bg-white rounded-[24px] p-7 border border-[#e5e7eb] shadow-2xs space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1863dc] flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-normal text-slate-900">
                CAC Verified Employers &amp; Acceptance Letters
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every corporate partner is audited with verified CAC registration. Upon acceptance, receive a 1-click official SIWES placement letter for your university coordinator.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-indigo-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> ITF Form 8 Ready
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Placement Openings Spotlight ── */}
      <section className="py-16 bg-white border-t border-[#e5e7eb]">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#93939f]">
                Live Opportunities
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-slate-900">
                Curated SIWES Placements
              </h2>
            </div>
            <Link
              href="/listings"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#4f46e5] hover:text-[#4338ca]"
            >
              View All Openings <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {mockListings.slice(0, 4).map((listing) => {
              const employer = mockEmployerProfiles.find((e) => e.id === listing.employerProfileId);
              return (
                <div
                  key={listing.id}
                  className="bg-white rounded-[22px] p-6 border border-[#e5e7eb] shadow-2xs hover:border-[#4f46e5] transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {employer?.companyName}
                        </span>
                        <VerificationBadge status={employer?.verificationStatus || 'VERIFIED'} size="sm" />
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                        ₦75,000 / mo
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-normal text-slate-950">
                      {listing.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {listing.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {listing.disciplines.map((disc) => (
                        <span
                          key={disc}
                          className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-900"
                        >
                          {disc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5" /> {listing.location} {listing.isRemote && '· Remote'}
                    </span>
                    <Link
                      href={`/listings/${listing.id}`}
                      className="inline-flex items-center gap-1 font-bold text-[#4f46e5] hover:text-[#4338ca]"
                    >
                      Apply Placement <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-auto border-t border-[#e5e7eb] py-12 px-6 sm:px-12 bg-white text-xs text-[#75758a]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-1">
            <span className="font-serif text-lg font-normal text-slate-900">Placely.ng</span>
            <p className="text-slate-500">
              Nigeria&apos;s SIWES Placement &amp; Industrial Training Operating System.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-semibold">
            <Link href="/listings" className="hover:text-slate-900 transition-colors">
              Browse Listings
            </Link>
            <Link href="/sign-in" className="hover:text-slate-900 transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up" className="hover:text-slate-900 transition-colors">
              Student Register
            </Link>
            <Link href="/sign-up?role=EMPLOYER" className="hover:text-slate-900 transition-colors">
              Corporate Onboarding
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} Placely Technologies Ltd. All rights reserved.</p>
          <p>Compliant with NUC Academic Standards &amp; ITF SIWES Guidelines.</p>
        </div>
      </footer>
    </div>
  );
}
