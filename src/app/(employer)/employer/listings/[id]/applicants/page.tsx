// app/(employer)/employer/listings/[id]/applicants/page.tsx
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Applicants — Placely' };

export default async function ApplicantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Applicants</h1>
      <p className="text-gray-500 mt-1 text-sm">Listing: {id}</p>
      {/* Kanban board: APPLIED → SHORTLISTED → OFFERED — Sprint 3 */}
    </main>
  );
}
