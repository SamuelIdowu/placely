// src/domain/entities/employer-profile.ts
// Employer profile entity — profile context.

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface EmployerProfileProps {
  id: string;
  userId: string;
  companyName: string;
  cacNumber: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  verificationStatus: VerificationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class EmployerProfile {
  private readonly props: EmployerProfileProps;

  constructor(props: EmployerProfileProps) {
    this.props = props;
  }

  get id() { return this.props.id; }
  get userId() { return this.props.userId; }
  get companyName() { return this.props.companyName; }
  get cacNumber() { return this.props.cacNumber; }
  get verificationStatus() { return this.props.verificationStatus; }
  get isVerified() { return this.props.verificationStatus === 'VERIFIED'; }

  canPostListings(): boolean {
    return this.isVerified;
  }

  markVerified(): EmployerProfile {
    return new EmployerProfile({ ...this.props, verificationStatus: 'VERIFIED', updatedAt: new Date() });
  }

  markRejected(): EmployerProfile {
    return new EmployerProfile({ ...this.props, verificationStatus: 'REJECTED', updatedAt: new Date() });
  }

  toObject(): EmployerProfileProps {
    return { ...this.props };
  }
}
