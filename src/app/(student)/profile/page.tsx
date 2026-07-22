// app/(student)/profile/page.tsx
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'My Profile — Placely' };

export default function StudentProfilePage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">My Profile</h1>
      {/* Profile form — Sprint 1 */}
    </main>
  );
}
