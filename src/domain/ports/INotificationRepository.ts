// src/domain/ports/INotificationRepository.ts

import type { NotificationItem, NotificationType } from '@/domain/entities/notification';

export interface CreateNotificationDTO {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  linkUrl?: string | null;
}

export interface INotificationRepository {
  create(dto: CreateNotificationDTO): Promise<NotificationItem>;
  findByUser(userId: string, limit?: number): Promise<NotificationItem[]>;
  getUnreadCount(userId: string): Promise<number>;
  markAsRead(notificationId: string, userId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
}
