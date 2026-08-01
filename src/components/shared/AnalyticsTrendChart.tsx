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
    /* Cohere lg media card: pale-blue wash bg, 22px radius, Cohere border */
    <div
      className="rounded-[22px] p-6 space-y-6"
      style={{ background: '#f1f5ff', border: '1px solid #e5e7eb' }}
    >
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-base flex items-center gap-2" style={{ color: '#212121' }}>
            <TrendingUp className="w-4 h-4" style={{ color: '#4f46e5' }} />
            {title}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: '#75758a' }}>{subtitle}</p>
        </div>

        {/* Timeframe toggle */}
        <div
          className="flex items-center gap-1 p-1 rounded-lg shrink-0"
          style={{ background: 'rgba(0,0,0,0.05)' }}
        >
          {(["Weekly", "Monthly", "Yearly"] as const).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                timeframe === tf
                  ? "bg-white shadow-sm"
                  : "hover:bg-white/60"
              }`}
              style={{ color: timeframe === tf ? '#4f46e5' : '#75758a' }}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* KPI tiles — Cohere product band inset tiles */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className="p-3.5 rounded-lg flex items-center gap-3"
          style={{
            background: 'rgba(79,70,229,0.08)',
            border: '1px solid rgba(79,70,229,0.15)',
          }}
        >
          <div
            className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
            style={{ background: '#4f46e5' }}
          >
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-medium block uppercase tracking-[0.05em]" style={{ color: '#75758a' }}>
              Active Placements
            </span>
            <span className="font-bold text-lg" style={{ color: '#212121' }}>
              {points[points.length - 1].placements.toLocaleString()}
            </span>
          </div>
        </div>

        <div
          className="p-3.5 rounded-lg flex items-center gap-3"
          style={{
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.15)',
          }}
        >
          <div
            className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
            style={{ background: '#10b981' }}
          >
            <DollarSign className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-medium block uppercase tracking-[0.05em]" style={{ color: '#75758a' }}>
              Avg Stipend Level
            </span>
            <span className="font-bold text-lg" style={{ color: '#10b981' }}>
              ₦{points[points.length - 1].avgStipend.toLocaleString()}/mo
            </span>
          </div>
        </div>
      </div>

      {/* Bar chart — gradient fill on pale bg (gradient as media fill, per plan) */}
      <div className="space-y-2 pt-2">
        <div
          className="h-44 flex items-end justify-between gap-2 sm:gap-4 pb-2"
          style={{ borderBottom: '1px solid rgba(79,70,229,0.15)' }}
        >
          {points.map((p) => {
            const heightPct = Math.round((p.placements / maxPlacement) * 100);
            return (
              <div key={p.label} className="flex-1 flex flex-col items-center gap-2 group relative">
                {/* Hover tooltip */}
                <div
                  className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap z-10 pointer-events-none"
                  style={{ background: '#17171c' }}
                >
                  {p.placements} placements · ₦{p.avgStipend.toLocaleString()}/mo
                </div>

                <div
                  className="w-full rounded-t-md relative overflow-hidden flex items-end h-32"
                  style={{ background: 'rgba(79,70,229,0.1)' }}
                >
                  <div
                    style={{
                      height: `${heightPct}%`,
                      background: 'linear-gradient(to top, #4f46e5, #818cf8)',
                    }}
                    className="w-full rounded-t-md transition-all duration-500 group-hover:brightness-110"
                  />
                </div>
                <span className="text-xs font-semibold" style={{ color: '#75758a' }}>{p.label}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] font-medium pt-1" style={{ color: '#93939f' }}>
          <span>· Placement demand</span>
          <span className="font-bold" style={{ color: '#4f46e5' }}>Peak Avg: ₦95,000/mo</span>
        </div>
      </div>
    </div>
  );
}
