import React from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, Plus, ArrowRight, ShieldCheck, Clock } from "lucide-react";

export interface SiwesLogbookCardProps {
  currentWeek?: number;
  totalWeeks?: number;
  loggedDays?: number;
  supervisorName?: string;
  isSupervisorSigned?: boolean;
}

export function SiwesLogbookCard({
  currentWeek,
  totalWeeks = 24,
  loggedDays,
  supervisorName,
  isSupervisorSigned,
}: SiwesLogbookCardProps) {
  const hasData = currentWeek != null && loggedDays != null;
  const percentComplete = hasData ? Math.min(100, Math.round((currentWeek / totalWeeks) * 100)) : 0;

  return (
    <div
      className="rounded-card p-5 flex flex-col justify-between relative overflow-hidden text-surface-dark-foreground bg-surface-dark shadow-2xs"
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-white/10">
              <BookOpen className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h3 className="font-display text-sm sm:text-base font-semibold tracking-tight text-white">
                Digital SIWES Logbook
              </h3>
              <p className="text-[11px] text-surface-dark-muted">ITF Form 8 Compliance</p>
            </div>
          </div>

          {hasData && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stat-emerald/15 text-stat-emerald border border-stat-emerald/30">
              <CheckCircle2 className="w-3 h-3" /> Wk {currentWeek} Active
            </span>
          )}
        </div>

        {hasData ? (
          <>
            {/* Progress Bar & Day Counters */}
            <div className="space-y-1.5 my-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-surface-dark-muted font-medium">Training Progress</span>
                <span className="text-white font-bold">{loggedDays} Days Logged · {percentComplete}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-brand-indigo to-stat-emerald"
                  style={{ width: `${percentComplete}%` }}
                />
              </div>
            </div>

            {/* Supervisor Sign-Off Status */}
            {supervisorName && (
              <div className="rounded-xl p-3 flex items-center justify-between gap-3 text-xs mb-3.5 bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-slate-200 text-[11px]">{supervisorName}</span>
                </div>
                <span className="font-semibold text-[11px] text-emerald-400">
                  {isSupervisorSigned ? "Signed Off" : "Sign-off Pending"}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="my-5 flex flex-col items-center text-center space-y-2">
            <Clock className="w-8 h-8 text-white/20" />
            <p className="text-xs text-surface-dark-muted leading-relaxed max-w-[200px]">
              Logbook activates once your SIWES placement begins.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
        <Link
          href="/logbook/new"
          className="inline-flex items-center justify-center gap-1 px-3.5 py-2 rounded-full text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 transition-colors w-full sm:w-auto shrink-0 shadow-xs active:scale-[0.98]"
        >
          <Plus className="w-3 h-3" /> Quick Log Today
        </Link>
        <Link
          href="/logbook"
          className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-full text-xs font-semibold text-white hover:bg-white/10 border border-white/15 transition-colors sm:w-auto shrink-0 active:scale-[0.98]"
        >
          View Full Logbook <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
