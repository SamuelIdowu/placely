import React from "react";
import { TrendingUp, Award, MapPin, Zap } from "lucide-react";

export function MarketStipendBarometer() {
  const cityStipends = [
    { city: "Lagos (Ikeja/VI)", avg: "₦75,000", change: "+12%" },
    { city: "Port Harcourt", avg: "₦80,000", change: "+8%" },
    { city: "Abuja Central", avg: "₦65,000", change: "+5%" },
    { city: "Ilorin / Kwara", avg: "₦45,000", change: "+4%" },
  ];

  const inDemandSkills = [
    { name: "PLC Programming", demand: "High", count: "18 Openings" },
    { name: "SolidWorks / CAD", demand: "High", count: "24 Openings" },
    { name: "MATLAB & Simulink", demand: "Medium", count: "12 Openings" },
    { name: "Embedded C / Arduino", demand: "High", count: "15 Openings" },
  ];

  return (
    <div className="bg-card rounded-[22px] p-6 border border-border shadow-2xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-brand-indigo" />
          <h3 className="font-display text-sm font-semibold text-foreground">
            SIWES Market Barometer
          </h3>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
          Nigeria 2026
        </span>
      </div>

      {/* City Averages */}
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Avg. Engineering Stipend by Hub
        </p>
        <div className="grid grid-cols-2 gap-2">
          {cityStipends.map((item) => (
            <div
              key={item.city}
              className="p-2.5 rounded-xl bg-muted/40 border border-border flex flex-col justify-between"
            >
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1 truncate">
                <MapPin className="w-2.5 h-2.5 text-muted-foreground shrink-0" />
                {item.city}
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xs font-bold text-foreground">{item.avg}</span>
                <span className="text-[10px] font-semibold text-stat-emerald">{item.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* In-Demand Technical Skills */}
      <div className="space-y-2 pt-2 border-t border-border">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Top Skills In Demand
          </p>
          <Zap className="w-3.5 h-3.5 text-stat-amber" />
        </div>
        <div className="space-y-1.5">
          {inDemandSkills.map((skill) => (
            <div
              key={skill.name}
              className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-indigo" />
                <span className="font-medium text-foreground">{skill.name}</span>
              </div>
              <span className="text-[11px] text-muted-foreground font-medium">{skill.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
