import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "destructive"
    | "applied"
    | "shortlisted"
    | "offered"
    | "accepted"
    | "declined"
    | "draft"
    | "pending"
    | "rejected";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default:
      "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary:
      "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "text-foreground border-border",
    destructive:
      "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    applied: "border-slate-200 bg-slate-100 text-slate-700",
    shortlisted: "border-blue-200 bg-blue-100 text-blue-800",
    offered: "border-purple-200 bg-purple-100 text-purple-800",
    accepted: "border-emerald-200 bg-emerald-100 text-emerald-800",
    declined: "border-rose-200 bg-rose-100 text-rose-800",
    draft: "border-slate-200 bg-slate-100 text-slate-700",
    pending: "border-amber-200 bg-amber-100 text-amber-800",
    rejected: "border-rose-200 bg-rose-100 text-rose-800",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
