'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { getCompanyAvatarColor } from '@/lib/tokens';
import {
  Building2,
  GraduationCap,
  CheckCircle2,
  UserCheck,
  Calendar,
  FileText,
  ShieldCheck,
  Loader2,
  ArrowRight,
  Sparkles,
  Briefcase,
  ExternalLink,
} from 'lucide-react';

interface ClaimDetails {
  applicationId: string;
  claimToken: string;
  companyName: string;
  contactEmail: string | null;
  student: {
    id: string;
    name: string;
    university: string;
    discipline: string;
    resumeUrl: string | null;
    profileCompleteness: number;
    email: string;
  };
  listing: {
    id: string;
    title: string;
    location: string;
  };
}

function ClaimPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [details, setDetails] = useState<ClaimDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [cacNumber, setCacNumber] = useState('');
  const [action, setAction] = useState<'ACCEPT' | 'SHORTLIST'>('ACCEPT');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  useEffect(() => {
    if (!token) {
      setErrorMsg('No claim token provided in the link.');
      setIsLoading(false);
      return;
    }

    fetchClaimDetails(token);
  }, [token]);

  const fetchClaimDetails = async (claimToken: string) => {
    try {
      const res = await fetch(`/api/employer/claim?token=${claimToken}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Invalid or expired claim token');
      }

      const data: ClaimDetails = await res.json();
      setDetails(data);
      setCompanyName(data.companyName || '');
      setEmail(data.contactEmail || '');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not load application details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setErrorMsg('Please choose a password with at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/employer/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          email,
          password,
          companyName,
          cacNumber,
          action,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to claim employer profile');
      }

      setIsClaimed(true);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'An error occurred while claiming profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-indigo mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Verifying SIWES application token...</p>
        </div>
      </div>
    );
  }

  if (errorMsg && !details) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-[24px] border border-border p-8 text-center space-y-4 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
            !
          </div>
          <div className="space-y-1">
            <h2 className="font-serif text-xl font-normal text-slate-900">Invalid Claim Link</h2>
            <p className="text-xs text-slate-500">{errorMsg}</p>
          </div>
          <Button
            onClick={() => router.push('/')}
            className="w-full bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-semibold rounded-full h-10 shadow-xs cursor-pointer"
          >
            Go to Placely Homepage
          </Button>
        </div>
      </div>
    );
  }

  if (isClaimed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-lg w-full bg-white rounded-[24px] border border-emerald-200 p-8 text-center space-y-6 shadow-md">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-slate-900">
              Account Claimed Successfully
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Your response has been transmitted to <strong>{details?.student.name}</strong>, and your Placely Employer Portal account is now active.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl text-left text-xs space-y-2 border border-slate-200/80">
            <p className="flex justify-between">
              <span className="text-slate-500">Company:</span>
              <span className="font-semibold text-slate-900">{companyName}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-slate-500">Login Email:</span>
              <span className="font-mono font-semibold text-slate-900">{email}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-slate-500">Decision:</span>
              <span className="font-bold text-emerald-700">
                {action === 'ACCEPT' ? 'Placement Offer Extended' : 'Candidate Shortlisted for Interview'}
              </span>
            </p>
          </div>

          <Button
            onClick={() => router.push('/api/auth/signin')}
            className="w-full bg-brand-indigo hover:bg-brand-indigo-hover text-white font-semibold text-xs rounded-full h-11 shadow-xs cursor-pointer"
          >
            Sign In to Employer Portal <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  const avatarColor = details ? getCompanyAvatarColor(details.student.name) : '#4f46e5';
  const initials = details?.student.name ? details.student.name.charAt(0).toUpperCase() : 'S';

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-indigo-light text-brand-indigo text-[11px] font-bold border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5" />
            Official SIWES Applicant Review
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-normal tracking-tight text-slate-900">
            Review SIWES Placement Application
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            You received this official Industrial Attachment application from a verified STEM undergraduate via Placely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
          {/* Applicant Info Card (Left Column) */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-[20px] p-5 border border-border shadow-2xs space-y-4">
              <div className="flex items-start gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-xs"
                  style={{ background: avatarColor }}
                >
                  {initials}
                </div>
                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-slate-900 truncate">
                      {details?.student.name}
                    </h3>
                    <VerificationBadge size="sm" />
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    {details?.student.discipline}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] font-medium block">Institution</span>
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <GraduationCap className="w-3.5 h-3.5 text-brand-indigo" />
                    {details?.student.university}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 text-[11px] font-medium block">Applied Role / Unit</span>
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <Briefcase className="w-3.5 h-3.5 text-brand-indigo" />
                    {details?.listing.title}
                  </p>
                </div>

                {details?.student.resumeUrl && (
                  <div className="pt-1">
                    <a
                      href={details.student.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-brand-indigo hover:text-brand-indigo-hover font-semibold text-xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      View Student Resume / CV <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-brand-indigo-light/40 border border-indigo-100 text-xs text-slate-700 space-y-1.5">
              <p className="font-bold text-brand-indigo flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> What is Placely?
              </p>
              <p className="text-[11px] leading-relaxed text-slate-600">
                Placely is Nigeria's dedicated SIWES & Internship network. Claiming your company profile is 100% free and allows your team to hire vetted talent across Nigerian universities with zero administrative overhead.
              </p>
            </div>
          </div>

          {/* Action & Account Claim Card (Right Column) */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-[24px] p-6 sm:p-7 border border-border shadow-2xs space-y-5">
              <div className="space-y-1 pb-4 border-b border-slate-100">
                <h3 className="font-serif text-lg sm:text-xl font-normal text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-brand-indigo" />
                  Respond & Claim Company Profile
                </h3>
                <p className="text-xs text-slate-500">
                  Choose your response to the student and create your login credentials.
                </p>
              </div>

              <form onSubmit={handleClaimSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                    {errorMsg}
                  </div>
                )}

                {/* Action Selection */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Your Response to Applicant</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAction('ACCEPT')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        action === 'ACCEPT'
                          ? 'border-brand-indigo bg-brand-indigo-light/30 text-slate-900 font-semibold ring-2 ring-brand-indigo/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold mb-0.5">
                        <UserCheck className="w-4 h-4 text-emerald-600" /> Accept for SIWES
                      </div>
                      <p className="text-[11px] text-slate-500 font-normal">Extend placement offer</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAction('SHORTLIST')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        action === 'SHORTLIST'
                          ? 'border-brand-indigo bg-brand-indigo-light/30 text-slate-900 font-semibold ring-2 ring-brand-indigo/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold mb-0.5">
                        <Calendar className="w-4 h-4 text-brand-indigo" /> Interview Candidate
                      </div>
                      <p className="text-[11px] text-slate-500 font-normal">Shortlist for interview</p>
                    </button>
                  </div>
                </div>

                {/* Company Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <Label htmlFor="companyName" className="text-xs font-semibold text-slate-700">Company Name</Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      className="text-xs h-9.5 bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="cacNumber" className="text-xs font-semibold text-slate-700">CAC RC / Registration No. (Optional)</Label>
                    <Input
                      id="cacNumber"
                      placeholder="e.g. RC 1234567"
                      value={cacNumber}
                      onChange={(e) => setCacNumber(e.target.value)}
                      className="text-xs h-9.5 bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                    />
                  </div>
                </div>

                {/* Account Credentials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-xs font-semibold text-slate-700">Work / Recruiter Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="text-xs h-9.5 font-mono bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="password" className="text-xs font-semibold text-slate-700">Create Account Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Choose secure password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="text-xs h-9.5 bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-indigo hover:bg-brand-indigo-hover text-white font-semibold rounded-full h-11 text-xs sm:text-sm shadow-xs cursor-pointer active:scale-98"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Processing Claim...
                      </>
                    ) : (
                      <>
                        {action === 'ACCEPT' ? 'Accept Student & Claim Employer Profile' : 'Schedule Interview & Claim Profile'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClaimPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-brand-indigo" />
      </div>
    }>
      <ClaimPageContent />
    </Suspense>
  );
}
