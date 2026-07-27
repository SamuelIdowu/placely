import * as React from "react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { statusTokens, type ApplicationStatusKey } from "@/lib/tokens";

export interface StatusBadgeProps extends Omit<BadgeProps, "variant"> {
  status: ApplicationStatusKey | string;
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const normalizedKey = (status?.toUpperCase() ?? "APPLIED") as ApplicationStatusKey;
  const token = statusTokens[normalizedKey] ?? statusTokens.APPLIED;

  const variantMap: Record<ApplicationStatusKey, BadgeProps["variant"]> = {
    APPLIED: "applied",
    SHORTLISTED: "shortlisted",
    OFFERED: "offered",
    ACCEPTED: "accepted",
    DECLINED: "declined",
    DRAFT: "draft",
    PENDING: "pending",
    REJECTED: "rejected",
  };

  return (
    <Badge
      variant={variantMap[normalizedKey] ?? "applied"}
      className={className}
      {...props}
    >
      {token.label}
    </Badge>
  );
}
