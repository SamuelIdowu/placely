import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  GraduationCap,
  ArrowRight,
  MapPin,
  Layers,
  Banknote,
  FileCheck,
} from 'lucide-react';
import { listingRepo } from '@/lib/container';
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

export default async function Home() {
  const { listings: featuredListings } = await listingRepo.findPublic({ page: 1, pageSize: 4 });

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground font-sans selection:bg-brand-indigo-light selection:text-brand-indigo">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border h-16 px-6 sm:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-brand-indigo text-white font-serif text-lg flex items-center justify-center shadow-2xs font-bold">
            P
          </div>
          <span className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-slate-900">
            Placely<span className="text-brand-indigo">.ng</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-body-muted">
          <Link href="/listings" className="hover:text-slate-900 transition-colors">
            Browse Openings
          </Link>
          <Link href="#pillars" className="hover:text-slate-900 transition-colors">
            How It Works
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors min-h-[44px] flex items-center"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-1.5 px-4.5 py-2.5 text-xs font-bold text-white bg-brand-indigo hover:bg-brand-indigo-hover rounded-full transition-all shadow-2xs active:scale-[0.98] min-h-[44px]"
          >
            Get Started <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* ── Hero Section (Split-Screen) ── */}
      <section className="pt-16 sm:pt-20 pb-12 sm:pb-16 px-6 sm:px-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Copy + CTAs */}
          <div className="space-y-6 max-w-xl">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] tracking-tight text-slate-950">
              Verified industrial placements. Zero&nbsp;hustle.
            </h1>

            <p className="text-base sm:text-lg text-body-muted leading-relaxed font-normal">
              Nigerian engineering students meet verified employers for SIWES internships with transparent stipends.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <Link
                href="/listings"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-brand-indigo hover:bg-brand-indigo-hover text-white text-sm font-bold transition-all shadow-xs active:scale-[0.98]"
              >
                Explore Openings <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/sign-up?role=EMPLOYER"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-sm font-bold transition-all active:scale-[0.98]"
              >
                Post an Opening
              </Link>
            </div>
          </div>

          {/* Right: Hero Visual Placeholder */}
          <div className="relative aspect-[4/3] lg:aspect-[16/11] rounded-card bg-secondary border border-border overflow-hidden flex items-center justify-center">
            {/* TODO: Replace with a real hero image — Nigerian engineering students in a workplace or campus setting, ~1200x800 */}
            <div className="text-center space-y-3 px-8">
              <div className="w-14 h-14 rounded-2xl bg-brand-indigo-light text-brand-indigo flex items-center justify-center mx-auto">
                <GraduationCap className="w-7 h-7" />
              </div>
              <p className="text-xs font-semibold text-slate-400">
                Hero image placeholder
              </p>
              <p className="text-[11px] text-slate-300 max-w-[240px] mx-auto leading-relaxed">
                Insert a photograph of Nigerian engineering students at work. Recommended: 1200×800px.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── University Trust Strip ── */}
      <section className="py-8 border-y border-border bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 shrink-0">
              Trusted at
            </span>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
              {TOP_UNIVERSITIES.map((uni) => (
                <span key={uni} className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
                  <GraduationCap className="w-3.5 h-3.5 text-brand-indigo/60" /> {uni}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3-Pillar Bento Grid (Varied Compositions) ── */}
      <section id="pillars" className="py-20 sm:py-28 px-6 sm:px-12 max-w-7xl mx-auto w-full space-y-12">
        <div className="space-y-2">
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
            Engineered for students &amp; industry
          </h2>
          <p className="text-sm text-body-muted max-w-xl leading-relaxed">
            Direct matches, accredited courses, and verified corporate standards — no middlemen, no guesswork.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
          {/* Card 1: Discipline Matching — spans 3 cols (half) */}
          <div className="md:col-span-3 bg-white rounded-card p-7 border border-border space-y-4 flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-indigo-light text-brand-indigo flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-normal text-slate-900">
                NUC-Accredited Engineering Tracks
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Filter placements by Mechatronics, Computer, Electrical, Mechanical, Civil, Chemical, and Petroleum engineering disciplines.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
              {['Mechatronics', 'Software', 'Electrical', 'Mechanical', 'Civil'].map((track) => (
                <span
                  key={track}
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700"
                >
                  {track}
                </span>
              ))}
            </div>
          </div>

          {/* Card 2: Stipend Transparency — spans 3 cols (half), tinted bg */}
          <div className="md:col-span-3 bg-emerald-50/60 rounded-card p-7 border border-emerald-100/80 space-y-4 flex flex-col justify-between hover:border-emerald-200 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-white text-emerald-600 flex items-center justify-center border border-emerald-100">
                <Banknote className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-normal text-slate-900">
                Guaranteed Monthly Stipends
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No unpaid internships. See transparent monthly allowances or transport and lunch packages upfront on every listing.
              </p>
            </div>
            <div className="pt-4 border-t border-emerald-100/60">
              <span className="text-[11px] font-bold text-emerald-700 bg-white px-3 py-1 rounded-full border border-emerald-200">
                Avg. Lagos / Abuja: ₦75,000 / month
              </span>
            </div>
          </div>

          {/* Card 3: CAC Verification — spans full width, dark bg, horizontal layout */}
          <div className="md:col-span-6 bg-surface-dark rounded-card p-7 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6 hover:opacity-95 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center shrink-0">
              <FileCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 flex-1">
              <h3 className="font-serif text-xl font-normal text-white">
                CAC Verified Employers &amp; Acceptance Letters
              </h3>
              <p className="text-xs text-surface-dark-muted leading-relaxed max-w-2xl">
                Every corporate partner is audited with verified CAC registration. Upon acceptance, receive an official SIWES placement letter for your university coordinator.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-white shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> ITF Form 8 Ready
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Placements (Full-Width Rows — different layout family) ── */}
      <section className="py-16 sm:py-20 bg-secondary/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-slate-900">
                Live opportunities
              </h2>
              <p className="text-xs text-body-muted">
                Recent SIWES openings from verified employers.
              </p>
            </div>
            <Link
              href="/listings"
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-indigo hover:text-brand-indigo-hover"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {featuredListings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="block bg-white rounded-card p-5 sm:p-6 border border-border hover:border-brand-indigo hover:shadow-sm transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {listing.companyName}
                      </span>
                      <VerificationBadge status={listing.companyVerificationStatus} size="sm" />
                    </div>
                    <h3 className="font-serif text-lg font-normal text-slate-950 truncate">
                      {listing.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {listing.location} {listing.isRemote && '· Remote'}
                      </span>
                      <span className="flex flex-wrap gap-1">
                        {listing.disciplines.slice(0, 3).map((disc) => (
                          <span
                            key={disc}
                            className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-900"
                          >
                            {disc}
                          </span>
                        ))}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-indigo group-hover:text-brand-indigo-hover transition-colors">
                      View <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            {featuredListings.length === 0 && (
              <div className="text-center py-12 text-sm text-slate-400 bg-white rounded-card border border-border">
                No placements available yet. Check back soon.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-auto border-t border-border py-12 px-6 sm:px-12 bg-white text-xs text-body-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-1">
            <span className="font-serif text-lg font-normal text-slate-900">Placely.ng</span>
            <p className="text-slate-500">
              Nigeria&apos;s SIWES placement operating system.
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

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} Placely Technologies Ltd. All rights reserved.</p>
          <p>Compliant with NUC Academic Standards &amp; ITF SIWES Guidelines.</p>
        </div>
      </footer>
    </div>
  );
}
