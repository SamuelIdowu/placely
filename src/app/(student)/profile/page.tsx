// app/(student)/profile/page.tsx

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { studentProfileRepo, verificationRepo } from '@/lib/container';
import { StudentProfileForm } from './StudentProfileForm';

export const metadata: Metadata = { title: 'My Profile — Placely' };

export default async function StudentProfilePage() {
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
    <div className="max-w-5xl mx-auto">
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
    </div>
  );
}
