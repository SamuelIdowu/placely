// src/components/messaging/MessageBubble.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { MessageProps } from '@/domain/entities/message';

export interface MessageBubbleProps {
  message: MessageProps;
  isOwnMessage: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage }) => {
  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const senderName = message.sender?.name || (isOwnMessage ? 'You' : 'Participant');

  return (
    <div className={cn('flex flex-col my-2', isOwnMessage ? 'items-end' : 'items-start')}>
      <div className="flex items-center gap-2 mb-1 px-1">
        <span className="text-xs font-semibold text-slate-600">{senderName}</span>
        <span className="text-[10px] text-slate-400">{formattedTime}</span>
      </div>

      <div
        className={cn(
          'px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap max-w-[85%] sm:max-w-[75%]',
          isOwnMessage
            ? 'bg-slate-900 text-white rounded-2xl rounded-tr-xs shadow-xs'
            : 'bg-slate-100 text-slate-900 border border-slate-200 rounded-2xl rounded-tl-xs shadow-xs'
        )}
      >
        {message.body}
      </div>
    </div>
  );
};
