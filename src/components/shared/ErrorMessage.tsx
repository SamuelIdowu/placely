import * as React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ErrorMessageProps {
  title?: string;
  message: string;
  className?: string;
}

export function ErrorMessage({ title = 'Error', message, className }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm',
        className
      )}
      role="alert"
    >
      <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
      <div>
        {title && <h4 className="font-semibold text-rose-900 text-xs uppercase tracking-wider">{title}</h4>}
        <p className="text-xs text-rose-700 mt-0.5">{message}</p>
      </div>
    </div>
  );
}
