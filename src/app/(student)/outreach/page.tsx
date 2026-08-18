'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SiwesLetterWysiwyg } from '@/components/student/siwes-letter-wysiwyg';
import {
  Building2,
  Send,
  Download,
  Copy,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Loader2,
  Clock,
  GraduationCap,
  FileText,
  Mail,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

function OutreachPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryCompany = searchParams.get('company') || '';
  const queryEmail = searchParams.get('email') || '';
  const queryLocation = searchParams.get('location') || '';
  const queryListingId = searchParams.get('listingId') || undefined;

  const [companyName, setCompanyName] = useState(queryCompany);
  const [email, setEmail] = useState(queryEmail);
  const [location, setLocation] = useState(queryLocation);
  const [durationMonths, setDurationMonths] = useState<number>(6);
  const [matricNumber, setMatricNumber] = useState('');
  const [contactPerson, setContactPerson] = useState('The Human Resources Manager / Head of Training');
  const [note, setNote] = useState('');

  const [letterHtml, setLetterHtml] = useState<string>('');
  const [isLoadingPreview, setIsLoadingPreview] = useState(true);
  const [isDispatching, setIsDispatching] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchLetterPreview();
  }, [companyName, location, durationMonths, matricNumber, contactPerson]);

  const fetchLetterPreview = async () => {
    setIsLoadingPreview(true);
    try {
      const res = await fetch('/api/student/siwes-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetCompany: companyName || 'Industrial Employer',
          targetLocation: location || 'Nigeria',
          contactPerson,
          durationMonths,
          matricNumber,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate preview');
      }

      const data = await res.json();
      setLetterHtml(data.letterHtml);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not format preview');
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleResetTemplate = () => {
    fetchLetterPreview();
  };

  const handleCopyText = () => {
    // Strip HTML tags for plain text clipboard copy
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = letterHtml;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';

    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrintPdf = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>SIWES Application Letter — ${companyName || 'Employer'}</title>
            <style>
              body { font-family: 'Times New Roman', Georgia, serif; padding: 40px; color: #111; line-height: 1.6; }
              p { margin: 12px 0; }
              h2, h3 { font-family: Arial, sans-serif; }
              @media print {
                body { padding: 0; }
              }
            </style>
          </head>
          <body>
            ${letterHtml}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid company recipient email address');
      return;
    }

    if (!companyName.trim()) {
      setErrorMsg('Please specify the recipient company name');
      return;
    }

    setIsDispatching(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/student/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: queryListingId,
          targetCompany: companyName,
          targetEmail: email,
          targetLocation: location,
          durationMonths,
          matricNumber,
          note,
          customLetterHtml: letterHtml,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to dispatch application email');
      }

      setIsDispatched(true);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'An error occurred while sending outreach');
    } finally {
      setIsDispatching(false);
    }
  };

  if (isDispatched) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-[24px] border border-emerald-200 p-8 sm:p-10 text-center space-y-6 shadow-md">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-slate-900">
              SIWES Application Dispatched!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Your customized SIWES placement letter and verified student credentials have been sent directly to <strong>{email}</strong> ({companyName}).
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-left text-xs space-y-2.5">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-indigo" /> What happens next?
            </p>
            <p className="text-slate-600 leading-relaxed">
              The company HR team has received your letter along with a secure 1-click decision link. When they accept your application or request an interview, your Placely Placement Dashboard will immediately update.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/applications"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-full bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-semibold shadow-xs"
            >
              Track in My Applications
            </Link>
            <Link
              href="/directory"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              Explore More Employers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-12">
      {/* ── Top Navigation & Actions Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Link
            href="/directory"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-indigo transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to IT Approved Directory
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Official Placement Outreach
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Sparkles className="w-2.5 h-2.5" /> Standard ITF Format
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-slate-900 mt-1">
            SIWES Letter Studio &amp; Outreach
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Review, format, edit, and dispatch your official University Industrial Training letter directly to company HR.
          </p>
        </div>

        {/* Quick Toolbar Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyText}
            className="text-xs font-semibold rounded-full border-slate-200 text-slate-700 hover:bg-slate-50 h-8 px-3.5 cursor-pointer gap-1.5 shadow-2xs"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Text'}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrintPdf}
            className="text-xs font-semibold rounded-full border-slate-200 text-slate-700 hover:bg-slate-50 h-8 px-3.5 cursor-pointer gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            Print / PDF
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-red-500 hover:text-red-800 font-bold ml-4">✕</button>
        </div>
      )}

      {/* ── Main Dual Column Studio ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* Left Column: Form Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-border shadow-2xs space-y-3.5">
            <div className="space-y-0.5 pb-2.5 border-b border-slate-100">
              <h2 className="font-serif text-base sm:text-lg font-normal text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-indigo" /> Destination &amp; Recipient
              </h2>
              <p className="text-xs text-slate-500">
                Configure recipient parameters to auto-adapt the letter text.
              </p>
            </div>

            <form onSubmit={handleDispatch} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="companyName" className="text-xs font-semibold text-slate-700">Company Name</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Flutterwave, Julius Berger"
                  required
                  className="text-xs h-9.5 bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs font-semibold text-slate-700">HR / Recruiter Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. careers@company.ng or hr@company.com"
                  required
                  className="text-xs h-9.5 font-mono bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="location" className="text-xs font-semibold text-slate-700">Location / State</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Lagos, Abuja"
                    className="text-xs h-9.5 bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="duration" className="text-xs font-semibold text-slate-700">Placement Duration</Label>
                  <select
                    id="duration"
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(Number(e.target.value))}
                    className="w-full h-9.5 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-800 focus:outline-none focus:border-brand-indigo"
                  >
                    <option value={6}>6 Months (University SIWES)</option>
                    <option value={3}>3 Months (Short Attachment)</option>
                    <option value={12}>12 Months (Industrial Internship)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="matricNumber" className="text-xs font-semibold text-slate-700">Matriculation / Student ID No.</Label>
                <Input
                  id="matricNumber"
                  value={matricNumber}
                  onChange={(e) => setMatricNumber(e.target.value)}
                  placeholder="e.g. 19/52HA042 or MAT180293"
                  className="text-xs h-9.5 bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="contactPerson" className="text-xs font-semibold text-slate-700">Attention (Addressee Line)</Label>
                <Input
                  id="contactPerson"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="The Human Resources Manager"
                  className="text-xs h-9.5 bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="note" className="text-xs font-semibold text-slate-700">Optional Cover Note / Portfolio Link</Label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Highlight key skills or relevant coursework (e.g. 'Experienced with React, Node.js and SQL...')"
                  rows={3}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl resize-none focus:bg-white focus:outline-none focus:border-brand-indigo text-slate-800"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isDispatching || !email || !companyName}
                  className="w-full bg-brand-indigo hover:bg-brand-indigo-hover text-white font-semibold rounded-full h-11 text-xs sm:text-sm shadow-xs cursor-pointer active:scale-98 gap-2"
                >
                  {isDispatching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Dispatching Verified Email...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Dispatch Verified Application Email
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          <div className="p-4 rounded-2xl bg-brand-indigo-light/40 border border-indigo-100 text-xs text-slate-700 space-y-1.5">
            <p className="font-bold text-brand-indigo flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> ITF &amp; University Compliant
            </p>
            <p className="text-[11px] leading-relaxed text-slate-600">
              Letters generated by Placely contain your verified matriculation details and link directly to your digital credential profile, facilitating quick review by corporate HR.
            </p>
          </div>
        </div>

        {/* Right Column: WYSIWYG Editor Canvas (7 cols) */}
        <div className="lg:col-span-7 h-full">
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Interactive Document Canvas (Directly Editable)
              </span>
              <span className="text-[11px] text-slate-400">
                Click anywhere on the paper to type or rephrase
              </span>
            </div>

            <SiwesLetterWysiwyg
              initialHtml={letterHtml}
              onChange={(newHtml) => setLetterHtml(newHtml)}
              onReset={handleResetTemplate}
              isLoading={isLoadingPreview}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OutreachPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-indigo" />
        <p className="text-xs font-semibold">Opening SIWES Letter Studio...</p>
      </div>
    }>
      <OutreachPageContent />
    </Suspense>
  );
}
