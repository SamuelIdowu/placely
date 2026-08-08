// app/(employer)/employer/applications/[id]/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Application Details — Placely' };

export default async function EmployerApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="">
      <h1 className="text-2xl font-bold">Application Details</h1>
      <p className="text-gray-500 mt-1 text-sm">ID: {id}</p>
      {/* Detail view & message thread — Sprint 3 */}
    </div>
  );
}
