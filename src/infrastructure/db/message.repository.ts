// src/infrastructure/db/message.repository.ts

import { prisma } from '@/infrastructure/db/prisma.client';
import type { MessageRepositoryPort } from '@/domain/ports/message-repository.port';
import { Message } from '@/domain/entities/message';

export class PrismaMessageRepository implements MessageRepositoryPort {
  async findByApplicationId(applicationId: string): Promise<Message[]> {
    const rows = await prisma.message.findMany({
      where: { applicationId },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map((r: any) => this.toDomain(r));
  }

  async save(message: Message): Promise<Message> {
    const data = message.toObject();
    const row = await prisma.message.create({
      data: {
        id: data.id,
        applicationId: data.applicationId,
        senderId: data.senderId,
        body: data.body,
      },
    });
    return this.toDomain(row);
  }

  private toDomain(row: {
    id: string;
    applicationId: string;
    senderId: string;
    body: string;
    createdAt: Date;
  }): Message {
    return new Message({
      id: row.id,
      applicationId: row.applicationId,
      senderId: row.senderId,
      body: row.body,
      createdAt: row.createdAt,
    });
  }
}
