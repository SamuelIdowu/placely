import { User, UserProps, UserRole } from '@/domain/entities/user';

const now = new Date();

export const mockUserProps: UserProps[] = [
  {
    id: 'user-stu-1',
    email: 'john.doe@university.edu.ng',
    role: 'STUDENT',
    emailVerified: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'user-stu-2',
    email: 'jane.smith@student.edu.ng',
    role: 'STUDENT',
    emailVerified: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'user-emp-1',
    email: 'hr@techcorp.com.ng',
    role: 'EMPLOYER',
    emailVerified: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'user-emp-2',
    email: 'careers@buildwell.com',
    role: 'EMPLOYER',
    emailVerified: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'user-admin-1',
    email: 'admin@placely.com',
    role: 'ADMIN',
    emailVerified: now,
    createdAt: now,
    updatedAt: now,
  }
];

export const mockUsers: User[] = mockUserProps.map(props => new User(props));
