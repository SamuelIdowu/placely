import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VerificationBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function VerificationBadge({
  status = "VERIFIED",
  size = "md",
  showLabel = false,
  className,
  ...props
}: VerificationBadgeProps) {
  if (status !== "VERIFIED") {
    return null;
  }

  const sizeStyles = {
    sm: "h-4 w-4 text-[10px]",
    md: "h-5 w-5 text-xs",
    lg: "h-6 w-6 text-sm",
  };

  const iconSizes = {
    sm: "h-2.5 w-2.5",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  };

  return (
    <span
      className={cn("inline-flex items-center gap-1.5 font-medium text-emerald-700", className)}
      {...props}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-emerald-600 text-white shrink-0 shadow-xs",
          sizeStyles[size]
        )}
        title="Verified Profile"
      >
        <Check className={cn("stroke-[3]", iconSizes[size])} />
      </span>
      {showLabel && <span className="text-xs">Verified</span>}
    </span>
  );
}
