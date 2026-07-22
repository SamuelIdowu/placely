// app/(student)/listings/[id]/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Listing Details — Placely' };

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Listing Details</h1>
      <p className="text-gray-500 mt-1 text-sm">ID: {id}</p>
      {/* Listing detail + apply button — Sprint 2 */}
    </main>
  );
}
