import React from 'react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 text-center">
        <Link href="/" className="font-serif text-3xl font-bold tracking-tight text-gray-900">
          Placely
        </Link>
        <p className="mt-1 text-sm text-gray-600">
          SIWES Placement Marketplace
        </p>
      </div>
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {children}
      </div>
    </div>
  );
}
