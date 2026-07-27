'use client';

import * as React from 'react';
import * as Toast from '@radix-ui/react-toast';
import { useToast } from '@/hooks/useToast';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, dismiss } = useToast();

  return (
    <Toast.Provider swipeDirection="right">
      {children}
      {toasts.map((t) => (
        <Toast.Root
          key={t.id}
          className={cn(
            'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-[4px] border p-4 shadow-lg transition-all my-1',
            t.variant === 'success' && 'bg-emerald-950 text-white border-emerald-800',
            t.variant === 'error' && 'bg-rose-950 text-white border-rose-800',
            t.variant === 'info' && 'bg-slate-900 text-white border-slate-700'
          )}
          onOpenChange={(open) => {
            if (!open) dismiss(t.id);
          }}
        >
          <div className="flex items-start gap-3">
            {t.variant === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />}
            {t.variant === 'error' && <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />}
            {t.variant === 'info' && <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />}
            <div className="grid gap-1">
              <Toast.Title className="text-xs font-bold">{t.title}</Toast.Title>
              {t.description && (
                <Toast.Description className="text-xs text-slate-300">
                  {t.description}
                </Toast.Description>
              )}
            </div>
          </div>
          <Toast.Close className="rounded-md p-1 text-slate-400 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </Toast.Close>
        </Toast.Root>
      ))}
      <Toast.Viewport className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-4 sm:right-4 sm:top-auto sm:flex-col md:max-w-[420px]" />
    </Toast.Provider>
  );
}
