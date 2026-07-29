import React from "react";
import { Sparkles } from "lucide-react";

export function EmployerLogoCarousel() {
  const topEmployers = [
    { name: "Dangote Group", tag: "Industrial & Mfg", hiring: "12 Placements" },
    { name: "Flutterwave", tag: "Fintech & Dev", hiring: "8 Placements" },
    { name: "NLNG", tag: "Oil & Gas / Chemical", hiring: "15 Placements" },
    { name: "Interswitch", tag: "Software & Cloud", hiring: "6 Placements" },
    { name: "Julius Berger", tag: "Civil & Infra", hiring: "10 Placements" },
    { name: "MTN Nigeria", tag: "Telecom & Cyber", hiring: "9 Placements" },
  ];

  return (
    <div className="w-full max-w-full overflow-hidden bg-white rounded-lg border border-slate-200/80 shadow-md p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Discover Top SIWES Employers
        </span>
        <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
          Verified Partners
        </span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-1 max-w-full scrollbar-none">
        {topEmployers.map((emp) => (
          <div
            key={emp.name}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 shrink-0 hover:bg-indigo-50/50 hover:border-indigo-100 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-xs shrink-0 group-hover:border-indigo-300">
              {emp.name.charAt(0)}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {emp.name}
              </h4>
              <p className="text-[10px] text-slate-500 font-medium">
                {emp.tag} • <span className="text-emerald-600 font-semibold">{emp.hiring}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
