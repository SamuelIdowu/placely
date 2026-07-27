import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { listingRepo, studentProfileRepo } from '@/lib/container';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  MapPin,
  Calendar,
  Building2,
  CheckCircle2,
  ShieldAlert,
  ArrowLeft,
  Briefcase,
} from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = await listingRepo.findDetailsById(id);
  if (!listing) return { title: 'Listing Not Found — Placely' };
  return { title: `${listing.title} at ${listing.companyName} — Placely` };
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await listingRepo.findDetailsById(id);

  if (!listing || listing.isModerated || listing.status !== 'OPEN') {
    notFound();
  }

  const session = await auth();
  let isStudentVerified = false;

  if (session && session.user.role === 'STUDENT') {
    const student = await studentProfileRepo.findByUserId(session.user.id);
    if (student) {
      isStudentVerified = student.verificationStatus === 'VERIFIED';
    }
  }

  const isVerifiedEmployer = listing.companyVerificationStatus === 'VERIFIED';
  const formattedDate = new Date(listing.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link
        href="/listings"
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to Listings
      </Link>

      <Card className="rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 p-6 md:p-8 space-y-4 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-900">{listing.companyName}</span>
                {isVerifiedEmployer && <VerificationBadge size="md" showLabel />}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                {listing.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 pt-1">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {listing.location} {listing.isRemote && '(Remote / Hybrid)'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Posted {formattedDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  SIWES Placement
                </span>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
              {session?.user.role === 'STUDENT' ? (
                isStudentVerified ? (
                  <Link
                    href={`/student/listings/${listing.id}/apply`}
                    className="inline-flex items-center justify-center h-12 px-6 text-base font-medium rounded-[4px] bg-slate-900 text-white hover:bg-slate-800 transition-colors w-full md:w-auto text-center"
                  >
                    Apply for Placement
                  </Link>
                ) : (
                  <Button
                    disabled
                    size="lg"
                    className="rounded-[4px] bg-slate-200 text-slate-500 w-full md:w-auto cursor-not-allowed"
                  >
                    Complete Verification to Apply
                  </Button>
                )
              ) : (
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center h-12 px-6 text-base font-medium rounded-[4px] bg-slate-900 text-white hover:bg-slate-800 transition-colors w-full md:w-auto text-center"
                >
                  Login as Student to Apply
                </Link>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {listing.disciplines.map((disc) => (
              <span
                key={disc}
                className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
              >
                {disc}
              </span>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-8 space-y-8">
          {session?.user.role === 'STUDENT' && !isStudentVerified && (
            <div className="flex items-start gap-3 p-4 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-sm">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">Verification Required</span>
                Your student profile must be verified before submitting applications. You can submit your school ID card in your student profile dashboard.
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">About the Placement</h2>
            <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {listing.description}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Target Disciplines</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {listing.disciplines.map((disc) => (
                <div key={disc} className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{disc} Engineering</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
