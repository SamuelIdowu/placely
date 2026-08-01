// src/domain/entities/notification.ts
// Notification entity — in-app notification context.

export type NotificationType =
  | 'APPLICATION_STATUS'
  | 'NEW_MESSAGE'
  | 'VERIFICATION_UPDATE'
  | 'LISTING_ALERT';

export interface NotificationProps {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  linkUrl?: string | null;
  isRead: boolean;
  createdAt: Date;
}

export class NotificationItem {
  private readonly props: NotificationProps;

  constructor(props: NotificationProps) {
    this.props = props;
  }

  get id() { return this.props.id; }
  get userId() { return this.props.userId; }
  get title() { return this.props.title; }
  get message() { return this.props.message; }
  get type() { return this.props.type; }
  get linkUrl() { return this.props.linkUrl; }
  get isRead() { return this.props.isRead; }
  get createdAt() { return this.props.createdAt; }

  markAsRead(): NotificationItem {
    return new NotificationItem({ ...this.props, isRead: true });
  }

  toObject(): NotificationProps {
    return { ...this.props };
  }
}
