// src/domain/ports/IMessageRepository.ts
import type { Message } from '../entities/message';

export interface CreateMessageDTO {
  applicationId: string;
  senderId: string;
  body: string;
}

export interface IMessageRepository {
  create(data: CreateMessageDTO): Promise<Message>;
  findByApplication(applicationId: string): Promise<Message[]>;
  countUnreadByApplication(applicationId: string, forUserId: string): Promise<number>;
}
