'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Dropzone } from '@/components/shared/Dropzone';
import { PendingVerificationBanner } from '@/components/shared/PendingVerificationBanner';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { saveEmployerProfile, uploadEmployerCac } from './actions';
import type { VerificationStatus } from '@/domain/value-objects/verification-status';
import {
  Building2,
  Globe,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertCircle,
  Save,
  ArrowRight,
} from 'lucide-react';

interface EmployerProfileFormProps {
  initialData?: {
    companyName?: string;
    cacNumber?: string;
    description?: string;
    logoUrl?: string;
    websiteUrl?: string;
    cacDocumentUrl?: string;
    verificationStatus?: VerificationStatus;
    adminNote?: string;
  };
}

export function EmployerProfileForm({ initialData }: EmployerProfileFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = React.useState({
    companyName: initialData?.companyName ?? '',
    cacNumber: initialData?.cacNumber ?? '',
    description: initialData?.description ?? '',
    logoUrl: initialData?.logoUrl ?? '',
    websiteUrl: initialData?.websiteUrl ?? '',
  });

  const status = initialData?.verificationStatus ?? 'PENDING';

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const res = await saveEmployerProfile(formData);

    setIsSaving(false);
    if (res.success) {
      setMessage({ type: 'success', text: 'Company profile updated successfully!' });
      router.refresh();
    } else {
      setMessage({ type: 'error', text: res.error ?? 'Failed to update company profile' });
    }
  };

  const handleCacUpload = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);

    const res = await uploadEmployerCac(fd);
    if (res.success && res.url) {
      setMessage({ type: 'success', text: 'CAC Document uploaded successfully for admin verification!' });
      router.refresh();
    } else {
      setMessage({ type: 'error', text: res.error ?? 'Failed to upload CAC document' });
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* ── Top Header Band ── */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Corporate Credentials
            </span>
            <VerificationBadge status={status} size="sm" showLabel />
          </div>
          <h1 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-slate-900">
            Company Profile &amp; CAC Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Maintain your verified corporate presence and attach official CAC registration documentation to post accredited SIWES placement openings.
          </p>
        </div>
      </div>

      {/* Verification Status Banner */}
      <PendingVerificationBanner status={status} adminNote={initialData?.adminNote} />

      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* ── 2-Column Form Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
        {/* Left Column (2 Cols): Company Info */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4"
          >
            <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
              <Building2 className="w-4.5 h-4.5 text-brand-indigo" />
              <div>
                <h2 className="font-display text-sm font-semibold text-slate-900">
                  Organization Details
                </h2>
                <p className="text-xs text-slate-500">
                  Visible to engineering students browsing placement openings.
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Official Corporate Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="e.g. Zenith Automation Systems Ltd."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo bg-slate-50/50 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    CAC / RC Registration Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cacNumber}
                    onChange={(e) => handleInputChange('cacNumber', e.target.value)}
                    placeholder="e.g. RC 1492084"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Company Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.websiteUrl}
                    onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                    placeholder="https://company.com"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Company Overview &amp; Industry Profile
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your company's core operations, engineering departments, industrial manufacturing processes, and how you train SIWES interns..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo bg-slate-50/50 leading-relaxed font-normal"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? 'Saving...' : 'Save Corporate Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (1 Col): CAC Document Upload */}
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="font-display text-xs font-semibold text-slate-900">
                CAC Certificate Upload
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload your official CAC Certificate of Incorporation or Status Report to receive the verified emerald corporate badge.
            </p>

            {initialData?.cacDocumentUrl ? (
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-900 truncate">CAC Uploaded ✅</span>
                <a
                  href={initialData.cacDocumentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-brand-indigo hover:underline shrink-0"
                >
                  View Document ↗
                </a>
              </div>
            ) : (
              <Dropzone
                onUpload={handleCacUpload}
                accept="application/pdf,image/*"
                label="Upload CAC Certificate (PDF or Image)"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
