import * as React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
  variant?: "card" | "plain";
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  variant = "card",
}: EmptyStateProps) {
  const isComponent = typeof icon === "function";
  const IconComponent = isComponent
    ? (icon as React.ComponentType<{ className?: string }>)
    : null;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center my-4",
        variant === "card" &&
          "bg-card border border-border rounded-card shadow-none",
        className
      )}
    >
      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-muted/70 flex items-center justify-center text-muted-foreground mb-4 border border-border/50">
          {IconComponent ? (
            <IconComponent className="h-6 w-6" />
          ) : (
            (icon as React.ReactNode)
          )}
        </div>
      )}

      <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
        {title}
      </h3>

      {description && (
        <p className="text-xs sm:text-sm text-body-muted mt-1.5 max-w-md leading-relaxed">
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
