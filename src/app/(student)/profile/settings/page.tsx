import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { studentProfileRepo } from '@/lib/container';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import {
  Settings,
  Mail,
  Bell,
  MapPin,
  Clock,
  ShieldCheck,
  FileCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Lock,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Settings & Placement Preferences — Placely',
  description: 'Manage account security, email notifications, SIWES location preferences, and ITF guidelines.',
};

export default async function StudentSettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const profile = await studentProfileRepo.findByUserId(session.user.id);
  const profileObj = profile?.toObject();

  return (
    <div className="max-w-5xl space-y-7 pb-14">
      {/* ── Top Header Band ── */}
      <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-border shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Preferences &amp; Security
            </span>
            <VerificationBadge status={profileObj?.verificationStatus || 'PENDING'} size="sm" showLabel />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-slate-900">
            Account &amp; SIWES Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Configure your placement notifications, preferred industrial attachment locations, and ITF compliance resources.
          </p>
        </div>

        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors shrink-0 shadow-2xs"
        >
          View Academic Profile &amp; ID →
        </Link>
      </div>

      {/* ── 2-Column Settings Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 items-start">
        {/* Left Column (2 Cols): Preferences & Notifications */}
        <div className="lg:col-span-2 space-y-7">
          {/* Account Identity Card */}
          <div className="bg-white rounded-[22px] p-6 sm:p-7 border border-border shadow-2xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <Mail className="w-5 h-5 text-brand-indigo" />
              <div>
                <h2 className="font-display text-base font-semibold text-slate-900">
                  Account Identity
                </h2>
                <p className="text-xs text-slate-500">
                  Primary credentials used for signing in and placement correspondence.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Registered Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={session.user.email || 'student@university.edu.ng'}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-100/70 text-slate-600 font-mono cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-400">
                  Managed via OAuth / Institutional SSO
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Account Role
                  </span>
                  <span className="text-xs font-bold text-slate-900 block">
                    STUDENT UNDERGRADUATE
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Enrolled Discipline
                  </span>
                  <span className="text-xs font-bold text-slate-900 block">
                    {profileObj?.discipline || 'Mechatronics Engineering'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Placement Notification Preferences */}
          <div className="bg-white rounded-[22px] p-6 sm:p-7 border border-border shadow-2xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <Bell className="w-5 h-5 text-brand-indigo" />
              <div>
                <h2 className="font-display text-base font-semibold text-slate-900">
                  Offer Alerts &amp; Notifications
                </h2>
                <p className="text-xs text-slate-500">
                  Instant email notifications for critical placement milestones.
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block">
                    Urgent 48h Placement Offers
                  </span>
                  <p className="text-slate-500 text-[11px]">
                    Receive high-priority email alerts the instant an employer extends a 6-month placement offer.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                  ENABLED
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block">
                    Shortlist &amp; Interview Requests
                  </span>
                  <p className="text-slate-500 text-[11px]">
                    Get notified when an employer reviews your resume PDF and shortlists your application.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                  ENABLED
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block">
                    Direct Employer Messages
                  </span>
                  <p className="text-slate-500 text-[11px]">
                    Email alerts when corporate supervisors send in-app messages regarding tests or interviews.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                  ENABLED
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): ITF Guidelines & Placement Toolkit */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[22px] p-6 border border-border shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <FileCheck className="w-4 h-4 text-brand-indigo" />
              <h3 className="font-display text-sm font-semibold text-slate-900">
                ITF Form 8 &amp; Academic Toolkit
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Industrial Training Fund (ITF) requirements and documentation standards for Nigerian universities.
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-1">
                <span className="font-bold text-indigo-950 block text-[11px]">
                  1. Official Acceptance Letter
                </span>
                <p className="text-indigo-900 text-[11px] leading-relaxed">
                  Generated automatically with verified employer CAC seals once you accept a placement offer.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900 block text-[11px]">
                  2. ITF Form 8 Submission
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Present your placement letter and employer confirmation to your departmental SIWES coordinator.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900 block text-[11px]">
                  3. Minimum 3–6 Months Duration
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Standard SIWES schemes require 12 to 24 consecutive weeks of verifiable industrial attachment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
