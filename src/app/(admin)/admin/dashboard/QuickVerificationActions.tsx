'use client';

import * as React from 'react';
import Link from 'next/link';
import { ExternalLink, CheckCircle2, XCircle, FileText, ArrowRight } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { approveVerification, rejectVerification } from '../verifications/actions';
import type { PendingVerificationItem } from '../verifications/VerificationQueueTable';

interface QuickVerificationActionsProps {
  items: PendingVerificationItem[];
}

export function QuickVerificationActions({ items }: QuickVerificationActionsProps) {
  const [rejectingItem, setRejectingItem] = React.useState<PendingVerificationItem | null>(null);
  const [rejectNote, setRejectNote] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleApprove = async (id: string) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    const res = await approveVerification(id);
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMsg(res.error ?? 'Failed to approve request');
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingItem) return;
    if (!rejectNote.trim()) {
      setErrorMsg('Please enter a note explaining the rejection reason.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    const res = await rejectVerification(rejectingItem.id, rejectNote);
    setIsSubmitting(false);

    if (res.success) {
      setRejectingItem(null);
      setRejectNote('');
    } else {
      setErrorMsg(res.error ?? 'Failed to reject request');
    }
  };

  if (items.length === 0) {
    return (
      <div className="p-6 text-center bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-2">
        <CheckCircle2 className="h-7 w-7 text-emerald-500 mx-auto" />
        <p className="font-bold text-sm text-slate-900">All verifications cleared!</p>
        <p className="text-xs text-slate-500">
          No pending verification documents requiring administrative review.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-700 text-xs border-b border-red-100 font-semibold">
          {errorMsg}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/70 border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            <tr>
              <th className="py-3 px-5">Applicant</th>
              <th className="py-3 px-5">Document Type</th>
              <th className="py-3 px-5">Attachment</th>
              <th className="py-3 px-5 text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-5">
                  <div className="font-bold text-slate-900">{item.applicantName}</div>
                  <div className="text-[11px] text-slate-500">{item.applicantEmail}</div>
                </td>
                <td className="py-3.5 px-5">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.type === 'SCHOOL_ID'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {item.type === 'SCHOOL_ID' ? 'Student School ID' : 'Corporate CAC Doc'}
                  </span>
                </td>
                <td className="py-3.5 px-5">
                  <a
                    href={item.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-brand-indigo hover:text-brand-indigo-hover font-bold"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Inspect Doc ↗</span>
                  </a>
                </td>
                <td className="py-3.5 px-5 text-right">
                  <div className="inline-flex items-center justify-end gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          type="button"
                          className="px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all shadow-2xs disabled:opacity-50 inline-flex items-center gap-1"
                          disabled={isSubmitting}
                        >
                          <CheckCircle2 className="h-3 w-3" /> Approve
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-serif text-lg font-normal">
                            Approve Verification
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-xs text-slate-600 leading-relaxed">
                            Are you sure you want to approve this credential verification for {item.applicantName}? This will grant the verified badge.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-full text-xs font-bold">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleApprove(item.id)}
                            className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5"
                          >
                            Approve Verification
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <button
                      type="button"
                      className="px-3 py-1 rounded-full border border-rose-200 text-rose-700 hover:bg-rose-50 text-[11px] font-bold transition-colors inline-flex items-center gap-1"
                      onClick={() => setRejectingItem(item)}
                      disabled={isSubmitting}
                    >
                      <XCircle className="h-3 w-3" /> Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-50/70 border-t border-slate-100 text-center">
        <Link
          href="/admin/verifications"
          className="inline-flex items-center text-xs font-bold text-slate-700 hover:text-black gap-1"
        >
          View Full Verification Queue
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <Dialog open={!!rejectingItem} onOpenChange={(open) => !open && setRejectingItem(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-normal">
              Reject Verification Request
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600">
              Provide a constructive note explaining the rejection reason for {rejectingItem?.applicantName}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <label htmlFor="rejectNote" className="text-xs font-bold text-slate-700 block">
                Rejection Note / Feedback *
              </label>
              <textarea
                id="rejectNote"
                placeholder="e.g. Uploaded school ID image is blurry or expired. Please upload a clear photo of your student ID card or official admission letter."
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
              />
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              className="px-4 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              onClick={() => setRejectingItem(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold disabled:opacity-50"
              onClick={handleConfirmReject}
              disabled={isSubmitting || !rejectNote.trim()}
            >
              Confirm Rejection
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
