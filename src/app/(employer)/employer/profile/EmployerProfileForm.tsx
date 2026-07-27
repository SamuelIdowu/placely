'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dropzone } from '@/components/shared/Dropzone';
import { PendingVerificationBanner } from '@/components/shared/PendingVerificationBanner';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { saveEmployerProfile, uploadEmployerCac } from './actions';
import type { VerificationStatus } from '@/domain/value-objects/verification-status';

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
      setMessage({ type: 'success', text: 'CAC Document uploaded successfully for verification!' });
      router.refresh();
    } else {
      throw new Error(res.error ?? 'Failed to upload CAC document');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header with Verification Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight">Company Profile & Verification</h1>
            {status === 'VERIFIED' && <VerificationBadge size="md" showLabel />}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Setup your company details and upload CAC documents to verify your account and post placement listings.
          </p>
        </div>
      </div>

      {/* Verification Status Banner */}
      <PendingVerificationBanner status={status} adminNote={initialData?.adminNote} />

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

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Company Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">1. Company Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Registered Company Name *</Label>
                <Input
                  id="companyName"
                  required
                  placeholder="e.g. Acme Technologies Ltd"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cacNumber">CAC Registration Number (RC/BN) *</Label>
                <Input
                  id="cacNumber"
                  required
                  placeholder="e.g. RC1234567"
                  value={formData.cacNumber}
                  onChange={(e) => handleInputChange('cacNumber', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Company Website URL</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  placeholder="https://company.com"
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoUrl">Company Logo URL</Label>
                <Input
                  id="logoUrl"
                  type="url"
                  placeholder="https://company.com/logo.png"
                  value={formData.logoUrl}
                  onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Company Description & Industry Overview</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Briefly describe your company, mission, and the types of SIWES placement opportunities you offer..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: CAC Document Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2. Corporate Affairs Commission (CAC) Verification</CardTitle>
            <CardDescription>
              Upload your CAC Certificate of Incorporation or Status Report to verify your organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dropzone
              label="CAC Certificate Document *"
              description="Upload CAC registration document (PDF, PNG, JPG up to 5MB)"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              existingUrl={initialData?.cacDocumentUrl}
              onUpload={handleCacUpload}
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
