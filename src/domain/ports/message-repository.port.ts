// src/domain/ports/message-repository.port.ts

import type { Message } from '@/domain/entities/message';

export interface MessageRepositoryPort {
  findByApplicationId(applicationId: string): Promise<Message[]>;
  save(message: Message): Promise<Message>;
}
