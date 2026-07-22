// src/domain/entities/verification-request.ts
// VerificationRequest entity — verification context.

export type VerificationType = 'SCHOOL_ID' | 'CAC_DOCUMENT';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface VerificationRequestProps {
  id: string;
  type: VerificationType;
  documentUrl: string;
  status: VerificationStatus;
  adminNote?: string;
  reviewedAt?: Date;
  studentProfileId?: string;
  employerProfileId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class VerificationRequest {
  private readonly props: VerificationRequestProps;

  constructor(props: VerificationRequestProps) {
    if (!props.studentProfileId && !props.employerProfileId) {
      throw new Error('VerificationRequest must belong to a student or employer profile');
    }
    this.props = props;
  }

  get id() { return this.props.id; }
  get type() { return this.props.type; }
  get status() { return this.props.status; }
  get adminNote() { return this.props.adminNote; }

  approve(note?: string): VerificationRequest {
    return new VerificationRequest({
      ...this.props,
      status: 'VERIFIED',
      adminNote: note,
      reviewedAt: new Date(),
      updatedAt: new Date(),
    });
  }

  reject(note: string): VerificationRequest {
    return new VerificationRequest({
      ...this.props,
      status: 'REJECTED',
      adminNote: note,
      reviewedAt: new Date(),
      updatedAt: new Date(),
    });
  }

  toObject(): VerificationRequestProps {
    return { ...this.props };
  }
}
