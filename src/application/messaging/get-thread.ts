// src/application/messaging/get-thread.ts
import type { IMessageRepository } from '@/domain/ports/IMessageRepository';
import { validateApplicationMessagingAccess } from '@/lib/auth-guards';
import type { Message } from '@/domain/entities/message';

export interface GetThreadQuery {
  applicationId: string;
  userId: string;
}

export interface ThreadResult {
  messages: Message[];
  isLocked: boolean;
  status: string;
}

export class GetThreadUseCase {
  constructor(private readonly messageRepo: IMessageRepository) {}

  async execute(query: GetThreadQuery): Promise<ThreadResult> {
    // 1. Authorize user has access to application thread
    const access = await validateApplicationMessagingAccess(query.applicationId, query.userId);

    // 2. Fetch thread messages
    const messages = await this.messageRepo.findByApplication(query.applicationId);

    return {
      messages,
      isLocked: access.isTerminal,
      status: access.status,
    };
  }
}
