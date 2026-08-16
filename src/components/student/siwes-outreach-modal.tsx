'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Send,
  Download,
  Copy,
  CheckCircle2,
  Building2,
  FileText,
  Mail,
  Loader2,
  ExternalLink,
} from 'lucide-react';

export interface SiwesOutreachModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetCompany: string;
  targetEmail?: string | null;
  targetLocation?: string | null;
  listingId?: string;
  defaultDurationMonths?: number;
}

export function SiwesOutreachModal({
  isOpen,
  onClose,
  targetCompany,
  targetEmail: initialEmail,
  targetLocation,
  listingId,
  defaultDurationMonths = 6,
}: SiwesOutreachModalProps) {
  const [email, setEmail] = useState(initialEmail || '');
  const [durationMonths, setDurationMonths] = useState<number>(defaultDurationMonths);
  const [matricNumber, setMatricNumber] = useState('');
  const [contactPerson, setContactPerson] = useState('The Human Resources Manager / Head of Training');
  const [note, setNote] = useState('');

  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [letterHtml, setLetterHtml] = useState<string>('');
  const [letterText, setLetterText] = useState<string>('');

  const [isDispatching, setIsDispatching] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail || '');
      setIsDispatched(false);
      setErrorMsg(null);
      fetchLetterPreview();
    }
  }, [isOpen, targetCompany, durationMonths, matricNumber, contactPerson]);

  const fetchLetterPreview = async () => {
    setIsLoadingPreview(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/student/siwes-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetCompany,
          targetLocation,
          contactPerson,
          durationMonths,
          matricNumber,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to load preview');
      }

      const data = await res.json();
      setLetterHtml(data.letterHtml);
      setLetterText(data.letterText);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not generate preview');
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleSendViaPlacely = async () => {
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid company recipient email address');
      return;
    }

    setIsDispatching(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/student/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          targetCompany,
          targetEmail: email,
          targetLocation,
          durationMonths,
          matricNumber,
          note,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to send outreach');
      }

      setIsDispatched(true);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not send outreach email');
    } finally {
      setIsDispatching(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(letterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrintPdf = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(letterHtml);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 bg-white dark:bg-zinc-950">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              SIWES Placement Engine
            </Badge>
            <span className="text-xs text-zinc-500 font-mono">Official Outreach</span>
          </div>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 mt-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Apply to {targetCompany}
          </DialogTitle>
          <DialogDescription>
            Generate a standardized SIWES Introductory & Placement Application Letter customized for your academic department.
          </DialogDescription>
        </DialogHeader>

        {isDispatched ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">SIWES Application Dispatched!</h3>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto text-sm">
              Your official SIWES application letter, student profile, and 1-click employer claim link have been sent directly to <strong>{email}</strong>.
            </p>
            <div className="bg-zinc-50 dark:bg-zinc-900 border rounded-lg p-4 max-w-md mx-auto text-xs text-zinc-500 text-left">
              💡 <strong>What happens next?</strong> When the employer clicks their link, they can accept your placement or schedule an interview with 1 click, which automatically updates your Placement Dashboard.
            </div>
            <div className="pt-4 flex justify-center gap-3">
              <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
                Back to Opportunities
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pt-2">
            {errorMsg && (
              <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 text-red-700 dark:text-red-300 text-sm rounded-lg">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyEmail">HR / Recruiter Email</Label>
                <Input
                  id="companyEmail"
                  placeholder="hr@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="matricNumber">Matriculation / Student ID No.</Label>
                <Input
                  id="matricNumber"
                  placeholder="e.g. 19/52HA042"
                  value={matricNumber}
                  onChange={(e) => setMatricNumber(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">SIWES Duration</Label>
                <select
                  id="duration"
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  className="w-full h-10 px-3 border rounded-md text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                >
                  <option value={6}>6 Months (Standard University SIWES)</option>
                  <option value={3}>3 Months (Short Attachment / Polytechnic)</option>
                  <option value={12}>12 Months (Year in Industry)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipientTitle">Attention (Recipient Line)</Label>
                <Input
                  id="recipientTitle"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="The Human Resources Manager"
                />
              </div>
            </div>

            <Tabs defaultValue="preview" className="w-full">
              <div className="flex items-center justify-between border-b pb-2">
                <TabsList>
                  <TabsTrigger value="preview" className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    Letter Preview
                  </TabsTrigger>
                  <TabsTrigger value="plain" className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    Raw Text
                  </TabsTrigger>
                </TabsList>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyText}
                    className="h-8 gap-1 text-xs"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy Text'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrintPdf}
                    className="h-8 gap-1 text-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Print / PDF
                  </Button>
                </div>
              </div>

              <TabsContent value="preview" className="mt-4">
                {isLoadingPreview ? (
                  <div className="h-64 flex items-center justify-center text-zinc-400">
                    <Loader2 className="w-6 h-6 animate-spin mr-2 text-blue-600" />
                    Generating tailored SIWES letter...
                  </div>
                ) : (
                  <div
                    className="p-6 bg-zinc-50 dark:bg-zinc-900 border rounded-lg max-h-72 overflow-y-auto text-xs leading-relaxed font-sans shadow-inner"
                    dangerouslySetInnerHTML={{ __html: letterHtml }}
                  />
                )}
              </TabsContent>

              <TabsContent value="plain" className="mt-4">
                <textarea
                  readOnly
                  value={letterText}
                  className="w-full h-72 p-4 bg-zinc-50 dark:bg-zinc-900 border rounded-lg font-mono text-xs text-zinc-700 dark:text-zinc-300 resize-none"
                />
              </TabsContent>
            </Tabs>

            <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-zinc-500">
                🔒 Application tracks in your dashboard and includes your verified profile link.
              </p>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button variant="ghost" onClick={onClose} disabled={isDispatching} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button
                  onClick={handleSendViaPlacely}
                  disabled={isDispatching || !email}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full sm:w-auto font-semibold"
                >
                  {isDispatching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending Official Application...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Official SIWES Email
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
