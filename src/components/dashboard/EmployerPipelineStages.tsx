import React from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Users,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

export interface EmployerPipelineStagesProps {
  activeOpenings: number;
  totalApplicants: number;
  shortlistedAndOffers: number;
}

export function EmployerPipelineStages({
  activeOpenings,
  totalApplicants,
  shortlistedAndOffers,
}: EmployerPipelineStagesProps) {
  const stages = [
    {
      id: 'openings',
      stageNumber: '01',
      label: 'Active Openings',
      count: activeOpenings,
      subtext: activeOpenings === 1 ? '1 Live Placement Role' : `${activeOpenings} Live Placement Roles`,
      statusLabel: activeOpenings > 0 ? 'Published' : 'No Listings',
      isActive: activeOpenings > 0,
      topBarColor: 'bg-indigo-500',
      bgGlow: 'group-hover:bg-indigo-50/40',
      badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
      iconBg: 'bg-indigo-50 text-indigo-600 ring-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white',
      countColor: 'text-slate-900 group-hover:text-indigo-600',
      icon: Briefcase,
      href: '/employer/listings',
    },
    {
      id: 'applicants',
      stageNumber: '02',
      label: 'Total Applicants',
      count: totalApplicants,
      subtext: totalApplicants > 0 ? 'Verified Undergraduates Applied' : 'Awaiting Applications',
      statusLabel: totalApplicants > 0 ? 'In Pipeline' : 'Pending',
      isActive: totalApplicants > 0,
      topBarColor: 'bg-blue-500',
      bgGlow: 'group-hover:bg-blue-50/40',
      badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200/60',
      iconBg: 'bg-blue-50 text-blue-600 ring-blue-500/20 group-hover:bg-blue-600 group-hover:text-white',
      countColor: 'text-slate-900 group-hover:text-blue-600',
      icon: Users,
      href: '/employer/listings',
    },
    {
      id: 'shortlisted',
      stageNumber: '03',
      label: 'Shortlisted & Offers',
      count: shortlistedAndOffers,
      subtext: shortlistedAndOffers > 0 ? 'In Active Evaluation' : 'Screening Pending',
      statusLabel: shortlistedAndOffers > 0 ? 'Action Needed' : 'Awaiting Review',
      isActive: shortlistedAndOffers > 0,
      topBarColor: 'bg-emerald-500',
      bgGlow: 'group-hover:bg-emerald-50/40',
      badgeStyle: shortlistedAndOffers > 0
        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
        : 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      iconBg: 'bg-emerald-50 text-emerald-600 ring-emerald-500/20 group-hover:bg-emerald-600 group-hover:text-white',
      countColor: 'text-slate-900 group-hover:text-emerald-600',
      icon: Sparkles,
      href: '/employer/listings',
    },
  ];

  return (
    <div className="space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-5 h-5 rounded-md bg-indigo-50 text-indigo-600">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Recruitment Pipeline
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        {stages.map((stage) => {
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
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200/60 group-hover:border-slate-300 transition-colors">
                        Stage {stage.stageNumber}
                      </span>
                      {stage.isActive && (
                        <span className="relative flex h-2 w-2">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${stage.topBarColor}`} />
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${stage.topBarColor}`} />
                        </span>
                      )}
                    </div>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ring-1 transition-all duration-200 shrink-0 ${stage.iconBg}`}>
                      <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                    </div>
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    {stage.label}
                  </span>

                  <div className="flex items-baseline gap-2">
                    <span className={`font-display text-3xl sm:text-4xl font-extrabold tracking-tight transition-colors duration-200 ${stage.countColor}`}>
                      {stage.count}
                    </span>
                    <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${stage.badgeStyle}`}>
                      {stage.statusLabel}
                    </span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100/90 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-600 truncate">{stage.subtext}</span>
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
