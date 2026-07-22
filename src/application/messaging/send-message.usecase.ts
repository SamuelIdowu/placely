// src/application/messaging/send-message.usecase.ts
// ADR-02: Polling for messages, no WebSocket at MVP.

import type { MessageRepositoryPort } from '@/domain/ports/message-repository.port';
import type { ApplicationRepositoryPort } from '@/domain/ports/application-repository.port';
import { Message } from '@/domain/entities/message';
import { createId } from '@paralleldrive/cuid2';

export interface SendMessageInput {
  applicationId: string;
  senderId: string; // User.id
  body: string;
}

export interface SendMessageOutput {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class SendMessageUseCase {
  constructor(
    private readonly messages: MessageRepositoryPort,
    private readonly applications: ApplicationRepositoryPort,
  ) {}

  async execute(input: SendMessageInput): Promise<SendMessageOutput> {
    // Guard: application must exist
    const application = await this.applications.findById(input.applicationId);
    if (!application) return { success: false, error: 'Application not found' };

    // Guard: only active applications can have messages
    if (['DECLINED'].includes(application.status)) {
      return { success: false, error: 'Cannot message on a declined application' };
    }

    const message = new Message({
      id: createId(),
      applicationId: input.applicationId,
      senderId: input.senderId,
      body: input.body.trim(),
      createdAt: new Date(),
    });

    const saved = await this.messages.save(message);
    return { success: true, messageId: saved.id };
  }
}
