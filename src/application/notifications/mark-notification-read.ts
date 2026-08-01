// src/application/notifications/mark-notification-read.ts

import type { INotificationRepository } from '@/domain/ports/INotificationRepository';

export class MarkNotificationReadUseCase {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  async execute(notificationId: string, userId: string): Promise<void> {
    if (notificationId === 'all') {
      await this.notificationRepo.markAllAsRead(userId);
    } else {
      await this.notificationRepo.markAsRead(notificationId, userId);
    }
  }
}
