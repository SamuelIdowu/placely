// app/(employer)/employer/profile/settings/page.tsx

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { employerProfileRepo, verificationRepo } from '@/lib/container';
import { EmployerProfileForm } from '../EmployerProfileForm';

export const metadata: Metadata = { title: 'Company Settings — Placely' };

export default async function EmployerSettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const profile = await employerProfileRepo.findByUserId(session.user.id);
  const profileObj = profile?.toObject();

  let cacDocumentUrl: string | undefined = undefined;
  let adminNote: string | undefined = undefined;

  if (profileObj?.id) {
    const vReq = await verificationRepo.findByEmployerProfileId(profileObj.id);
    if (vReq) {
      const vObj = vReq.toObject();
      cacDocumentUrl = vObj.documentUrl;
      adminNote = vObj.adminNote;
    }
  }

  return (
    <main className="container max-w-5xl py-8 px-4 sm:px-6 space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Company Profile & Verification Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update your corporate details, company logo, and CAC verification documents.
        </p>
      </div>

      <EmployerProfileForm
        initialData={
          profileObj
            ? {
                companyName: profileObj.companyName,
                cacNumber: profileObj.cacNumber,
                description: profileObj.description,
                logoUrl: profileObj.logoUrl,
                websiteUrl: profileObj.websiteUrl,
                cacDocumentUrl,
                verificationStatus: profileObj.verificationStatus,
                adminNote,
              }
            : undefined
        }
      />
    </main>
  );
}
