'use client';

import * as React from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

type ToastListener = (toasts: ToastMessage[]) => void;

let toasts: ToastMessage[] = [];
const listeners: ToastListener[] = [];

function notify() {
  listeners.forEach((listener) => listener([...toasts]));
}

export function toast({
  title,
  description,
  variant = 'info',
}: {
  title: string;
  description?: string;
  variant?: ToastVariant;
}) {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast: ToastMessage = { id, title, description, variant };
  toasts = [...toasts, newToast];
  notify();

  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }, 4000);
}

export function useToast() {
  const [currentToasts, setCurrentToasts] = React.useState<ToastMessage[]>(toasts);

  React.useEffect(() => {
    listeners.push(setCurrentToasts);
    return () => {
      const index = listeners.indexOf(setCurrentToasts);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return {
    toasts: currentToasts,
    toast,
    dismiss: (id: string) => {
      toasts = toasts.filter((t) => t.id !== id);
      notify();
    },
  };
}
