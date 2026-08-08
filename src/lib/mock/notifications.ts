import { NotificationItem, NotificationProps } from '@/domain/entities/notification';
import { mockUserProps } from './users';

const now = new Date();
const stu1 = mockUserProps.find(u => u.id === 'user-stu-1')!;
const emp1 = mockUserProps.find(u => u.id === 'user-emp-1')!;

export const mockNotificationProps: NotificationProps[] = [
  {
    id: 'notif-1',
    userId: stu1.id,
    title: 'Application Update',
    message: 'Your application to TechCorp Nigeria has been viewed.',
    type: 'APPLICATION_STATUS',
    linkUrl: '/dashboard/applications/app-1',
    isRead: false,
    createdAt: now,
  },
  {
    id: 'notif-2',
    userId: emp1.id,
    title: 'New Application',
    message: 'John Doe has applied for Frontend Developer Intern.',
    type: 'APPLICATION_STATUS',
    linkUrl: '/dashboard/listings/listing-1',
    isRead: false,
    createdAt: now,
  },
  {
    id: 'notif-3',
    userId: stu1.id,
    title: 'Profile Verified',
    message: 'Your student profile has been verified successfully.',
    type: 'VERIFICATION_UPDATE',
    linkUrl: '/dashboard/profile',
    isRead: true,
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  }
];

export const mockNotifications: NotificationItem[] = mockNotificationProps.map(props => new NotificationItem(props));
