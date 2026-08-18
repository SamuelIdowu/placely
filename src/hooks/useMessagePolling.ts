// src/hooks/useMessagePolling.ts
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { MessageProps } from '@/domain/entities/message';

export interface UseMessagePollingOptions {
  applicationId: string;
  initialMessages?: MessageProps[];
  initialIsLocked?: boolean;
  intervalMs?: number;
}

export function useMessagePolling({
  applicationId,
  initialMessages = [],
  initialIsLocked = false,
  intervalMs = 10000,
}: UseMessagePollingOptions) {
  const [messages, setMessages] = useState<MessageProps[]>(initialMessages);
  const [isLocked, setIsLocked] = useState<boolean>(initialIsLocked);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isLockedRef = useRef(isLocked);
  useEffect(() => {
    isLockedRef.current = isLocked;
  }, [isLocked]);

  const fetchMessages = useCallback(async () => {
    if (!applicationId || isLockedRef.current) return;

    try {
      const res = await fetch(`/api/applications/${applicationId}/messages`, {
        cache: 'no-store',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to fetch messages (${res.status})`);
      }

      const data = await res.json();
      if (Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
      if (typeof data.isLocked === 'boolean') {
        setIsLocked(data.isLocked);
      }
      setError(null);
    } catch (err: unknown) {
      console.error('Error polling messages:', err);
    }
  }, [applicationId]);

  const initialFetchSkipped = useRef(initialMessages.length > 0);

  useEffect(() => {
    if (isLocked) return;

    let isMounted = true;
    const runFetch = async () => {
      if (isMounted) {
        await fetchMessages();
      }
    };

    if (!initialFetchSkipped.current) {
      runFetch();
    } else {
      initialFetchSkipped.current = false;
    }

    const intervalId = setInterval(() => {
      runFetch();
    }, intervalMs);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [fetchMessages, intervalMs, isLocked]);

  const sendMessage = useCallback(
    async (body: string) => {
      if (!body.trim() || isSending || isLocked) return;

      setIsSending(true);
      setError(null);

      try {
        const res = await fetch(`/api/applications/${applicationId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ body }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to send message');
        }

        const data = await res.json();
        if (data.message) {
          setMessages((prev) => {
            const exists = prev.some((m) => m.id === data.message.id);
            return exists ? prev : [...prev, data.message];
          });
        }
        await fetchMessages();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to send message';
        setError(msg);
        throw err;
      } finally {
        setIsSending(false);
      }
    },
    [applicationId, fetchMessages, isLocked, isSending]
  );

  return {
    messages,
    isLocked,
    isSending,
    error,
    sendMessage,
    refetch: fetchMessages,
  };
}
