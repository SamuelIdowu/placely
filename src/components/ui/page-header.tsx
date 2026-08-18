import * as React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PageHeaderBreadcrumb {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  breadcrumbs?: PageHeaderBreadcrumb[];
  actions?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  className?: string;
  variant?: "default" | "editorial" | "compact";
}

export function PageHeader({
  title,
  description,
  badge,
  breadcrumbs,
  actions,
  backHref,
  backLabel = "Back",
  className,
  variant = "default",
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 pb-6 border-b border-border/60 mb-6",
        variant === "compact" && "pb-4 mb-4 gap-2",
        className
      )}
    >
      {/* Breadcrumbs or Back link */}
      {(backHref || (breadcrumbs && breadcrumbs.length > 0)) && (
        <div className="flex items-center gap-2 text-xs text-body-muted">
          {backHref ? (
            <Link
              href={backHref}
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors font-medium"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              {backLabel}
            </Link>
          ) : (
            breadcrumbs?.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={crumb.label}>
                  {crumb.href && !isLast ? (
                    <Link
                      href={crumb.href}
                      className="hover:text-foreground transition-colors font-medium"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={cn(isLast && "font-semibold text-foreground")}>
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && <span className="text-border">/</span>}
                </React.Fragment>
              );
            })
          )}
        </div>
      )}

      {/* Main Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1
              className={cn(
                "text-2xl sm:text-3xl font-bold tracking-tight text-foreground",
                variant === "editorial" && "font-serif text-3xl sm:text-4xl font-normal"
              )}
            >
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
          {description && (
            <p className="text-xs sm:text-sm text-body-muted max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Action Buttons Slot */}
        {actions && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
