// app/(admin)/admin/listings/page.tsx
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Listing Moderation — Placely Admin' };

export default function ListingModerationPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Listing Moderation</h1>
      {/* Unmoderated listings table — Sprint 4 */}
    </main>
  );
}
