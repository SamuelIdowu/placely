import * as React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: string | number;
  delta?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
    label?: string;
  };
  icon?: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  description?: string;
  className?: string;
  variant?: "default" | "subtle" | "dark" | "accent";
}

export function StatCard({
  title,
  value,
  delta,
  icon,
  iconBgColor = "bg-brand-indigo-light",
  iconColor = "text-brand-indigo",
  description,
  className,
  variant = "default",
}: StatCardProps) {
  const isDark = variant === "dark";

  return (
    <Card
      variant={isDark ? "dark" : variant === "subtle" ? "subtle" : "default"}
      className={cn("p-5 flex flex-col justify-between space-y-4", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-wider",
              isDark ? "text-surface-dark-muted" : "text-muted-foreground"
            )}
          >
            {title}
          </p>
          <div
            className={cn(
              "text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums",
              isDark ? "text-white" : "text-foreground"
            )}
          >
            {value}
          </div>
        </div>

        {icon && (
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-transparent",
              isDark
                ? "bg-surface-dark-border text-white"
                : `${iconBgColor} ${iconColor}`
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {(delta || description) && (
        <div className="flex items-center gap-2 pt-1 text-xs">
          {delta && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-bold text-[11px]",
                delta.isNeutral
                  ? "bg-slate-100 text-slate-700"
                  : delta.isPositive
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              )}
            >
              {delta.isNeutral ? (
                <Minus className="w-3 h-3" />
              ) : delta.isPositive ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {delta.value}
            </span>
          )}

          {delta?.label && (
            <span
              className={cn(
                "text-[11px]",
                isDark ? "text-surface-dark-muted" : "text-body-muted"
              )}
            >
              {delta.label}
            </span>
          )}

          {description && !delta && (
            <span
              className={cn(
                "text-xs",
                isDark ? "text-surface-dark-muted" : "text-body-muted"
              )}
            >
              {description}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
