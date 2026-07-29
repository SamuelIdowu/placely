"use client";

import React, { useState } from "react";
import { TrendingUp, DollarSign, Briefcase } from "lucide-react";

export interface TrendPoint {
  label: string;
  placements: number;
  avgStipend: number;
}

export interface AnalyticsTrendChartProps {
  title?: string;
  subtitle?: string;
}

export function AnalyticsTrendChart({
  title = "SIWES Placement & Stipend Trends",
  subtitle = "Real-time market intelligence across Nigerian engineering hubs",
}: AnalyticsTrendChartProps) {
  const [timeframe, setTimeframe] = useState<"Weekly" | "Monthly" | "Yearly">("Monthly");

  const dataMap: Record<"Weekly" | "Monthly" | "Yearly", TrendPoint[]> = {
    Weekly: [
      { label: "W1", placements: 14, avgStipend: 65000 },
      { label: "W2", placements: 22, avgStipend: 72000 },
      { label: "W3", placements: 35, avgStipend: 80000 },
      { label: "W4", placements: 48, avgStipend: 88000 },
    ],
    Monthly: [
      { label: "Jan", placements: 45, avgStipend: 60000 },
      { label: "Feb", placements: 68, avgStipend: 65000 },
      { label: "Mar", placements: 95, avgStipend: 75000 },
      { label: "Apr", placements: 120, avgStipend: 82000 },
      { label: "May", placements: 160, avgStipend: 88000 },
      { label: "Jun", placements: 210, avgStipend: 95000 },
    ],
    Yearly: [
      { label: "2023", placements: 450, avgStipend: 55000 },
      { label: "2024", placements: 890, avgStipend: 70000 },
      { label: "2025", placements: 1420, avgStipend: 85000 },
      { label: "2026", placements: 1980, avgStipend: 95000 },
    ],
  };

  const points = dataMap[timeframe];
  const maxPlacement = Math.max(...points.map((p) => p.placements));

  return (
    <div className="bg-white rounded-lg border border-slate-200/80 shadow-md p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            {title}
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">{subtitle}</p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md shrink-0">
          {(["Weekly", "Monthly", "Yearly"] as const).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                timeframe === tf
                  ? "bg-white text-indigo-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3.5 rounded-lg bg-indigo-50/60 border border-indigo-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Active Placements</span>
            <span className="font-extrabold text-slate-900 text-base">
              {points[points.length - 1].placements.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Avg Stipend Level</span>
            <span className="font-extrabold text-emerald-700 text-base">
              ₦{points[points.length - 1].avgStipend.toLocaleString()}/mo
            </span>
          </div>
        </div>
      </div>

      {/* Visual Chart Bars */}
      <div className="space-y-2 pt-2">
        <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 border-b border-slate-100 pb-2">
          {points.map((p) => {
            const heightPct = Math.round((p.placements / maxPlacement) * 100);
            return (
              <div key={p.label} className="flex-1 flex flex-col items-center gap-2 group relative">
                {/* Tooltip on hover */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap z-10 pointer-events-none">
                  {p.placements} placements • ₦{p.avgStipend.toLocaleString()}/mo
                </div>

                <div className="w-full bg-slate-100 rounded-t-md relative overflow-hidden flex items-end h-32">
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-gradient-to-t from-indigo-600 to-indigo-500 rounded-t-md transition-all duration-500 group-hover:from-indigo-700 group-hover:to-indigo-600"
                  />
                </div>
                <span className="text-xs font-semibold text-slate-600">{p.label}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-1">
          <span>• Placement Demand Bar Height</span>
          <span className="text-indigo-600 font-bold">Peak Stipend Avg: ₦95,000/mo</span>
        </div>
      </div>
    </div>
  );
}
