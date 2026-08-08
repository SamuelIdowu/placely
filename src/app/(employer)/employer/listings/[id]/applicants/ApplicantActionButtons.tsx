'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { updateApplicantStatusAction } from './actions';
import type { ApplicationStatus } from '@/domain/entities/application';
import { CheckCircle2, XCircle, Sparkles, Send } from 'lucide-react';

export function ApplicantActionButtons({
  applicationId,
  listingId,
  currentStatus,
}: {
  applicationId: string;
  listingId: string;
  currentStatus: ApplicationStatus;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStatusChange(newStatus: ApplicationStatus) {
    setIsSubmitting(true);
    setError(null);

    const res = await updateApplicantStatusAction(applicationId, listingId, newStatus);

    if (!res.success) {
      setError(res.error ?? 'Status update failed');
      setIsSubmitting(false);
    } else {
      window.location.reload();
    }
  }

  const isApplied = currentStatus === 'APPLIED';
  const isShortlisted = currentStatus === 'SHORTLISTED';
  const isOffered = currentStatus === 'OFFERED';
  const isTerminal = currentStatus === 'ACCEPTED' || currentStatus === 'DECLINED';

  if (isTerminal) {
    return (
      <span className="text-xs text-slate-500 font-bold uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">
        Placement {currentStatus}
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {error && (
        <span className="text-xs text-rose-600 block w-full">{error}</span>
      )}

      {/* Shortlist action (Available when APPLIED) */}
      {isApplied && (
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleStatusChange('SHORTLISTED')}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1863dc] hover:bg-[#1451b8] text-white text-xs font-bold transition-all shadow-2xs disabled:opacity-50"
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Shortlist for Interview
        </button>
      )}

      {/* Offer action (Available when SHORTLISTED) */}
      {isShortlisted && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold transition-all shadow-2xs disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" /> Issue 6-Month Placement Offer →
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-[24px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-serif text-xl font-normal">
                Extend SIWES Placement Offer
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to issue an official 6-month placement offer to this student? The student will have 48 hours to accept or decline the offer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full text-xs font-bold">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleStatusChange('OFFERED')}
                className="rounded-full bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold px-5"
              >
                Confirm Placement Offer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Decline action */}
      {(isApplied || isShortlisted || isOffered) && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" /> Decline
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-[24px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-serif text-xl font-normal">
                Decline Candidate Application
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to decline this student&apos;s application? The student will be notified promptly.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full text-xs font-bold">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleStatusChange('DECLINED')}
                className="rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5"
              >
                Confirm Decline
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
