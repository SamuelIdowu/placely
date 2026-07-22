// app/(employer)/employer/listings/page.tsx
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'My Listings — Placely' };

export default function EmployerListingsPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">My Listings</h1>
      {/* Listings table + Post New Listing CTA — Sprint 2 */}
    </main>
  );
}
