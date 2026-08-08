import React from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, ArrowRight, Clock, Sparkles } from "lucide-react";

export interface DashboardActionBannerProps {
  offeredCount: number;
  offeredCompanyName?: string;
  offeredApplicationId?: string;
  isVerified: boolean;
  verificationStatus: string;
  profileCompleteness: number;
}

export function DashboardActionBanner({
  offeredCount,
  offeredCompanyName,
  offeredApplicationId,
  isVerified,
  verificationStatus,
  profileCompleteness,
}: DashboardActionBannerProps) {
  // If an offer is received, this is priority #1
  if (offeredCount > 0) {
    return (
      <div className="rounded-[18px] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-400/40 shadow-xs">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0 text-amber-600">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                Action Required
              </span>
              <span className="text-xs text-amber-800 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 48h Response Window
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-900 mt-1">
              You received an official SIWES placement offer {offeredCompanyName ? `from ${offeredCompanyName}` : ""}!
            </p>
            <p className="text-xs text-slate-600">
              Review compensation, placement location, and accept to generate your official university acceptance letter.
            </p>
          </div>
        </div>

        <Link
          href={offeredApplicationId ? `/applications/${offeredApplicationId}` : "/applications"}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shrink-0 shadow-sm w-full sm:w-auto"
        >
          Review Offer <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // If profile completeness is below 50%
  if (profileCompleteness < 50) {
    return (
      <div className="rounded-[18px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-indigo-50/60 border border-indigo-200/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 text-indigo-600">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-indigo-950">
              Boost your profile to 50%+ to unlock direct placement applications
            </p>
            <p className="text-xs text-indigo-700">
              Add your CV, CGPA, and discipline technical skills so top engineering employers can find you.
            </p>
          </div>
        </div>
        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 shrink-0"
        >
          Complete Profile <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // If unverified student ID
  if (!isVerified) {
    return (
      <div className="rounded-[18px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-slate-700">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">
              Account Verification Status: {verificationStatus}
            </p>
            <p className="text-xs text-slate-600">
              Upload your valid University School ID or Admission Letter to receive the verified badge.
            </p>
          </div>
        </div>
        <Link
          href="/profile/settings"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-indigo-600 shrink-0"
        >
          Upload ID <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return null;
}
