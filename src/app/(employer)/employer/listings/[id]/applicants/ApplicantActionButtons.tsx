'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
      <span className="text-xs text-slate-500 font-medium">
        Final Status Reached
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
        <Button
          size="sm"
          disabled={isSubmitting}
          onClick={() => handleStatusChange('SHORTLISTED')}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-[4px] text-xs font-semibold px-3 py-1"
        >
          Shortlist Candidate
        </Button>
      )}

      {/* Offer action (Available when SHORTLISTED) */}
      {isShortlisted && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-[4px] text-xs font-semibold px-3 py-1"
            >
              Issue Offer →
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Send SIWES Placement Offer</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to issue a placement offer to this applicant? Sending an offer cannot be undone without the student declining.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleStatusChange('OFFERED')}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Confirm Offer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Decline action (Available when APPLIED, SHORTLISTED, or OFFERED) */}
      {(isApplied || isShortlisted || isOffered) && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              disabled={isSubmitting}
              className="border-rose-200 text-rose-700 hover:bg-rose-50 rounded-[4px] text-xs font-medium px-3 py-1"
            >
              Decline
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Decline Application</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to decline this student&apos;s application? The student will be notified via email.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleStatusChange('DECLINED')}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                Decline Candidate
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
