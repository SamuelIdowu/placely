// app/(employer)/employer/profile/page.tsx

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { employerProfileRepo, verificationRepo } from '@/lib/container';
import { EmployerProfileForm } from './EmployerProfileForm';

export const metadata: Metadata = { title: 'Company Profile — Placely' };

export default async function EmployerProfilePage() {
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
    <main className="container max-w-5xl py-8 px-4 sm:px-6">
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
