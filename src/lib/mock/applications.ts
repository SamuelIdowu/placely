import { Application, ApplicationProps } from '@/domain/entities/application';
import { mockListingProps } from './listings';
import { mockStudentProfileProps } from './student-profiles';

const now = new Date();
const list1 = mockListingProps.find(l => l.id === 'listing-1')!;
const list3 = mockListingProps.find(l => l.id === 'listing-3')!;

const stu1 = mockStudentProfileProps.find(s => s.id === 'stu-profile-1')!;
const stu2 = mockStudentProfileProps.find(s => s.id === 'stu-profile-2')!;

export const mockApplicationProps: ApplicationProps[] = [
  {
    id: 'app-1',
    listingId: list1.id,
    studentId: stu1.id,
    status: 'APPLIED',
    note: 'I have experience with React and would love to contribute to TechCorp.',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'app-2',
    listingId: list3.id,
    studentId: stu2.id,
    status: 'SHORTLISTED',
    note: 'I am ready to get on site and learn practical civil engineering.',
    createdAt: now,
    updatedAt: now,
  }
];

export const mockApplications: Application[] = mockApplicationProps.map(props => new Application(props));
