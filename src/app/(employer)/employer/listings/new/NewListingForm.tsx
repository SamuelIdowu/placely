'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { DISCIPLINES } from '@/lib/constants';
import { createListingAction } from './actions';
import {
  Briefcase,
  MapPin,
  Building2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface NewListingFormProps {
  isVerified: boolean;
}

export function NewListingForm({ isVerified }: NewListingFormProps) {
  const router = useRouter();
  const [selectedDisciplines, setSelectedDisciplines] = React.useState<string[]>([]);
  const [isRemote, setIsRemote] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const toggleDiscipline = (disc: string) => {
    setSelectedDisciplines((prev) =>
      prev.includes(disc) ? prev.filter((d) => d !== disc) : [...prev, disc]
    );
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isVerified) {
      setError('You must have verified CAC status before posting a SIWES listing.');
      return;
    }

    if (selectedDisciplines.length === 0) {
      setError('Please select at least one target engineering discipline.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    selectedDisciplines.forEach((d) => formData.append('disciplines', d));
    formData.set('isRemote', isRemote ? 'true' : 'false');

    const res = await createListingAction(formData);
    setLoading(false);

    if (res.success) {
      router.push('/employer/dashboard');
    } else {
      setError(res.error || 'Failed to create listing');
    }
  }

  return (
    <div className="space-y-6">
      {/* CAC Verification Warning if not yet verified */}
      {!isVerified && (
        <div className="rounded-[18px] border border-amber-300 bg-amber-50/80 p-5 flex items-start gap-3 text-amber-950 shadow-2xs">
          <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h3 className="font-bold text-xs">CAC Verification Required to Publish</h3>
            <p className="text-xs text-amber-800">
              Only CAC-verified corporate organizations can publish active SIWES placement openings to protect university engineering undergraduates from unverified workplaces.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 text-xs font-semibold rounded-xl bg-red-50 text-red-800 border border-red-200">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-2xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Role Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-xs font-bold text-slate-700 block">
              Placement Position Title *
            </label>
            <input
              id="title"
              name="title"
              placeholder="e.g. Mechatronics & Robotics SIWES Intern (3–6 Months)"
              required
              minLength={3}
              maxLength={120}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo bg-slate-50/50 font-medium"
            />
          </div>

          {/* Section 2: Role Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-xs font-bold text-slate-700 block">
              Placement Description &amp; Responsibilities *
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Detail the engineering tasks, industrial exposure, workshop equipment/tools (e.g. MATLAB, PLC, CAD, Python), and training mentorship provided during this SIWES attachment..."
              required
              minLength={20}
              rows={6}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo bg-slate-50/50 leading-relaxed font-normal"
            />
          </div>

          {/* Section 3: Target Disciplines */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Target Engineering Disciplines *
              </label>
              <span className="text-[11px] text-slate-400">
                Select all accredited courses that qualify
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {DISCIPLINES.map((disc) => {
                const checked = selectedDisciplines.includes(disc);
                return (
                  <button
                    key={disc}
                    type="button"
                    onClick={() => toggleDiscipline(disc)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                      checked
                        ? 'bg-brand-indigo-light border-brand-indigo text-indigo-950 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] shrink-0 ${
                        checked ? 'bg-brand-indigo text-white' : 'border border-slate-300'
                      }`}
                    >
                      {checked && '✓'}
                    </div>
                    <span className="truncate">{disc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Location & Work Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="location" className="text-xs font-bold text-slate-700 block">
                Primary Office / Facility Location *
              </label>
              <div className="relative">
                <input
                  id="location"
                  name="location"
                  placeholder="e.g. Ikeja Industrial Estate, Lagos"
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo bg-slate-50/50 font-medium pl-8"
                />
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="flex items-end pb-1.5">
              <button
                type="button"
                onClick={() => setIsRemote((prev) => !prev)}
                className={`w-full p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                  isRemote
                    ? 'bg-brand-indigo-light border-brand-indigo text-indigo-950'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span>Hybrid / Remote Flexibility</span>
                <span
                  className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${
                    isRemote ? 'bg-brand-indigo text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {isRemote ? 'YES' : 'ON-SITE ONLY'}
                </span>
              </button>
            </div>
          </div>

          {/* Submission Bar */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isVerified}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-brand-indigo hover:bg-brand-indigo-hover text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Publish SIWES Listing <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
