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
import { respondToOfferAction } from './actions';

export function OfferResponseButtons({ applicationId }: { applicationId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDecision(decision: 'ACCEPTED' | 'DECLINED') {
    setIsSubmitting(true);
    setError(null);

    const res = await respondToOfferAction(applicationId, decision);

    if (!res.success) {
      setError(res.error ?? 'Failed to update offer response');
      setIsSubmitting(false);
    } else {
      window.location.reload();
    }
  }

  return (
    <div className="space-y-4 rounded-md border border-emerald-200 bg-emerald-50/60 p-6">
      <div>
        <h3 className="text-lg font-bold text-emerald-950">
          🎉 SIWES Placement Offer Issued
        </h3>
        <p className="text-sm text-emerald-800 mt-1">
          The employer has selected you for this placement. Please accept or decline the offer. Accepting locks in your placement commitment.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-rose-50 border border-rose-200 p-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-[4px] font-semibold px-6"
            >
              Accept Offer ✓
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Accept SIWES Placement Offer</AlertDialogTitle>
              <AlertDialogDescription>
                By accepting this offer, you confirm your acceptance of this SIWES placement. The employer will be notified immediately.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDecision('ACCEPTED')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Confirm Acceptance
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              disabled={isSubmitting}
              className="border-rose-200 text-rose-700 hover:bg-rose-50 rounded-[4px] font-semibold px-6"
            >
              Decline Offer
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Decline SIWES Placement Offer</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to decline this placement offer? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Offer</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDecision('DECLINED')}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                Decline Offer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
