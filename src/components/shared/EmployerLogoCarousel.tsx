'use client';

import React from 'react';
import Link from 'next/link';

interface TopEmployer {
  name: string;
  discipline: string;
  avgStipend: string;
  initials: string;
  color: string;
}

const TOP_EMPLOYERS: TopEmployer[] = [
  { name: 'Chevron Nigeria', discipline: 'Electrical / Petroleum', avgStipend: '₦150,000/mo', initials: 'CN', color: 'bg-blue-600' },
  { name: 'TotalEnergies', discipline: 'Chemical / Mechanical', avgStipend: '₦140,000/mo', initials: 'TE', color: 'bg-rose-600' },
  { name: 'NLNG Limited', discipline: 'Process / Electrical', avgStipend: '₦160,000/mo', initials: 'NL', color: 'bg-emerald-600' },
  { name: 'MTN Nigeria', discipline: 'Telecoms / Computer', avgStipend: '₦120,000/mo', initials: 'MT', color: 'bg-amber-500' },
  { name: 'Interswitch Group', discipline: 'Software / Systems', avgStipend: '₦130,000/mo', initials: 'IS', color: 'bg-violet-600' },
];

export function EmployerLogoCarousel() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
          Featured Engineering Employers 🔥
        </h3>
        <span className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer">
          Top Verified
        </span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none snap-x">
        {TOP_EMPLOYERS.map((emp) => (
          <Link
            key={emp.name}
            href={`/listings?keyword=${encodeURIComponent(emp.name)}`}
            className="flex-none snap-start min-w-[200px] bg-white rounded-lg p-3.5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg ${emp.color} text-white font-bold text-sm flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform`}
              >
                {emp.initials}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-xs text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                  {emp.name}
                </h4>
                <p className="text-[11px] text-slate-400 truncate">{emp.discipline}</p>
                <p className="text-xs font-semibold text-indigo-600 mt-0.5">{emp.avgStipend}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
