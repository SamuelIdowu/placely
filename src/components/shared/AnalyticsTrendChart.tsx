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
    <div
      className="rounded-[22px] p-6 space-y-6 bg-brand-indigo-light border border-border"
    >
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-base flex items-center gap-2 text-foreground">
            <TrendingUp className="w-4 h-4 text-brand-indigo" />
            {title}
          </h3>
          <p className="text-xs mt-0.5 text-muted-foreground">{subtitle}</p>
        </div>

        {/* Timeframe toggle */}
        <div
          className="flex items-center gap-1 p-1 rounded-lg shrink-0 bg-black/5"
        >
          {(["Weekly", "Monthly", "Yearly"] as const).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-150 ease-out active:scale-95 ${
                timeframe === tf
                  ? "bg-white shadow-xs text-brand-indigo"
                  : "hover:bg-white/60 text-muted-foreground"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* KPI tiles — centralized tokens */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className="p-3.5 rounded-lg flex items-center gap-3 bg-brand-indigo/10 border border-brand-indigo/20"
        >
          <div
            className="w-9 h-9 rounded-md flex items-center justify-center shrink-0 bg-brand-indigo"
          >
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-medium block uppercase tracking-[0.05em] text-muted-foreground">
              Active Placements
            </span>
            <span className="font-bold text-lg tabular-nums text-foreground">
              {points[points.length - 1].placements.toLocaleString()}
            </span>
          </div>
        </div>

        <div
          className="p-3.5 rounded-lg flex items-center gap-3 bg-stat-emerald/10 border border-stat-emerald/20"
        >
          <div
            className="w-9 h-9 rounded-md flex items-center justify-center shrink-0 bg-stat-emerald"
          >
            <DollarSign className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-medium block uppercase tracking-[0.05em] text-muted-foreground">
              Avg Stipend Level
            </span>
            <span className="font-bold text-lg tabular-nums text-stat-emerald">
              ₦{points[points.length - 1].avgStipend.toLocaleString()}/mo
            </span>
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="space-y-2 pt-2">
        <div
          className="h-44 flex items-end justify-between gap-2 sm:gap-4 pb-2 border-b border-brand-indigo/20"
        >
          {points.map((p) => {
            const heightPct = Math.round((p.placements / maxPlacement) * 100);
            return (
              <div key={p.label} className="flex-1 flex flex-col items-center gap-2 group relative">
                {/* Hover tooltip */}
                <div
                  className="absolute -top-10 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 origin-bottom transition-all duration-150 ease-out text-white text-[10px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap z-10 pointer-events-none bg-surface-dark"
                >
                  {p.placements} placements · ₦{p.avgStipend.toLocaleString()}/mo
                </div>

                <div
                  className="w-full rounded-t-md relative overflow-hidden flex items-end h-32 bg-brand-indigo/10"
                >
                  <div
                    style={{
                      height: `${heightPct}%`,
                    }}
                    className="w-full rounded-t-md transition-all duration-300 ease-out group-hover:brightness-110 bg-gradient-to-t from-brand-indigo to-indigo-400"
                  />
                </div>
                <span className="text-xs font-semibold text-muted-foreground">{p.label}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] font-medium pt-1 text-muted-foreground">
          <span>· Placement demand</span>
          <span className="font-bold tabular-nums text-brand-indigo">Peak Avg: ₦95,000/mo</span>
        </div>
      </div>
    </div>
  );
}
