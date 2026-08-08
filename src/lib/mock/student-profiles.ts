import { StudentProfile, StudentProfileProps, computeCompleteness } from '@/domain/entities/student-profile';
import { mockUserProps } from './users';

const now = new Date();
const stu1 = mockUserProps.find(u => u.id === 'user-stu-1')!;
const stu2 = mockUserProps.find(u => u.id === 'user-stu-2')!;

export const mockStudentProfileProps: StudentProfileProps[] = [
  {
    id: 'stu-profile-1',
    userId: stu1.id,
    university: 'University of Lagos',
    discipline: 'Computer Science',
    cgpa: 4.5,
    resumeUrl: 'https://example.com/resume1.pdf',
    linkedinUrl: 'https://linkedin.com/in/johndoe',
    portfolioUrl: 'https://johndoe.dev',
    bio: 'Passionate software engineering student looking for a challenging SIWES placement.',
    profileCompleteness: 0, // will be computed below
    verificationStatus: 'VERIFIED',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'stu-profile-2',
    userId: stu2.id,
    university: 'Obafemi Awolowo University',
    discipline: 'Civil Engineering',
    cgpa: 3.8,
    resumeUrl: 'https://example.com/resume2.pdf',
    bio: 'Diligent engineering student eager to learn on the field.',
    profileCompleteness: 0, // will be computed below
    verificationStatus: 'PENDING',
    createdAt: now,
    updatedAt: now,
  }
];

// Compute profile completeness for the mock data
mockStudentProfileProps.forEach(profile => {
  profile.profileCompleteness = computeCompleteness(profile);
});

export const mockStudentProfiles: StudentProfile[] = mockStudentProfileProps.map(props => new StudentProfile(props));
