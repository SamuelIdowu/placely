// src/domain/entities/application.ts
// Domain Entity — Application aggregate root with state machine validation and helpers.
// Pure domain layer: ZERO external dependencies (no Next.js, Prisma, Resend, etc.).

import { validateTransition, isTerminalStatus } from '../value-objects/application-state-machine';

export type ApplicationStatus =
  | 'APPLIED'
  | 'SHORTLISTED'
  | 'OFFERED'
  | 'ACCEPTED'
  | 'DECLINED';

export type ApplicationType =
  | 'NATIVE'
  | 'EXTERNAL_PORTAL'
  | 'SIWES_OUTREACH';

export type OutreachStatus =
  | 'DRAFT'
  | 'LETTER_GENERATED'
  | 'SENT'
  | 'FOLLOWED_UP'
  | 'ACCEPTED'
  | 'REJECTED';

export interface ApplicationProps {
  id: string;
  listingId: string;
  studentId: string;
  status: ApplicationStatus;
  note?: string;
  applicationType?: ApplicationType;
  outreachStatus?: OutreachStatus | null;
  outreachLetterUrl?: string | null;
  externalCompanyContact?: string | null;
  claimToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function isTerminal(status: ApplicationStatus): boolean {
  return isTerminalStatus(status);
}

export class Application {
  private readonly props: ApplicationProps;

  constructor(props: ApplicationProps) {
    this.props = {
      ...props,
      applicationType: props.applicationType ?? 'NATIVE',
      outreachStatus: props.outreachStatus ?? null,
      outreachLetterUrl: props.outreachLetterUrl ?? null,
      externalCompanyContact: props.externalCompanyContact ?? null,
      claimToken: props.claimToken ?? null,
    };
  }

  get id(): string { return this.props.id; }
  get listingId(): string { return this.props.listingId; }
  get studentId(): string { return this.props.studentId; }
  get status(): ApplicationStatus { return this.props.status; }
  get note(): string | undefined { return this.props.note; }
  get applicationType(): ApplicationType { return this.props.applicationType ?? 'NATIVE'; }
  get outreachStatus(): OutreachStatus | null | undefined { return this.props.outreachStatus; }
  get outreachLetterUrl(): string | null | undefined { return this.props.outreachLetterUrl; }
  get externalCompanyContact(): string | null | undefined { return this.props.externalCompanyContact; }
  get claimToken(): string | null | undefined { return this.props.claimToken; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  isTerminal(): boolean {
    return isTerminalStatus(this.props.status);
  }

  canTransitionTo(targetStatus: ApplicationStatus, actorRole: 'EMPLOYER' | 'STUDENT'): boolean {
    try {
      validateTransition(this.props.status, targetStatus, actorRole);
      return true;
    } catch {
      return false;
    }
  }

  shortlist(): Application {
    validateTransition(this.props.status, 'SHORTLISTED', 'EMPLOYER');
    return new Application({ ...this.props, status: 'SHORTLISTED', updatedAt: new Date() });
  }

  sendOffer(): Application {
    validateTransition(this.props.status, 'OFFERED', 'EMPLOYER');
    return new Application({ ...this.props, status: 'OFFERED', updatedAt: new Date() });
  }

  accept(): Application {
    validateTransition(this.props.status, 'ACCEPTED', 'STUDENT');
    return new Application({ ...this.props, status: 'ACCEPTED', updatedAt: new Date() });
  }

  decline(actorRole: 'EMPLOYER' | 'STUDENT' = 'EMPLOYER'): Application {
    validateTransition(this.props.status, 'DECLINED', actorRole);
    return new Application({ ...this.props, status: 'DECLINED', updatedAt: new Date() });
  }

  updateOutreachStatus(status: OutreachStatus): Application {
    return new Application({ ...this.props, outreachStatus: status, updatedAt: new Date() });
  }

  toObject(): ApplicationProps {
    return { ...this.props };
  }
}

