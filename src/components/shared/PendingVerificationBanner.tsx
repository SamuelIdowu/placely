import * as React from 'react';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { VerificationStatus } from '@/domain/value-objects/verification-status';

export interface PendingVerificationBannerProps {
  status: VerificationStatus;
  adminNote?: string;
  className?: string;
}

export function PendingVerificationBanner({
  status,
  adminNote,
  className,
}: PendingVerificationBannerProps) {
  if (status === 'VERIFIED') {
    return (
      <div
        className={cn(
          'flex items-start space-x-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900',
          className
        )}
      >
        <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <h4 className="font-semibold text-emerald-950">Verified Account</h4>
          <p className="mt-0.5 text-emerald-800">
            Your verification document has been approved by our administrators. You have full access to apply or post listings.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'REJECTED') {
    return (
      <div
        className={cn(
          'flex items-start space-x-3 p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-900',
          className
        )}
      >
        <XCircle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <h4 className="font-semibold text-rose-950">Verification Action Required</h4>
          <p className="mt-0.5 text-rose-800">
            Your verification document was rejected. Please review the reason below and upload an updated document.
          </p>
          {adminNote && (
            <div className="mt-2 p-2.5 bg-white/80 rounded border border-rose-200 text-xs font-mono text-rose-900">
              <strong>Admin Note:</strong> {adminNote}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-start space-x-3 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900',
        className
      )}
    >
      <Clock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div className="text-sm">
        <h4 className="font-semibold text-amber-950">Verification Pending</h4>
        <p className="mt-0.5 text-amber-800">
          Your document has been submitted and is currently under review by our admin team. Reviews typically take 24–48 hours.
        </p>
      </div>
    </div>
  );
}
