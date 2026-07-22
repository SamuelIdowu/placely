// app/(admin)/admin/dashboard/page.tsx
import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'Admin Dashboard — Placely' };

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') redirect('/');

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      {/* Verification queue + moderation queue — Sprint 4 */}
    </main>
  );
}
