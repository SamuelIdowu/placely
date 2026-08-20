import React from 'react';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh flex bg-background text-foreground selection:bg-brand-indigo-light selection:text-brand-indigo">
      {/* Left: Brand Panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface-dark relative overflow-hidden flex-col justify-between p-12">
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <Link href="/" className="relative z-10 flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-brand-indigo text-white font-serif text-lg flex items-center justify-center font-bold shadow-xs">
            P
          </div>
          <span className="font-serif text-2xl font-normal tracking-tight text-white">
            Placely<span className="text-brand-indigo">.ng</span>
          </span>
        </Link>

        <div className="relative z-10 space-y-4 max-w-md">
          <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-3xl font-normal text-white leading-tight">
            Nigeria&apos;s SIWES placement operating system.
          </h2>
          <p className="text-sm text-surface-dark-muted leading-relaxed">
            Verified employers, transparent stipends, and institutional validation — all in one marketplace.
          </p>
        </div>

        <p className="relative z-10 text-[11px] text-surface-dark-muted">
          © {new Date().getFullYear()} Placely Technologies Ltd.
        </p>
      </div>

      {/* Right: Form Panel */}
      <div className="flex-1 flex flex-col">
        {/* Mobile-only header */}
        <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-brand-indigo text-white font-serif text-sm flex items-center justify-center font-bold">
              P
            </div>
            <span className="font-serif text-lg font-normal tracking-tight text-foreground">
              Placely<span className="text-brand-indigo">.ng</span>
            </span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-10 sm:py-16">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
