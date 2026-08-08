'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { CircularProgress } from '@/components/ui/circular-progress';
import { Dropzone } from '@/components/shared/Dropzone';
import { PendingVerificationBanner } from '@/components/shared/PendingVerificationBanner';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { saveStudentProfile, uploadStudentDocument } from './actions';
import type { VerificationStatus } from '@/domain/value-objects/verification-status';
import { getNigerianUniversities, NUC_ENGINEERING_COURSES } from '@/domain/value-objects/academic';
import {
  GraduationCap,
  FileText,
  ShieldCheck,
  Globe,
  Link2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Save,
  ArrowRight,
} from 'lucide-react';

interface StudentProfileFormProps {
  initialData?: {
    university?: string;
    discipline?: string;
    cgpa?: number;
    resumeUrl?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
    bio?: string;
    profileCompleteness?: number;
    verificationStatus?: VerificationStatus;
    adminNote?: string;
  };
}

export function StudentProfileForm({ initialData }: StudentProfileFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Instant synchronous Universities list
  const universities = React.useMemo(() => getNigerianUniversities(), []);

  // University dropdown state
  const initialUni = initialData?.university ?? '';
  const isKnownUni = universities.includes(initialUni);
  const [selectedUniversity, setSelectedUniversity] = React.useState<string>(
    initialUni ? (isKnownUni ? initialUni : 'Other') : ''
  );
  const [customUniversity, setCustomUniversity] = React.useState<string>(
    isKnownUni ? '' : initialUni
  );

  // Discipline dropdown state
  const initialDisc = initialData?.discipline ?? '';
  const isKnownDisc = (NUC_ENGINEERING_COURSES as readonly string[]).includes(initialDisc);
  const [selectedDiscipline, setSelectedDiscipline] = React.useState<string>(
    initialDisc ? (isKnownDisc ? initialDisc : 'Other / Discipline Not Listed') : ''
  );
  const [customDiscipline, setCustomDiscipline] = React.useState<string>(
    isKnownDisc ? '' : initialDisc
  );

  const [formData, setFormData] = React.useState({
    cgpa: initialData?.cgpa ? String(initialData.cgpa) : '',
    resumeUrl: initialData?.resumeUrl ?? '',
    linkedinUrl: initialData?.linkedinUrl ?? '',
    portfolioUrl: initialData?.portfolioUrl ?? '',
    bio: initialData?.bio ?? '',
  });

  const completeness = initialData?.profileCompleteness ?? 0;
  const status = initialData?.verificationStatus ?? 'PENDING';

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const finalUni = selectedUniversity === 'Other' ? customUniversity : selectedUniversity;
    const finalDisc = selectedDiscipline === 'Other / Discipline Not Listed' ? customDiscipline : selectedDiscipline;

    if (!finalUni) {
      setMessage({ type: 'error', text: 'Please select or specify your University / Institution.' });
      setIsSaving(false);
      return;
    }

    if (!finalDisc) {
      setMessage({ type: 'error', text: 'Please select or specify your Engineering Discipline.' });
      setIsSaving(false);
      return;
    }

    const parsedCgpa = formData.cgpa ? parseFloat(formData.cgpa) : undefined;

    try {
      const res = await saveStudentProfile({
        university: finalUni,
        discipline: finalDisc,
        cgpa: parsedCgpa,
        linkedinUrl: formData.linkedinUrl || undefined,
        portfolioUrl: formData.portfolioUrl || undefined,
        bio: formData.bio || undefined,
      });

      if (res.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to save profile.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'An unexpected error occurred while saving.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleIdUpload = async (file: File) => {
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', 'SCHOOL_ID');
      const res = await uploadStudentDocument(fd);
      if (res.success) {
        setMessage({ type: 'success', text: 'School ID uploaded for verification!' });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to submit document.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error uploading verification document.' });
    }
  };

  const handleResumeUpload = async (file: File) => {
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', 'RESUME');
      const res = await uploadStudentDocument(fd);
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, resumeUrl: res.url }));
        setMessage({ type: 'success', text: 'Resume PDF uploaded and attached to profile!' });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: res.error || 'Error uploading resume.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error attaching resume.' });
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* ── Top Header Bento Band ── */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 relative overflow-hidden">
        {/* Ambient subtle dot background */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#93939f]">
              Academic Credentials
            </span>
            <VerificationBadge status={status} size="sm" showLabel />
          </div>
          <h1 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-slate-900">
            Student Profile & SIWES Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Keep your academic records, technical portfolio, and school ID up to date to qualify for direct placement applications.
          </p>
        </div>

        {/* Circular Completeness Indicator */}
        <div className="flex items-center gap-3.5 bg-slate-50 border border-slate-200/80 p-3 sm:p-3.5 rounded-xl shrink-0 relative z-10">
          <CircularProgress
            value={completeness}
            size={60}
            strokeWidth={5}
            progressColor="text-[#4f46e5]"
            trackColor="text-slate-200"
          />
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Profile Score
            </span>
            <span className="text-sm font-bold text-slate-900 block">
              {completeness}% Complete
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold block">
              {completeness >= 50 ? 'Ready to Apply' : '50% Threshold Needed'}
            </span>
          </div>
        </div>
      </div>

      {/* Verification status feedback */}
      <PendingVerificationBanner
        status={status}
        adminNote={initialData?.adminNote}
      />

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

      {/* ── Main 2-Column Form Layout ── */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
        {/* Left Column (2 Cols): Academic Rigor & Portfolio Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Section 1: Academic Institution & Discipline */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
              <GraduationCap className="w-4.5 h-4.5 text-[#4f46e5]" />
              <div>
                <h2 className="font-display text-sm font-semibold text-slate-900">
                  Academic Institution & Course
                </h2>
                <p className="text-xs text-slate-500">
                  Select your university and accredited engineering track.
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              {/* University Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Nigerian University / Tertiary Institution *
                </label>
                <select
                  value={selectedUniversity}
                  onChange={(e) => setSelectedUniversity(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 text-slate-800 font-medium"
                >
                  <option value="">Select your Institution</option>
                  {universities.map((uni) => (
                    <option key={uni} value={uni}>
                      {uni}
                    </option>
                  ))}
                  <option value="Other">Other / Polytechnic / Not Listed</option>
                </select>
              </div>

              {selectedUniversity === 'Other' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Custom Institution Name *
                  </label>
                  <input
                    type="text"
                    value={customUniversity}
                    onChange={(e) => setCustomUniversity(e.target.value)}
                    placeholder="Enter official institution name..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                  />
                </div>
              )}

              {/* Discipline Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Engineering or Technology Discipline *
                </label>
                <select
                  value={selectedDiscipline}
                  onChange={(e) => setSelectedDiscipline(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 text-slate-800 font-medium"
                >
                  <option value="">Select your Course / Discipline</option>
                  {NUC_ENGINEERING_COURSES.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                  <option value="Other / Discipline Not Listed">Other / Not Listed</option>
                </select>
              </div>

              {selectedDiscipline === 'Other / Discipline Not Listed' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Custom Course Name *
                  </label>
                  <input
                    type="text"
                    value={customDiscipline}
                    onChange={(e) => setCustomDiscipline(e.target.value)}
                    placeholder="e.g. Mechatronics & Automation..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                  />
                </div>
              )}

              {/* Cumulative GPA */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Cumulative GPA (out of 5.0)
                  </label>
                  <span className="text-[11px] text-slate-400">Optional / Verified</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="1.0"
                  max="5.0"
                  value={formData.cgpa}
                  onChange={(e) => handleInputChange('cgpa', e.target.value)}
                  placeholder="e.g. 4.25"
                  className="w-full sm:w-48 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Technical Bio & Portfolio Links */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
              <Globe className="w-4.5 h-4.5 text-[#4f46e5]" />
              <div>
                <h2 className="font-display text-sm font-semibold text-slate-900">
                  Portfolio & Technical Competencies
                </h2>
                <p className="text-xs text-slate-500">
                  Showcase projects, GitHub repos, CAD portfolios, and technical interests.
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Technical Bio & Placement Objectives
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Summarize your engineering interests, hands-on lab work, CAD/programming experience, and what you aim to achieve during your SIWES attachment..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-blue-600" /> LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#4f46e5]" /> GitHub / Portfolio URL
                  </label>
                  <input
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                    placeholder="https://github.com/username or portfolio"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? 'Saving Changes...' : 'Save Profile Details'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Document Uploads & ID Verification */}
        <div className="lg:col-span-1 space-y-5">
          {/* School ID Card Verification */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="font-display text-xs font-semibold text-slate-900">
                School ID Verification
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload your official University School ID card or signed Admission Letter to receive the verified student badge.
            </p>

            <Dropzone
              onUpload={handleIdUpload}
              accept="image/*,application/pdf"
              label="Upload Student ID (JPG, PNG, PDF)"
            />
          </div>

          {/* Resume / CV PDF */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <FileText className="w-4 h-4 text-[#4f46e5]" />
              <h3 className="font-display text-xs font-semibold text-slate-900">
                Engineering Resume (PDF)
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Attach your updated resume or coursework portfolio for 1-click SIWES applications.
            </p>

            {formData.resumeUrl ? (
              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-indigo-900 truncate">Resume Attached ✅</span>
                <a
                  href={formData.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#4f46e5] hover:underline shrink-0"
                >
                  View PDF ↗
                </a>
              </div>
            ) : (
              <Dropzone
                onUpload={handleResumeUpload}
                accept="application/pdf"
                label="Upload Resume (PDF up to 5MB)"
              />
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
