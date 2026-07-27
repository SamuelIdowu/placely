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
      <div className="flex flex-col items-center justify-center p-12 text-center bg-card border rounded-lg shadow-sm my-6">
        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full mb-3">
          <Check className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">All caught up!</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md">
          There are currently no pending verification requests in the queue.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="border rounded-lg overflow-x-auto bg-card shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground uppercase text-xs border-b">
            <tr>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Applicant / Company</th>
              <th className="px-4 py-3 font-semibold">Institution / Details</th>
              <th className="px-4 py-3 font-semibold">Submitted Date</th>
              <th className="px-4 py-3 font-semibold">Document</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium">
                  <Badge variant={item.type === 'SCHOOL_ID' ? 'secondary' : 'default'} className="text-xs">
                    {item.type === 'SCHOOL_ID' ? 'Student ID' : 'CAC Document'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-foreground">{item.applicantName}</div>
                  <div className="text-xs text-muted-foreground">{item.applicantEmail}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{item.entityName}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(item.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={item.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-primary hover:underline text-xs font-medium"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>View Document</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {/* Approve Dialog */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="default" size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-8 text-xs">
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          Approve
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Approve Verification Request?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will verify <strong className="text-foreground">{item.applicantName}</strong> ({item.entityName}) and grant verified badge status.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            disabled={isSubmitting}
                            onClick={() => handleApprove(item.id)}
                            className="bg-emerald-600 hover:bg-emerald-700"
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
                      className="text-destructive hover:bg-destructive/10 border-destructive/30 h-8 text-xs"
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

      {/* Offset-based Pagination Controls (20 per page) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-2">
          <div className="text-xs text-muted-foreground">
            Showing page <span className="font-semibold text-foreground">{page}</span> of{' '}
            <span className="font-semibold text-foreground">{totalPages}</span> ({total} total items)
          </div>

          <div className="flex items-center space-x-2">
            {page > 1 ? (
              <Link
                href={`/admin/verifications?page=${page - 1}`}
                className="inline-flex items-center justify-center h-8 px-3 text-xs font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-[4px]"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Link>
            ) : (
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            )}

            {page < totalPages ? (
              <Link
                href={`/admin/verifications?page=${page + 1}`}
                className="inline-flex items-center justify-center h-8 px-3 text-xs font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-[4px]"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Reject Reason Modal Dialog */}
      <Dialog open={!!rejectingItem} onOpenChange={(open) => !open && setRejectingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Verification Request</DialogTitle>
            <DialogDescription>
              Provide an administrative note explaining why the document for{' '}
              <strong className="text-foreground">{rejectingItem?.applicantName}</strong> was rejected. This note will be sent via email.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label htmlFor="adminNote">Rejection Reason (Admin Note) *</Label>
            <Textarea
              id="adminNote"
              rows={4}
              placeholder="e.g. Document image is blurry or expired. Please upload a clear copy of your Student ID."
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectingItem(null)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmReject} disabled={isSubmitting}>
              {isSubmitting ? 'Rejecting...' : 'Reject Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
