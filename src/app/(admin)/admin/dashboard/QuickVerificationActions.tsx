'use client';

import * as React from 'react';
import Link from 'next/link';
import { ExternalLink, CheckCircle2, XCircle, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
      <div className="p-8 text-center bg-white border border-app-border rounded-lg">
        <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
        <p className="font-medium text-slate-800">All verifications clear!</p>
        <p className="text-xs text-muted-foreground mt-1">No pending verification documents require review.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-app-border rounded-lg shadow-sm overflow-hidden">
      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-700 text-xs border-b border-red-100">
          {errorMsg}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-app-border text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            <tr>
              <th className="py-3 px-4">Applicant</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Document</th>
              <th className="py-3 px-4 text-right">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-app-border">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-medium text-slate-900">{item.applicantName}</div>
                  <div className="text-xs text-muted-foreground">{item.applicantEmail}</div>
                </td>
                <td className="py-3 px-4">
                  <Badge variant={item.type === 'SCHOOL_ID' ? 'secondary' : 'outline'} className="text-[10px]">
                    {item.type === 'SCHOOL_ID' ? 'Student School ID' : 'Company CAC Doc'}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <a
                    href={item.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>View Doc</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center justify-end gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white h-7 text-xs px-2.5"
                          disabled={isSubmitting}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          Approve
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Approve Verification</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to approve this verification for {item.applicantName}?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleApprove(item.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Approve
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Button
                      size="sm"
                      variant="outline"
                      className="text-rose-600 border-rose-200 hover:bg-rose-50 h-7 text-xs px-2.5"
                      onClick={() => setRejectingItem(item)}
                      disabled={isSubmitting}
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1" />
                      Reject
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-50 border-t border-app-border text-center">
        <Link
          href="/admin/verifications"
          className="inline-flex items-center text-xs font-semibold text-slate-800 hover:text-black gap-1"
        >
          View Full Verification Queue
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <Dialog open={!!rejectingItem} onOpenChange={(open) => !open && setRejectingItem(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reject Verification Request</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting {rejectingItem?.applicantName}&apos;s verification.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="rejectNote">Rejection Reason</Label>
              <Textarea
                id="rejectNote"
                placeholder="e.g. Document image is unclear or unreadable"
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectingItem(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmReject}
              disabled={isSubmitting || !rejectNote.trim()}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
