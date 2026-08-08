'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export function VerificationPromoCard() {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-lg p-5 text-white shadow-lg space-y-3 border border-slate-800">
      <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
        <ShieldCheck className="w-5 h-5" />
      </div>

      <div>
        <h4 className="font-bold text-sm text-white leading-snug">Get Verified for Top Employers</h4>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          Upload your SIWES school ID to earn an official verified badge and boost employer visibility.
        </p>
      </div>

      <Link
        href="/profile"
        className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors shadow-sm"
      >
        Get Verified <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
