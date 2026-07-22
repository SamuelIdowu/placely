// app/(student)/listings/page.tsx
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Browse Placements — Placely' };

export default function ListingsBrowsePage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Browse Placements</h1>
      {/* Listing grid with discipline + location filters — Sprint 2 */}
    </main>
  );
}
