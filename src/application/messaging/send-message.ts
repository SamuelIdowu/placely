// src/application/messaging/send-message.ts
import type { IMessageRepository } from '@/domain/ports/IMessageRepository';
import type { EmailServicePort } from '@/domain/ports/email-service.port';
import { sendMessageSchema } from '@/domain/value-objects/message';
import { validateApplicationMessagingAccess } from '@/lib/auth-guards';
import { Message } from '@/domain/entities/message';

export interface SendMessageCommand {
  applicationId: string;
  senderUserId: string;
  body: string;
}

export class SendMessageUseCase {
  constructor(
    private readonly messageRepo: IMessageRepository,
    private readonly emailService?: EmailServicePort
  ) {}

  async execute(command: SendMessageCommand): Promise<Message> {
    // 1. Authorize user & fetch application details
    const access = await validateApplicationMessagingAccess(command.applicationId, command.senderUserId);

    // 2. Lock check: block messages on terminal status applications
    if (access.isTerminal) {
      throw new Error(`Cannot send messages on a closed application (status: ${access.status})`);
    }

    // 3. Validate payload schema
    const validated = sendMessageSchema.parse({ body: command.body });

    // 4. Save message via Repository
    const createdMessage = await this.messageRepo.create({
      applicationId: command.applicationId,
      senderId: command.senderUserId,
      body: validated.body,
    });

    // 5. Send notification email to the recipient (asynchronously)
    if (this.emailService && access.recipientEmail) {
      const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://placely.ng';
      const ctaPath =
        access.senderRole === 'STUDENT'
          ? `${appBaseUrl}/employer/listings/${access.listingId}/applicants/${access.applicationId}`
          : `${appBaseUrl}/applications/${access.applicationId}`;

      const senderDisplayName =
        access.senderRole === 'EMPLOYER'
          ? access.employerCompanyName
          : access.studentEmail;

      const recipientDisplayName =
        access.senderRole === 'STUDENT'
          ? access.employerCompanyName
          : access.studentEmail;

      this.emailService
        .sendNewMessageNotification({
          to: access.recipientEmail,
          recipientName: recipientDisplayName,
          senderName: senderDisplayName,
          listingTitle: access.listingTitle,
          messagePreview: validated.body,
          applicationUrl: ctaPath,
        })
        .catch((err) => {
          console.error('Failed to send new message email notification:', err);
        });
    }

    return createdMessage;
  }
}
