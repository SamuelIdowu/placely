// app/(student)/applications/[id]/page.tsx
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Application Details — Placely' };

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Application</h1>
      <p className="text-gray-500 mt-1 text-sm">ID: {id}</p>
      {/* Application detail + messages — Sprint 3 */}
    </main>
  );
}
