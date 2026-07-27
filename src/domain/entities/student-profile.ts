// src/domain/entities/student-profile.ts
// Student profile entity — profile context.
// Contains the profile completeness algorithm (ADR-05: domain logic, not DB).

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface StudentProfileProps {
  id: string;
  userId: string;
  university: string;
  discipline: string;
  cgpa?: number;
  resumeUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  bio?: string;
  profileCompleteness: number; // 0–100
  verificationStatus: VerificationStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Section 14: Profile completeness algorithm — used as ORDER BY weight in employer browse
const COMPLETENESS_WEIGHTS: Record<keyof Pick<StudentProfileProps,
  'university' | 'discipline' | 'resumeUrl' | 'bio' | 'linkedinUrl' | 'cgpa'
>, number> = {
  university: 20,
  discipline: 20,
  resumeUrl: 30,
  bio: 15,
  linkedinUrl: 10,
  cgpa: 5,
};

export function computeCompleteness(profile: Omit<StudentProfileProps, 'profileCompleteness'>): number {
  return (Object.entries(COMPLETENESS_WEIGHTS) as [string, number][]).reduce(
    (score, [field, weight]) =>
      score + (profile[field as keyof typeof COMPLETENESS_WEIGHTS] ? weight : 0),
    0,
  );
}

export class StudentProfile {
  private readonly props: StudentProfileProps;

  constructor(props: StudentProfileProps) {
    this.props = props;
  }

  get id() { return this.props.id; }
  get userId() { return this.props.userId; }
  get university() { return this.props.university; }
  get discipline() { return this.props.discipline; }
  get cgpa() { return this.props.cgpa; }
  get resumeUrl() { return this.props.resumeUrl; }
  get linkedinUrl() { return this.props.linkedinUrl; }
  get portfolioUrl() { return this.props.portfolioUrl; }
  get bio() { return this.props.bio; }
  get profileCompleteness() { return this.props.profileCompleteness; }
  get verificationStatus() { return this.props.verificationStatus; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }
  get isVerified() { return this.props.verificationStatus === 'VERIFIED'; }

  canApply(): boolean {
    return this.isVerified && this.props.profileCompleteness >= 50;
  }

  markVerified(): StudentProfile {
    return new StudentProfile({ ...this.props, verificationStatus: 'VERIFIED', updatedAt: new Date() });
  }

  markRejected(): StudentProfile {
    return new StudentProfile({ ...this.props, verificationStatus: 'REJECTED', updatedAt: new Date() });
  }

  toObject(): StudentProfileProps {
    return { ...this.props };
  }
}
