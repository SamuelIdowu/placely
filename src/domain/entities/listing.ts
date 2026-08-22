// src/domain/entities/listing.ts
// Listing aggregate — placement context.

import { DomainError } from '@/lib/errors';
import type { DisciplineTag } from '@/lib/constants';

export type ListingStatus = 'OPEN' | 'CLOSED';
export type ListingSourceType = 'NATIVE' | 'CURATED_EXTERNAL';
export type { DisciplineTag };

export interface ListingProps {
  id: string;
  employerProfileId?: string | null;
  sourceType?: ListingSourceType;
  externalUrl?: string | null;
  contactEmail?: string | null;
  externalCompany?: string | null;
  externalLogoUrl?: string | null;
  title: string;
  description: string;
  disciplines: string[];
  location: string;
  isRemote: boolean;
  stipendAmount?: number | null;
  isStipendNegotiable?: boolean;
  durationWeeks?: number | null;
  requirements?: string | null;
  applicationDeadline?: Date | null;
  maxApplicants?: number | null;
  status: ListingStatus;
  isModerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Listing {
  private readonly props: ListingProps;

  constructor(props: ListingProps) {
    if (!props.disciplines.length) {
      throw new DomainError('A listing must target at least one discipline');
    }
    this.props = {
      ...props,
      sourceType: props.sourceType ?? 'NATIVE',
      employerProfileId: props.employerProfileId ?? null,
      externalUrl: props.externalUrl ?? null,
      contactEmail: props.contactEmail ?? null,
      externalCompany: props.externalCompany ?? null,
      externalLogoUrl: props.externalLogoUrl ?? null,
      stipendAmount: props.stipendAmount ?? null,
      isStipendNegotiable: props.isStipendNegotiable ?? false,
      durationWeeks: props.durationWeeks ?? null,
      requirements: props.requirements ?? null,
      applicationDeadline: props.applicationDeadline ?? null,
      maxApplicants: props.maxApplicants ?? null,
    };
  }

  get id() { return this.props.id; }
  get employerProfileId() { return this.props.employerProfileId; }
  get sourceType() { return this.props.sourceType ?? 'NATIVE'; }
  get externalUrl() { return this.props.externalUrl; }
  get contactEmail() { return this.props.contactEmail; }
  get externalCompany() { return this.props.externalCompany; }
  get externalLogoUrl() { return this.props.externalLogoUrl; }
  get title() { return this.props.title; }
  get description() { return this.props.description; }
  get disciplines() { return this.props.disciplines; }
  get location() { return this.props.location; }
  get isRemote() { return this.props.isRemote; }
  get stipendAmount() { return this.props.stipendAmount; }
  get isStipendNegotiable() { return this.props.isStipendNegotiable; }
  get durationWeeks() { return this.props.durationWeeks; }
  get requirements() { return this.props.requirements; }
  get applicationDeadline() { return this.props.applicationDeadline; }
  get maxApplicants() { return this.props.maxApplicants; }
  get status() { return this.props.status; }
  get isModerated() { return this.props.isModerated; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  isOpen(): boolean {
    return this.props.status === 'OPEN' && !this.props.isModerated;
  }

  isExternal(): boolean {
    return this.props.sourceType === 'CURATED_EXTERNAL';
  }

  close(): Listing {
    return new Listing({ ...this.props, status: 'CLOSED', updatedAt: new Date() });
  }

  open(): Listing {
    return new Listing({ ...this.props, status: 'OPEN', updatedAt: new Date() });
  }

  toggleStatus(): Listing {
    const newStatus: ListingStatus = this.props.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    return new Listing({ ...this.props, status: newStatus, updatedAt: new Date() });
  }

  moderate(): Listing {
    return new Listing({ ...this.props, isModerated: true, updatedAt: new Date() });
  }

  toObject(): ListingProps {
    return { ...this.props };
  }
}

