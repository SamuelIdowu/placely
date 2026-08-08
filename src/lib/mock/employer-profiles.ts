import { EmployerProfile, EmployerProfileProps } from '@/domain/entities/employer-profile';
import { mockUserProps } from './users';

const now = new Date();
const emp1 = mockUserProps.find(u => u.id === 'user-emp-1')!;
const emp2 = mockUserProps.find(u => u.id === 'user-emp-2')!;

export const mockEmployerProfileProps: EmployerProfileProps[] = [
  {
    id: 'emp-profile-1',
    userId: emp1.id,
    companyName: 'TechCorp Nigeria',
    cacNumber: 'RC123456',
    description: 'Leading software development firm specializing in fintech solutions.',
    logoUrl: 'https://example.com/techcorp-logo.png',
    websiteUrl: 'https://techcorp.com.ng',
    verificationStatus: 'VERIFIED',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'emp-profile-2',
    userId: emp2.id,
    companyName: 'BuildWell Construction',
    cacNumber: 'RC654321',
    description: 'Top-tier civil engineering and construction company.',
    websiteUrl: 'https://buildwell.com',
    verificationStatus: 'PENDING',
    createdAt: now,
    updatedAt: now,
  }
];

export const mockEmployerProfiles: EmployerProfile[] = mockEmployerProfileProps.map(props => new EmployerProfile(props));
