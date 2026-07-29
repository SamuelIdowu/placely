// app/(admin)/admin/dashboard/page.tsx

import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/infrastructure/db/prisma.client';
import { verificationRepo } from '@/lib/container';
import { QuickVerificationActions } from './QuickVerificationActions';
import { Users, CheckCircle2, Briefcase, FileText, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = { title: 'Admin Dashboard — Placely' };

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-emerald-600" />
            Admin Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Platform monitoring, verification queue review, and listing moderation control.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/verifications"
            className="inline-flex items-center justify-center h-8 px-3 text-xs font-medium border border-input bg-background hover:bg-slate-100 rounded-[4px] transition-colors"
          >
            Verification Queue ({pendingVerifications.total})
          </Link>
          <Link
            href="/admin/listings"
            className="inline-flex items-center justify-center h-8 px-3 text-xs font-medium border border-input bg-background hover:bg-slate-100 rounded-[4px] transition-colors"
          >
            Listings Moderation
          </Link>
          <Link
            href="/admin/users"
            className="inline-flex items-center justify-center h-8 px-3 text-xs font-medium border border-input bg-background hover:bg-slate-100 rounded-[4px] transition-colors"
          >
            User Management
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-lg border border-slate-100 shadow-md hover:shadow-lg transition-all bg-white p-5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-0">
            <CardTitle className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent className="p-0 mt-3">
            <div className="text-3xl font-extrabold text-slate-900">{totalUsers}</div>
            <p className="text-xs text-slate-400 mt-1">
              {studentCount} Students · {employerCount} Employers
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-lg border border-slate-100 shadow-md hover:shadow-lg transition-all bg-white p-5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-0">
            <CardTitle className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
              Pending Verifications
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="p-0 mt-3">
            <div className="text-3xl font-extrabold text-amber-600">{pendingVerifications.total}</div>
            <p className="text-xs text-slate-400 mt-1">Requires admin document review</p>
          </CardContent>
        </Card>

        <Card className="rounded-lg border border-slate-100 shadow-md hover:shadow-lg transition-all bg-white p-5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-0">
            <CardTitle className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              Open Placements
            </CardTitle>
            <Briefcase className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="p-0 mt-3">
            <div className="text-3xl font-extrabold text-slate-900">{openListingsCount}</div>
            <p className="text-xs text-slate-400 mt-1">Active unmoderated listings</p>
          </CardContent>
        </Card>

        <Card className="rounded-lg border border-slate-100 shadow-md hover:shadow-lg transition-all bg-white p-5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-0">
            <CardTitle className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              Total Applications
            </CardTitle>
            <FileText className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="p-0 mt-3">
            <div className="text-3xl font-extrabold text-slate-900">{totalAppsCount}</div>
            <p className="text-xs text-slate-400 mt-1">Submitted across platform</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/verifications"
          className="p-5 bg-white border border-slate-100 rounded-lg shadow-md hover:shadow-lg hover:border-indigo-200 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                Action Needed
              </span>
              <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-3">Verification Queue</h3>
            <p className="text-xs text-slate-500 mt-1">
              Review student school IDs and company CAC registration documents.
            </p>
          </div>
          <div className="mt-4 text-xs font-bold text-indigo-600 group-hover:underline">
            Manage Verifications →
          </div>
        </Link>

        <Link
          href="/admin/listings"
          className="p-5 bg-white border border-slate-100 rounded-lg shadow-md hover:shadow-lg hover:border-indigo-200 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                Moderation
              </span>
              <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-3">Listings Moderation</h3>
            <p className="text-xs text-slate-500 mt-1">
              Audit posted SIWES placements, flag non-compliant listings, or restore.
            </p>
          </div>
          <div className="mt-4 text-xs font-bold text-indigo-600 group-hover:underline">
            Moderate Listings →
          </div>
        </Link>

        <Link
          href="/admin/users"
          className="p-5 bg-white border border-slate-100 rounded-lg shadow-md hover:shadow-lg hover:border-indigo-200 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                Accounts
              </span>
              <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-3">User Management</h3>
            <p className="text-xs text-slate-500 mt-1">
              Search users by email or role, inspect profiles and verification histories.
            </p>
          </div>
          <div className="mt-4 text-xs font-bold text-indigo-600 group-hover:underline">
            View Accounts →
          </div>
        </Link>
      </div>

      {/* Recent Verifications Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Verification Requests</h2>
          <span className="text-xs text-muted-foreground">Showing top 5 pending</span>
        </div>
        <QuickVerificationActions items={pendingVerifications.items} />
      </div>
    </div>
  );
}
