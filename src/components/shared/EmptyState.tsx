import * as React from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white border border-app-border rounded-lg shadow-sm my-4',
        className
      )}
    >
      {Icon && (
        <div className="p-3 bg-slate-100 text-slate-600 rounded-full mb-3">
          <Icon className="h-6 w-6 text-slate-600" />
        </div>
      )}
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
