// src/infrastructure/db/NotificationRepository.ts

import { prisma } from '@/infrastructure/db/prisma.client';
import type { INotificationRepository, CreateNotificationDTO } from '@/domain/ports/INotificationRepository';
import { NotificationItem, type NotificationType } from '@/domain/entities/notification';
import { createId } from '@paralleldrive/cuid2';

export class PrismaNotificationRepository implements INotificationRepository {
  async create(dto: CreateNotificationDTO): Promise<NotificationItem> {
    const row = await prisma.notification.create({
      data: {
        id: createId(),
        userId: dto.userId,
        title: dto.title,
        message: dto.message,
        type: dto.type,
        linkUrl: dto.linkUrl ?? null,
      },
    });

    return this.toDomain(row);
  }

  async findByUser(userId: string, limit = 20): Promise<NotificationItem[]> {
    try {
      const rows = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
      return rows.map((r) => this.toDomain(r));
    } catch (err) {
      console.error('[PrismaNotificationRepository] findByUser error:', err);
      return [];
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      return await prisma.notification.count({
        where: { userId, isRead: false },
      });
    } catch (err) {
      console.error('[PrismaNotificationRepository] getUnreadCount error:', err);
      return 0;
    }
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    try {
      await prisma.notification.updateMany({
        where: { id: notificationId, userId },
        data: { isRead: true },
      });
    } catch (err) {
      console.error('[PrismaNotificationRepository] markAsRead error:', err);
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });
    } catch (err) {
      console.error('[PrismaNotificationRepository] markAllAsRead error:', err);
    }
  }

  private toDomain(row: {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: string;
    linkUrl: string | null;
    isRead: boolean;
    createdAt: Date;
  }): NotificationItem {
    return new NotificationItem({
      id: row.id,
      userId: row.userId,
      title: row.title,
      message: row.message,
      type: row.type as NotificationType,
      linkUrl: row.linkUrl,
      isRead: row.isRead,
      createdAt: row.createdAt,
    });
  }
}
