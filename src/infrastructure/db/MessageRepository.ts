// src/infrastructure/db/MessageRepository.ts
import { revalidatePath, revalidateTag } from 'next/cache';
import { prisma } from '@/infrastructure/db/prisma.client';
import type { IMessageRepository, CreateMessageDTO } from '@/domain/ports/IMessageRepository';
import { Message } from '@/domain/entities/message';
import { createId } from '@paralleldrive/cuid2';

export class MessageRepository implements IMessageRepository {
  async findByApplication(applicationId: string): Promise<Message[]> {
    const rows = await prisma.message.findMany({
      where: { applicationId },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
            student: {
              select: {
                id: true,
              },
            },
            employer: {
              select: {
                companyName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return rows.map((row) => {
      const senderName =
        row.sender.role === 'EMPLOYER' && row.sender.employer?.companyName
          ? row.sender.employer.companyName
          : row.sender.email;

      return new Message({
        id: row.id,
        applicationId: row.applicationId,
        senderId: row.senderId,
        senderRole: row.sender.role,
        body: row.body,
        createdAt: row.createdAt,
        sender: {
          email: row.sender.email,
          role: row.sender.role,
          name: senderName,
        },
      });
    });
  }

  async create(data: CreateMessageDTO): Promise<Message> {
    const row = await prisma.message.create({
      data: {
        id: createId(),
        applicationId: data.applicationId,
        senderId: data.senderId,
        body: data.body,
      },
      include: {
        sender: {
          select: {
            email: true,
            role: true,
            employer: {
              select: {
                companyName: true,
              },
            },
          },
        },
      },
    });

    // Revalidate paths for student application detail and employer applicant detail
    try {
      revalidatePath(`/student/applications/${data.applicationId}`);
      revalidatePath(`/employer/listings/[id]/applicants/${data.applicationId}`, 'page');
      revalidateTag(`application-${data.applicationId}-messages`, 'default');
    } catch {
      // Ignore cache revalidation errors when executed outside Next.js request context (e.g. unit tests)
    }

    const senderName =
      row.sender.role === 'EMPLOYER' && row.sender.employer?.companyName
        ? row.sender.employer.companyName
        : row.sender.email;

    return new Message({
      id: row.id,
      applicationId: row.applicationId,
      senderId: row.senderId,
      senderRole: row.sender.role,
      body: row.body,
      createdAt: row.createdAt,
      sender: {
        email: row.sender.email,
        role: row.sender.role,
        name: senderName,
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async countUnreadByApplication(applicationId: string, forUserId: string): Promise<number> {
    // Deferred for v1.x; returning 0
    return 0;
  }
}
