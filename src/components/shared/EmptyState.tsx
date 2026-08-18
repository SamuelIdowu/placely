import * as React from "react";
import {
  EmptyState as UIEmptyState,
  type EmptyStateProps,
} from "@/components/ui/empty-state";

export type { EmptyStateProps };

export function EmptyState(props: EmptyStateProps) {
  return <UIEmptyState {...props} />;
}
