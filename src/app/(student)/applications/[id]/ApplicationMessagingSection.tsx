// src/app/(student)/applications/[id]/ApplicationMessagingSection.tsx
'use client';

import React from 'react';
import { useMessagePolling } from '@/hooks/useMessagePolling';
import { MessageThread } from '@/components/messaging/MessageThread';
import type { MessageProps } from '@/domain/entities/message';

export interface ApplicationMessagingSectionProps {
  applicationId: string;
  currentUserId: string;
  initialMessages: MessageProps[];
  initialIsLocked: boolean;
}

export const ApplicationMessagingSection: React.FC<ApplicationMessagingSectionProps> = ({
  applicationId,
  currentUserId,
  initialMessages,
  initialIsLocked,
}) => {
  const { messages, isLocked, sendMessage } = useMessagePolling({
    applicationId,
    initialMessages,
    initialIsLocked,
    intervalMs: 10000,
  });

  return (
    <div className="pt-4 border-t border-slate-100">
      <MessageThread
        messages={messages}
        currentUserId={currentUserId}
        onSend={sendMessage}
        isLocked={isLocked}
      />
    </div>
  );
};
