// app/(student)/dashboard/page.tsx
// Protected: STUDENT role only (enforced in middleware.ts)

import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Student Dashboard — Placely',
};

export default async function StudentDashboardPage() {
  const session = await auth();
  if (!session || session.user.role !== 'STUDENT') redirect('/sign-in');

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Student Dashboard</h1>
      <p className="text-gray-500 mt-2">Welcome, {session.user.email}</p>
      {/* Dashboard widgets — Sprint 1 */}
    </main>
  );
}
