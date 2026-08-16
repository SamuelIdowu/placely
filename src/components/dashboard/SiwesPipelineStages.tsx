import React from "react";
import Link from "next/link";
import {
  Send,
  UserCheck,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export interface SiwesPipelineStagesProps {
  totalApps: number;
  shortlistedCount: number;
  offeredCount: number;
  acceptedCount: number;
}

export function SiwesPipelineStages({
  totalApps,
  shortlistedCount,
  offeredCount,
  acceptedCount,
}: SiwesPipelineStagesProps) {
  const stages = [
    {
      id: "applied",
      stageNumber: "01",
      label: "Total Submitted",
      count: totalApps,
      subtext: totalApps === 1 ? "1 Active Application" : `${totalApps} Active Applications`,
      statusLabel: totalApps > 0 ? "In Review" : "Ready to Apply",
      isActive: totalApps > 0,
      accentGradient: "from-indigo-600 via-indigo-500 to-indigo-400",
      topBarColor: "bg-indigo-500",
      bgGlow: "group-hover:bg-indigo-50/40",
      badgeStyle: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
      iconBg: "bg-indigo-50 text-indigo-600 ring-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white",
      countColor: "text-slate-900 group-hover:text-indigo-600",
      icon: Send,
      href: "/applications",
    },
    {
      id: "shortlisted",
      stageNumber: "02",
      label: "Shortlisted",
      count: shortlistedCount,
      subtext: shortlistedCount > 0 ? "Interviews & Assessments" : "Screening in Progress",
      statusLabel: shortlistedCount > 0 ? `${shortlistedCount} Selected` : "Awaiting Review",
      isActive: shortlistedCount > 0,
      accentGradient: "from-blue-600 via-blue-500 to-sky-400",
      topBarColor: "bg-blue-500",
      bgGlow: "group-hover:bg-blue-50/40",
      badgeStyle: "bg-blue-50 text-blue-700 border-blue-200/60",
      iconBg: "bg-blue-50 text-blue-600 ring-blue-500/20 group-hover:bg-blue-600 group-hover:text-white",
      countColor: "text-slate-900 group-hover:text-blue-600",
      icon: UserCheck,
      href: "/applications?status=SHORTLISTED",
    },
    {
      id: "offered",
      stageNumber: "03",
      label: "Offers Received",
      count: offeredCount,
      subtext: offeredCount > 0 ? "Action Required: Review" : "Pending Employer Decision",
      statusLabel: offeredCount > 0 ? "Decision Needed" : "Awaiting Offer",
      isActive: offeredCount > 0,
      accentGradient: "from-amber-500 via-orange-500 to-rose-400",
      topBarColor: "bg-amber-500",
      bgGlow: "group-hover:bg-amber-50/40",
      badgeStyle: offeredCount > 0
        ? "bg-amber-100 text-amber-900 border-amber-300 font-bold animate-pulse"
        : "bg-amber-50 text-amber-700 border-amber-200/60",
      iconBg: "bg-amber-50 text-amber-600 ring-amber-500/20 group-hover:bg-amber-500 group-hover:text-white",
      countColor: "text-slate-900 group-hover:text-amber-600",
      icon: Sparkles,
      href: "/applications?status=OFFERED",
    },
    {
      id: "accepted",
      stageNumber: "04",
      label: "SIWES Confirmed",
      count: acceptedCount,
      subtext: acceptedCount > 0 ? "Placement Secured & Ready" : "Target: 1 Verified Placement",
      statusLabel: acceptedCount > 0 ? "Secured" : "Final Goal",
      isActive: acceptedCount > 0,
      accentGradient: "from-emerald-600 via-emerald-500 to-teal-400",
      topBarColor: "bg-emerald-500",
      bgGlow: "group-hover:bg-emerald-50/40",
      badgeStyle: acceptedCount > 0
        ? "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold"
        : "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      iconBg: "bg-emerald-50 text-emerald-600 ring-emerald-500/20 group-hover:bg-emerald-600 group-hover:text-white",
      countColor: "text-slate-900 group-hover:text-emerald-600",
      icon: CheckCircle2,
      href: "/applications?status=ACCEPTED",
    },
  ];

  // Calculate overall pipeline progress rate
  const totalStagesCompleted =
    (totalApps > 0 ? 1 : 0) +
    (shortlistedCount > 0 ? 1 : 0) +
    (offeredCount > 0 ? 1 : 0) +
    (acceptedCount > 0 ? 1 : 0);

  return (
    <div className="space-y-3.5">
      {/* Header with Pipeline Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-5 h-5 rounded-md bg-indigo-50 text-indigo-600">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              SIWES Placement Pipeline
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                {totalStagesCompleted}/4 Active Stages
              </span>
            </h2>
          </div>
        </div>

        <Link
          href="/applications"
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors group/link"
        >
          <span>View All Pipeline Applications</span>
          <span className="font-mono text-[11px] bg-indigo-50 text-indigo-600 px-1.5 py-0.2 rounded font-bold group-hover/link:bg-indigo-100 transition-colors">
            {totalApps}
          </span>
          <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 4 Pipeline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <Link
              key={stage.id}
              href={stage.href}
              className="group relative block focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-2xl"
            >
              <div
                className={`relative h-full bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col justify-between ${stage.bgGlow}`}
              >
               
                {/* Card Top: Stage Badge + Icon */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200/60 group-hover:border-slate-300 transition-colors">
                        Stage {stage.stageNumber}
                      </span>
                      {stage.isActive && (
                        <span className="relative flex h-2 w-2">
                          <span
                            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${stage.topBarColor}`}
                          />
                          <span
                            className={`relative inline-flex rounded-full h-2 w-2 ${stage.topBarColor}`}
                          />
                        </span>
                      )}
                    </div>

                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ring-1 transition-all duration-200 shrink-0 ${stage.iconBg}`}
                    >
                      <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                    </div>
                  </div>

                  {/* Stage Label */}
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    {stage.label}
                  </span>

                  {/* Big Metric Display */}
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`font-display text-3xl sm:text-4xl font-extrabold tracking-tight transition-colors duration-200 ${stage.countColor}`}
                    >
                      {stage.count}
                    </span>
                    <span
                      className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${stage.badgeStyle}`}
                    >
                      {stage.statusLabel}
                    </span>
                  </div>
                </div>

                {/* Card Footer: Subtext & Interactive Arrow */}
                <div className="pt-3 mt-3 border-t border-slate-100/90 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-600 truncate">
                    {stage.subtext}
                  </span>
                  <div className="flex items-center text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0">
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
