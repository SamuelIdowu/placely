// app/(admin)/admin/verifications/page.tsx
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Verification Queue — Placely Admin' };

export default function VerificationsQueuePage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Verification Queue</h1>
      {/* Pending verification requests table — Sprint 4 */}
    </main>
  );
}
