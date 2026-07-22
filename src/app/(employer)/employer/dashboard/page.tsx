// app/(employer)/employer/dashboard/page.tsx
import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'Employer Dashboard — Placely' };

export default async function EmployerDashboardPage() {
  const session = await auth();
  if (!session || session.user.role !== 'EMPLOYER') redirect('/sign-in');

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Employer Dashboard</h1>
      <p className="text-gray-500 mt-2">{session.user.email}</p>
      {/* Listing stats + applicant pipeline — Sprint 2 */}
    </main>
  );
}
