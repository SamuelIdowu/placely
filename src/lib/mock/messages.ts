import { Message, MessageProps } from '@/domain/entities/message';
import { mockApplicationProps } from './applications';
import { mockUserProps } from './users';

const now = new Date();
const app1 = mockApplicationProps.find(a => a.id === 'app-1')!;

const stu1 = mockUserProps.find(u => u.id === 'user-stu-1')!;
const emp1 = mockUserProps.find(u => u.id === 'user-emp-1')!;

export const mockMessageProps: MessageProps[] = [
  {
    id: 'msg-1',
    applicationId: app1.id,
    senderId: stu1.id,
    senderRole: 'STUDENT',
    body: 'Hello! I am very interested in this role. When can we schedule an interview?',
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24), // 1 day ago
    sender: {
      email: stu1.email,
      name: 'John Doe',
      role: stu1.role,
    }
  },
  {
    id: 'msg-2',
    applicationId: app1.id,
    senderId: emp1.id,
    senderRole: 'EMPLOYER',
    body: 'Hi John, we are reviewing your application and will get back to you shortly.',
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 2), // 2 hours ago
    sender: {
      email: emp1.email,
      name: 'TechCorp HR',
      role: emp1.role,
    }
  }
];

export const mockMessages: Message[] = mockMessageProps.map(props => new Message(props));
