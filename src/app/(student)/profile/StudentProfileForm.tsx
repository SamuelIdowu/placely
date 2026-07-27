'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dropzone } from '@/components/shared/Dropzone';
import { PendingVerificationBanner } from '@/components/shared/PendingVerificationBanner';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { saveStudentProfile, uploadStudentDocument } from './actions';
import type { VerificationStatus } from '@/domain/value-objects/verification-status';
import { getNigerianUniversities, NUC_ENGINEERING_COURSES } from '@/domain/value-objects/academic';

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
      setMessage({ type: 'error', text: 'Please select or specify your Engineering Discipline / Course.' });
      setIsSaving(false);
      return;
    }

    const parsedCgpa = formData.cgpa ? parseFloat(formData.cgpa) : undefined;

    const res = await saveStudentProfile({
      university: finalUni,
      discipline: finalDisc,
      cgpa: parsedCgpa,
      resumeUrl: formData.resumeUrl,
      linkedinUrl: formData.linkedinUrl,
      portfolioUrl: formData.portfolioUrl,
      bio: formData.bio,
    });

    setIsSaving(false);
    if (res.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      router.refresh();
    } else {
      setMessage({ type: 'error', text: res.error ?? 'Failed to update profile' });
    }
  };

  const handleFileUpload = async (file: File, type: 'RESUME' | 'SCHOOL_ID') => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', type);

    const res = await uploadStudentDocument(fd);
    if (res.success && res.url) {
      if (type === 'RESUME') {
        setFormData((prev) => ({ ...prev, resumeUrl: res.url }));
      }
      setMessage({ type: 'success', text: `${type === 'RESUME' ? 'Resume' : 'School ID'} uploaded successfully!` });
      router.refresh();
    } else {
      throw new Error(res.error ?? 'Failed to upload document');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header with Verification Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight">Student Profile Setup</h1>
            {status === 'VERIFIED' && <VerificationBadge size="md" showLabel />}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Complete your academic details and upload documents to get verified for SIWES placements.
          </p>
        </div>
      </div>

      {/* Verification Status Banner */}
      <PendingVerificationBanner status={status} adminNote={initialData?.adminNote} />

      {/* Completeness Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-semibold">Profile Completeness</CardTitle>
            <span className="text-sm font-bold text-primary">{completeness}%</span>
          </div>
          <CardDescription>A completed profile improves your visibility to employers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={completeness} className="h-2" />
        </CardContent>
      </Card>

      {message && (
        <div
          className={`p-3 rounded text-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Multi-section Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Academic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">1. Academic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="university">University / Institution *</Label>
                <select
                  id="university"
                  value={selectedUniversity}
                  onChange={(e) => setSelectedUniversity(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  <option value="">Select University / Institution</option>
                  {universities.map((uni) => (
                    <option key={uni} value={uni}>
                      {uni}
                    </option>
                  ))}
                  <option value="Other">Other / Institution Not Listed</option>
                </select>

                {selectedUniversity === 'Other' && (
                  <Input
                    placeholder="Enter institution name"
                    value={customUniversity}
                    onChange={(e) => setCustomUniversity(e.target.value)}
                    required
                    className="mt-2"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="discipline">Field of Study / Discipline *</Label>
                <select
                  id="discipline"
                  value={selectedDiscipline}
                  onChange={(e) => setSelectedDiscipline(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  <option value="">Select Engineering Course</option>
                  {NUC_ENGINEERING_COURSES.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>

                {selectedDiscipline === 'Other / Discipline Not Listed' && (
                  <Input
                    placeholder="Enter engineering course name"
                    value={customDiscipline}
                    onChange={(e) => setCustomDiscipline(e.target.value)}
                    required
                    className="mt-2"
                  />
                )}
              </div>
            </div>

            <div className="space-y-2 max-w-xs">
              <Label htmlFor="cgpa">Current CGPA (out of 5.0)</Label>
              <Input
                id="cgpa"
                type="number"
                step="0.01"
                min="0"
                max="5"
                placeholder="e.g. 4.25"
                value={formData.cgpa}
                onChange={(e) => handleInputChange('cgpa', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Links & Bio */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2. Links & Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn Profile URL</Label>
                <Input
                  id="linkedinUrl"
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedinUrl}
                  onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolioUrl">Portfolio / GitHub URL</Label>
                <Input
                  id="portfolioUrl"
                  type="url"
                  placeholder="https://github.com/username"
                  value={formData.portfolioUrl}
                  onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio & Career Objectives</Label>
              <Textarea
                id="bio"
                rows={4}
                placeholder="Share your interests, key skills, and goals for your SIWES placement..."
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Verification & Resume Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">3. Document Uploads</CardTitle>
            <CardDescription>
              Upload your School ID to verify your student status, and your CV / Resume for applications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Dropzone
              label="School ID Card (Required for Verification)"
              description="Upload your valid Student ID card (PDF, PNG, JPG up to 5MB)"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onUpload={(file) => handleFileUpload(file, 'SCHOOL_ID')}
            />

            <Dropzone
              label="CV / Resume"
              description="Upload your latest CV/Resume for employers (PDF up to 5MB)"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              existingUrl={formData.resumeUrl}
              onUpload={(file) => handleFileUpload(file, 'RESUME')}
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving} className="min-w-[140px]">
            {isSaving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
}
