import React from 'react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50/50 py-10 px-4 sm:px-6">
      <div className="mb-5 text-center">
        <Link href="/" className="font-serif text-3xl font-bold tracking-tight text-slate-900">
          Placely
        </Link>
        <p className="mt-0.5 text-xs text-slate-500 font-medium">
          Accredited SIWES Placement Marketplace
        </p>
      </div>
      <div className="w-full max-w-md bg-white p-6 sm:p-7 rounded-2xl shadow-2xs border border-slate-200/90">
        {children}
      </div>
    </div>
  );
}
