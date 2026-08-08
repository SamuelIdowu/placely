// src/application/notifications/get-user-notifications.ts

import type { INotificationRepository } from '@/domain/ports/INotificationRepository';
import type { NotificationProps } from '@/domain/entities/notification';

export interface UserNotificationsResult {
  notifications: NotificationProps[];
  unreadCount: number;
}

export class GetUserNotificationsUseCase {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  async execute(userId: string): Promise<UserNotificationsResult> {
    const [items, unreadCount] = await Promise.all([
      this.notificationRepo.findByUser(userId, 20),
      this.notificationRepo.getUnreadCount(userId),
    ]);

    return {
      notifications: items.map((item) => item.toObject()),
      unreadCount,
    };
  }
}
