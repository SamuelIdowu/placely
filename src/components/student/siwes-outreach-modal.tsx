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
import {
  Send,
  Download,
  Copy,
  CheckCircle2,
  Building2,
  FileText,
  Mail,
  Loader2,
  Sparkles,
  ArrowRight,
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-7 bg-white rounded-2xl border-slate-200/90 shadow-xl">
        <DialogHeader className="pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-indigo-light text-brand-indigo border border-indigo-100">
              <Sparkles className="w-2.5 h-2.5" /> SIWES Application Engine
            </span>
            <span className="text-xs text-slate-400 font-medium">Official Industrial Attachment</span>
          </div>
          <DialogTitle className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-slate-900 mt-1.5 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-indigo" />
            Apply to {targetCompany || 'Target Employer'}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-slate-500">
            Generate a standardized Nigerian SIWES Industrial Attachment letter formatted for your university and discipline.
          </DialogDescription>
        </DialogHeader>

        {isDispatched ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-normal text-slate-900">Application Dispatched</h3>
              <p className="text-slate-500 max-w-md mx-auto text-xs sm:text-sm">
                Your official SIWES application letter, student profile credentials, and 1-click employer response link have been delivered to <strong>{email}</strong>.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 max-w-md mx-auto text-xs text-slate-600 text-left space-y-1">
              <p className="font-semibold text-slate-900">💡 What happens next?</p>
              <p className="text-[11px] leading-relaxed text-slate-500">
                When company HR opens the email, they can accept your placement or schedule an interview with 1 click. You will receive an instant dashboard update and email notification.
              </p>
            </div>
            <div className="pt-2 flex justify-center">
              <Button
                onClick={onClose}
                className="bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-semibold rounded-full px-6 h-10 shadow-xs cursor-pointer"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 pt-2">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <Label htmlFor="companyEmail" className="text-xs font-semibold text-slate-700">
                  HR / Recruiter Email Address
                </Label>
                <Input
                  id="companyEmail"
                  placeholder="hr@company.com or careers@company.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-xs h-9.5 font-mono bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="matricNumber" className="text-xs font-semibold text-slate-700">
                  Matriculation / Student ID No.
                </Label>
                <Input
                  id="matricNumber"
                  placeholder="e.g. 19/52HA042 or MAT180293"
                  value={matricNumber}
                  onChange={(e) => setMatricNumber(e.target.value)}
                  className="text-xs h-9.5 bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="duration" className="text-xs font-semibold text-slate-700">
                  Placement Duration
                </Label>
                <select
                  id="duration"
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  className="w-full h-9.5 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-800 focus:outline-none focus:border-brand-indigo"
                >
                  <option value={6}>6 Months (Standard University SIWES)</option>
                  <option value={3}>3 Months (Short Attachment / Polytechnic)</option>
                  <option value={12}>12 Months (Industrial Internship)</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="recipientTitle" className="text-xs font-semibold text-slate-700">
                  Attention (Recipient Line)
                </Label>
                <Input
                  id="recipientTitle"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="The Human Resources Manager"
                  className="text-xs h-9.5 bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                />
              </div>
            </div>

            <Tabs defaultValue="preview" className="w-full">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <TabsList className="bg-slate-100 p-1 rounded-xl">
                  <TabsTrigger value="preview" className="text-xs font-semibold rounded-lg flex items-center gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-2xs">
                    <FileText className="w-3.5 h-3.5" />
                    Letter Preview
                  </TabsTrigger>
                  <TabsTrigger value="plain" className="text-xs font-semibold rounded-lg flex items-center gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-2xs">
                    <Mail className="w-3.5 h-3.5" />
                    Raw Text
                  </TabsTrigger>
                </TabsList>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyText}
                    className="h-8 gap-1 text-xs rounded-full border-slate-200 text-slate-700 hover:bg-slate-500 cursor-pointer"
                  >
                    {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy Text'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrintPdf}
                    className="h-8 gap-1 text-xs rounded-full border-slate-200 text-slate-700 hover:bg-slate-500 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    Print / PDF
                  </Button>
                </div>
              </div>

              <TabsContent value="preview" className="mt-3">
                {isLoadingPreview ? (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-indigo" />
                    <p className="text-xs">Formatting SIWES application letter...</p>
                  </div>
                ) : (
                  <div
                    className="p-6 bg-slate-50/70 border border-slate-200/80 rounded-xl max-h-72 overflow-y-auto text-xs leading-relaxed font-sans shadow-inner"
                    dangerouslySetInnerHTML={{ __html: letterHtml }}
                  />
                )}
              </TabsContent>

              <TabsContent value="plain" className="mt-3">
                <textarea
                  readOnly
                  value={letterText}
                  className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-700 resize-none focus:outline-none"
                />
              </TabsContent>
            </Tabs>

            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[11px] text-slate-400">
                🔒 Application tracks in your dashboard and links directly to your verified profile.
              </p>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="ghost"
                  onClick={onClose}
                  disabled={isDispatching}
                  className="text-xs text-slate-500 hover:text-slate-800 rounded-full w-full sm:w-auto cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendViaPlacely}
                  disabled={isDispatching || !email}
                  className="bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-semibold rounded-full px-5 h-9.5 gap-1.5 shadow-xs w-full sm:w-auto cursor-pointer"
                >
                  {isDispatching ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Dispatching Letter...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
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
