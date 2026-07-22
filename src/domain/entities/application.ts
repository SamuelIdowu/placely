// src/domain/entities/application.ts
// Application aggregate root — enforces SIWES placement workflow state machine.
// No external dependencies (Clean Architecture: domain layer is pure).

import { DomainError } from '@/lib/errors';

export type ApplicationStatus =
  | 'APPLIED'
  | 'SHORTLISTED'
  | 'OFFERED'
  | 'ACCEPTED'
  | 'DECLINED';

export interface ApplicationProps {
  id: string;
  listingId: string;
  studentId: string;
  status: ApplicationStatus;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Application {
  private readonly props: ApplicationProps;

  constructor(props: ApplicationProps) {
    this.props = props;
  }

  get id() { return this.props.id; }
  get listingId() { return this.props.listingId; }
  get studentId() { return this.props.studentId; }
  get status() { return this.props.status; }
  get note() { return this.props.note; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  // Business rule: employer can only shortlist from APPLIED
  shortlist(): Application {
    if (this.props.status !== 'APPLIED') {
      throw new DomainError('Only APPLIED applications can be shortlisted');
    }
    return new Application({ ...this.props, status: 'SHORTLISTED', updatedAt: new Date() });
  }

  // Business rule: offer requires shortlisted state
  sendOffer(): Application {
    if (this.props.status !== 'SHORTLISTED') {
      throw new DomainError('Only SHORTLISTED applications can receive offers');
    }
    return new Application({ ...this.props, status: 'OFFERED', updatedAt: new Date() });
  }

  // Business rule: student can only accept offers
  accept(): Application {
    if (this.props.status !== 'OFFERED') {
      throw new DomainError('Only OFFERED applications can be accepted');
    }
    return new Application({ ...this.props, status: 'ACCEPTED', updatedAt: new Date() });
  }

  decline(): Application {
    if (!(['APPLIED', 'SHORTLISTED', 'OFFERED'] as ApplicationStatus[]).includes(this.props.status)) {
      throw new DomainError('Cannot decline at current status');
    }
    return new Application({ ...this.props, status: 'DECLINED', updatedAt: new Date() });
  }

  toObject(): ApplicationProps {
    return { ...this.props };
  }
}
