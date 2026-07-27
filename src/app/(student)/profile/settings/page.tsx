// app/(student)/profile/settings/page.tsx

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { studentProfileRepo, verificationRepo } from '@/lib/container';
import { StudentProfileForm } from '../StudentProfileForm';

export const metadata: Metadata = { title: 'Profile Settings — Placely' };

export default async function StudentSettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const profile = await studentProfileRepo.findByUserId(session.user.id);
  const profileObj = profile?.toObject();

  let adminNote: string | undefined = undefined;
  if (profileObj?.id) {
    const vReq = await verificationRepo.findByStudentProfileId(profileObj.id);
    adminNote = vReq?.toObject().adminNote;
  }

  return (
    <main className="container max-w-5xl py-8 px-4 sm:px-6 space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Account & Profile Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your student profile information, CV, and academic credentials.
        </p>
      </div>

      <StudentProfileForm
        initialData={
          profileObj
            ? {
                university: profileObj.university,
                discipline: profileObj.discipline,
                cgpa: profileObj.cgpa,
                resumeUrl: profileObj.resumeUrl,
                linkedinUrl: profileObj.linkedinUrl,
                portfolioUrl: profileObj.portfolioUrl,
                bio: profileObj.bio,
                profileCompleteness: profileObj.profileCompleteness,
                verificationStatus: profileObj.verificationStatus,
                adminNote,
              }
            : undefined
        }
      />
    </main>
  );
}
