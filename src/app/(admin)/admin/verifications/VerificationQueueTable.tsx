'use client';

import * as React from 'react';
import Link from 'next/link';
import { ExternalLink, CheckCircle2, XCircle, FileText, Check, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { approveVerification, rejectVerification } from './actions';

export interface PendingVerificationItem {
  id: string;
  type: 'SCHOOL_ID' | 'CAC_DOCUMENT';
  documentUrl: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt: Date | string;
  applicantName: string;
  applicantEmail: string;
  entityName: string;
  profileId: string;
  profileType: 'STUDENT' | 'EMPLOYER';
}

interface VerificationQueueTableProps {
  items: PendingVerificationItem[];
  total: number;
  page: number;
  totalPages: number;
}

export function VerificationQueueTable({ items, total, page, totalPages }: VerificationQueueTableProps) {
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
      setErrorMsg(res.error ?? 'Failed to approve verification request');
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
      setErrorMsg(res.error ?? 'Failed to reject verification request');
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center bg-white border border-dashed border-slate-200 rounded-2xl shadow-2xs my-2">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full mb-2.5">
          <Check className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">All caught up!</h3>
        <p className="text-xs text-slate-500 mt-0.5 max-w-md">
          There are currently no pending verification requests in the queue.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="border border-slate-200/90 rounded-2xl overflow-x-auto bg-white shadow-2xs">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50/70 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100 font-bold">
            <tr>
              <th className="px-4 py-3 font-bold">Type</th>
              <th className="px-4 py-3 font-bold">Applicant / Company</th>
              <th className="px-4 py-3 font-bold">Institution / Details</th>
              <th className="px-4 py-3 font-bold">Submitted Date</th>
              <th className="px-4 py-3 font-bold">Document</th>
              <th className="px-4 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3.5 font-medium">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.type === 'SCHOOL_ID'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {item.type === 'SCHOOL_ID' ? 'Student ID' : 'CAC Document'}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="font-bold text-slate-900">{item.applicantName}</div>
                  <div className="text-[11px] text-slate-500">{item.applicantEmail}</div>
                </td>
                <td className="px-4 py-3.5 text-slate-600 font-medium">{item.entityName}</td>
                <td className="px-4 py-3.5 text-slate-500">
                  {new Date(item.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-4 py-3.5">
                  <a
                    href={item.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-brand-indigo hover:underline text-xs font-bold"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>View Document</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {/* Approve Dialog */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="default" size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-7.5 rounded-full px-3 text-[11px] font-bold shadow-2xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-serif text-lg font-normal">Approve Verification Request?</AlertDialogTitle>
                          <AlertDialogDescription className="text-xs text-slate-600 leading-relaxed">
                            This will verify <strong className="text-slate-900">{item.applicantName}</strong> ({item.entityName}) and grant verified badge status.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isSubmitting} className="rounded-full text-xs font-bold">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            disabled={isSubmitting}
                            onClick={() => handleApprove(item.id)}
                            className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4"
                          >
                            {isSubmitting ? 'Approving...' : 'Confirm Approve'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    {/* Reject Trigger */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setRejectingItem(item);
                        setRejectNote('');
                        setErrorMsg(null);
                      }}
                      className="text-rose-700 hover:bg-rose-50 border-rose-200 h-7.5 rounded-full px-3 text-[11px] font-bold"
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Reject
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Offset-based Pagination Controls (20 per page) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-2">
          <div className="text-xs text-slate-500">
            Showing page <span className="font-semibold text-slate-900">{page}</span> of{' '}
            <span className="font-semibold text-slate-900">{totalPages}</span> ({total} total items)
          </div>

          <div className="flex items-center space-x-2">
            {page > 1 ? (
              <Link
                href={`/admin/verifications?page=${page - 1}`}
                className="inline-flex items-center justify-center h-8 px-3 text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 rounded-full"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                Previous
              </Link>
            ) : (
              <Button variant="outline" size="sm" disabled className="rounded-full text-xs font-bold">
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                Previous
              </Button>
            )}

            {page < totalPages ? (
              <Link
                href={`/admin/verifications?page=${page + 1}`}
                className="inline-flex items-center justify-center h-8 px-3 text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 rounded-full"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            ) : (
              <Button variant="outline" size="sm" disabled className="rounded-full text-xs font-bold">
                Next
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Reject Reason Modal Dialog */}
      <Dialog open={!!rejectingItem} onOpenChange={(open) => !open && setRejectingItem(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-normal">Reject Verification Request</DialogTitle>
            <DialogDescription className="text-xs text-slate-600">
              Provide an administrative note explaining why the document for{' '}
              <strong className="text-slate-900">{rejectingItem?.applicantName}</strong> was rejected. This note will be sent via email.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label htmlFor="adminNote" className="text-xs font-bold text-slate-700">Rejection Reason (Admin Note) *</Label>
            <Textarea
              id="adminNote"
              rows={3}
              placeholder="e.g. Document image is blurry or expired. Please upload a clear copy of your Student ID."
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              className="text-xs rounded-xl"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectingItem(null)} disabled={isSubmitting} className="rounded-full text-xs font-bold">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmReject} disabled={isSubmitting} className="rounded-full text-xs font-bold">
              {isSubmitting ? 'Rejecting...' : 'Reject Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
