'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-sm text-zinc-500 font-medium">Verifying SIWES application token...</p>
        </div>
      </div>
    );
  }

  if (errorMsg && !details) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <Card className="max-w-md w-full text-center p-6 space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center mx-auto">
            !
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Invalid Claim Link</h2>
          <p className="text-sm text-zinc-500">{errorMsg}</p>
          <Button onClick={() => router.push('/')} variant="outline" className="w-full">
            Go to Placely Homepage
          </Button>
        </Card>
      </div>
    );
  }

  if (isClaimed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <Card className="max-w-lg w-full text-center p-8 space-y-6 shadow-xl border-emerald-200 dark:border-emerald-900">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Account Claimed Successfully!</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Your response has been transmitted to <strong>{details?.student.name}</strong>, and your Placely Employer Portal account is now active.
            </p>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl text-left text-xs space-y-2 border">
            <p><strong>Company:</strong> {companyName}</p>
            <p><strong>Login Email:</strong> {email}</p>
            <p><strong>Status:</strong> {action === 'ACCEPT' ? 'Offer Extended' : 'Candidate Shortlisted for Interview'}</p>
          </div>

          <Button
            onClick={() => router.push('/api/auth/signin')}
            className="w-full bg-brand-indigo hover:bg-brand-indigo-hover text-white font-bold h-11"
          >
            Sign In to Employer Portal <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Official SIWES Applicant Review
          </div>
          <h1 className="text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
            Review SIWES Placement Application
          </h1>
          <p className="text-sm text-zinc-500 max-w-lg mx-auto">
            You received this application for an Industrial Training (SIWES) attachment from a verified undergraduate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          {/* Applicant Info Card (Left Column) */}
          <div className="md:col-span-2 space-y-4">
            <Card className="bg-white dark:bg-zinc-900 border shadow-xs">
              <CardHeader className="pb-3 border-b">
                <Badge variant="outline" className="w-fit bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified Student
                </Badge>
                <CardTitle className="text-xl font-bold mt-2">
                  {details?.student.name}
                </CardTitle>
                <CardDescription className="text-xs">
                  {details?.student.discipline}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-xs">
                <div className="space-y-1">
                  <span className="text-zinc-400 font-medium">Institution</span>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    {details?.student.university}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-zinc-400 font-medium">Placement Role</span>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {details?.listing.title}
                  </p>
                </div>

                {details?.student.resumeUrl && (
                  <div className="pt-2">
                    <a
                      href={details.student.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-semibold underline"
                    >
                      <FileText className="w-4 h-4" />
                      View Student Resume / CV
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/60 rounded-xl text-xs text-blue-900 dark:text-blue-200 space-y-1">
              <p className="font-bold">What is Placely?</p>
              <p className="text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
                Placely is Nigeria's dedicated SIWES & Internship network. Claiming your company profile is 100% free and allows you to source, review, and hire top STEM students across Nigerian universities.
              </p>
            </div>
          </div>

          {/* Action & Account Claim Card (Right Column) */}
          <div className="md:col-span-3">
            <Card className="bg-white dark:bg-zinc-900 border shadow-md">
              <CardHeader className="pb-4 border-b">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Respond & Claim Company Profile
                </CardTitle>
                <CardDescription className="text-xs">
                  Choose your response to the student and create your login credentials.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleClaimSubmit} className="space-y-5">
                  {errorMsg && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 text-red-700 text-xs rounded-lg">
                      {errorMsg}
                    </div>
                  )}

                  {/* Action Selection */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Your Response to Applicant</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setAction('ACCEPT')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          action === 'ACCEPT'
                            ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 font-semibold ring-2 ring-blue-600/20'
                            : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:bg-zinc-50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
                          <UserCheck className="w-4 h-4 text-emerald-600" /> Accept for SIWES
                        </div>
                        <p className="text-[11px] text-zinc-500 font-normal">Extend placement offer to student</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAction('SHORTLIST')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          action === 'SHORTLIST'
                            ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 font-semibold ring-2 ring-blue-600/20'
                            : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:bg-zinc-50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
                          <Calendar className="w-4 h-4 text-blue-600" /> Interview Candidate
                        </div>
                        <p className="text-[11px] text-zinc-500 font-normal">Shortlist student for interview</p>
                      </button>
                    </div>
                  </div>

                  {/* Company Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="companyName" className="text-xs">Company Name</Label>
                      <Input
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        className="text-xs h-10"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="cacNumber" className="text-xs">CAC RC / Registration No. (Optional)</Label>
                      <Input
                        id="cacNumber"
                        placeholder="e.g. RC 1234567"
                        value={cacNumber}
                        onChange={(e) => setCacNumber(e.target.value)}
                        className="text-xs h-10"
                      />
                    </div>
                  </div>

                  {/* Account Credentials */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs">Work / Recruiter Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="text-xs h-10 font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="password" className="text-xs">Create Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Choose secure password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="text-xs h-10"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 text-sm shadow-md active:scale-98"
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
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClaimPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <ClaimPageContent />
    </Suspense>
  );
}
