import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/infrastructure/db/prisma.client';
import { verificationRepo } from '@/lib/container';
import { QuickVerificationActions } from './QuickVerificationActions';
import { Users, ArrowUpRight, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Verification & Moderation Suite — Placely',
  description: 'Moderate SIWES placement listings, verify university student school IDs, and validate corporate CAC documents.',
};

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') redirect('/');

  const [studentCount, employerCount, openListingsCount, totalAppsCount, pendingVerifications] =
    await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'EMPLOYER' } }),
      prisma.listing.count({ where: { status: 'OPEN', isModerated: false } }),
      prisma.application.count(),
      verificationRepo.findPendingAll({ page: 1, limit: 5 }),
    ]);

  const totalUsers = studentCount + employerCount;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* ── Top Hero Banner (Deep Black Bento Card) ── */}
      <div
        className="rounded-card p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 text-white bg-surface-dark"
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-400">
              Admin &amp; Institutional Governance
            </span>
          </div>
          <h1 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-white flex items-center gap-2.5">
            Verification &amp; Moderation Suite
          </h1>
          <p className="text-xs sm:text-sm font-medium text-surface-dark-muted">
            System overview · {pendingVerifications.total} pending verifications awaiting review.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <Link
            href="/admin/verifications"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            Verification Queue ({pendingVerifications.total})
          </Link>
          <Link
            href="/admin/listings"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
          >
            Listings Moderation
          </Link>
          <Link
            href="/admin/users"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
          >
            User Management
          </Link>
        </div>
      </div>

      {/* ── 4 High-Contrast Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Users */}
        <div
          className="bg-white rounded-card p-4.5 sm:p-5 border border-slate-200/90 shadow-2xs transition-all hover:shadow-xs border-l-4 border-l-brand-indigo"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Platform Users
          </span>
          <div className="text-3xl font-bold tracking-tight text-slate-900 mt-1.5">
            {totalUsers}
          </div>
          <span className="text-xs text-body-muted mt-0.5 block">
            {studentCount} Students · {employerCount} Employers
          </span>
        </div>

        {/* Pending Verifications */}
        <div
          className="bg-white rounded-card p-4.5 sm:p-5 border border-slate-200/90 shadow-2xs transition-all hover:shadow-xs border-l-4 border-l-stat-amber"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-amber-600">
            Pending Queue
          </span>
          <div className="text-3xl font-bold tracking-tight text-amber-600 mt-1.5">
            {pendingVerifications.total}
          </div>
          <span className="text-xs text-body-muted mt-0.5 block">Requires admin review</span>
        </div>

        {/* Open Placements */}
        <div
          className="bg-white rounded-card p-4.5 sm:p-5 border border-slate-200/90 shadow-2xs transition-all hover:shadow-xs border-l-4 border-l-stat-blue"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-stat-blue">
            Open Placements
          </span>
          <div className="text-3xl font-bold tracking-tight text-stat-blue mt-1.5">
            {openListingsCount}
          </div>
          <span className="text-xs text-body-muted mt-0.5 block">Active unmoderated listings</span>
        </div>

        {/* Total Applications */}
        <div
          className="bg-white rounded-card p-4.5 sm:p-5 border border-slate-200/90 shadow-2xs transition-all hover:shadow-xs border-l-4 border-l-stat-emerald"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-600">
            Total Applications
          </span>
          <div className="text-3xl font-bold tracking-tight text-slate-900 mt-1.5">
            {totalAppsCount}
          </div>
          <span className="text-xs text-body-muted mt-0.5 block">Submitted across Nigeria</span>
        </div>
      </div>

      {/* ── 3 Quick Navigation Bento Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        <Link
          href="/admin/verifications"
          className="p-5 bg-white border border-slate-200/90 rounded-card shadow-2xs hover:border-stat-emerald transition-all group flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Action Required
              </span>
              <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 pt-0.5">Verification Queue</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Inspect student school ID cards and corporate CAC Registration Certificates to award verified status.
            </p>
          </div>
          <div className="mt-3.5 text-xs font-bold text-emerald-600 group-hover:underline flex items-center gap-1">
            Manage Verifications <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/admin/listings"
          className="p-5 bg-white border border-slate-200/90 rounded-card shadow-2xs hover:border-stat-blue transition-all group flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Quality Gate
              </span>
              <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-stat-blue transition-colors" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 pt-0.5">Listings Moderation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Moderate engineering training descriptions and accredited discipline targets before student visibility.
            </p>
          </div>
          <div className="mt-3.5 text-xs font-bold text-stat-blue group-hover:underline flex items-center gap-1">
            Moderate Openings <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/admin/users"
          className="p-5 bg-white border border-slate-200/90 rounded-card shadow-2xs hover:border-brand-indigo transition-all group flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                Directory
              </span>
              <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-brand-indigo transition-colors" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 pt-0.5">User Management</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Search all student and corporate employer profiles, update roles, and review account compliance.
            </p>
          </div>
          <div className="mt-3.5 text-xs font-bold text-brand-indigo group-hover:underline flex items-center gap-1">
            View All Accounts <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>

      {/* ── Recent Verifications Queue Section ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Pending Verification Requests
          </h2>
          <span className="text-xs text-slate-400">Showing top 5 pending</span>
        </div>
        <QuickVerificationActions items={pendingVerifications.items} />
      </div>
    </div>
  );
}
