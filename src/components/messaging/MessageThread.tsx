// src/components/messaging/MessageThread.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Lock, Send } from 'lucide-react';
import type { MessageProps } from '@/domain/entities/message';

export interface MessageThreadProps {
  messages: MessageProps[];
  currentUserId: string;
  onSend: (body: string) => Promise<void>;
  isLocked?: boolean;
}

export const MessageThread: React.FC<MessageThreadProps> = ({
  messages,
  currentUserId,
  onSend,
  isLocked = false,
}) => {
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollBottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSubmitting || isLocked) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await onSend(inputText.trim());
      setInputText('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send message';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-[520px] rounded-lg border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Application Messages</h3>
        {isLocked && (
          <div className="flex items-center gap-1.5 text-xs text-amber-700 font-medium bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
            <Lock className="w-3.5 h-3.5" />
            <span>Thread Closed</span>
          </div>
        )}
      </div>

      {/* Messages Scroll Area */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              💬
            </div>
            <p className="text-sm font-medium text-slate-600">No messages yet</p>
            <p className="text-xs text-slate-400 mt-1">Start the conversation below.</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwnMessage={message.senderId === currentUserId}
            />
          ))
        )}
        <div ref={scrollBottomRef} />
      </ScrollArea>

      {/* Input Area / Locked Banner */}
      <div className="p-3.5 border-t border-slate-200 bg-slate-50/30">
        {isLocked ? (
          <div className="p-3 bg-slate-100 border border-slate-200 rounded-md flex items-center justify-center text-xs text-slate-600 font-medium gap-2">
            <Lock className="w-4 h-4 text-slate-500" />
            <span>This thread is locked because the application has reached a terminal status.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            {error && <p className="text-xs text-rose-600 font-medium px-1">{error}</p>}
            <div className="relative">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                className="pr-12 resize-none min-h-[72px] text-sm focus-visible:ring-slate-900 border-slate-300"
                maxLength={2000}
                disabled={isSubmitting}
              />
              <div className="absolute right-2.5 bottom-2.5 flex items-center gap-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={!inputText.trim() || isSubmitting}
                  className="h-8 w-8 p-0 rounded-md bg-slate-900 hover:bg-slate-800 text-white"
                >
                  <Send className="w-4 h-4" />
                  <span className="sr-only">Send Message</span>
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center px-1 text-[11px] text-slate-400">
              <span>Press Enter to send</span>
              <span className={inputText.length > 1900 ? 'text-amber-600 font-bold' : ''}>
                {inputText.length}/2000
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
