import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { employerProfileRepo } from '@/lib/container';
import { EmployerSettingsForm } from '../EmployerSettingsForm';

export const metadata: Metadata = { title: 'Account Settings — Placely' };

export default async function EmployerSettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/sign-in');

  const profile = await employerProfileRepo.findByUserId(session.user.id);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Account Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account preferences, notifications, and security settings.
        </p>
      </div>

      <EmployerSettingsForm
        email={session.user.email || ''}
        companyName={profile?.companyName || 'Your Company'}
      />
    </div>
  );
}
