// src/domain/entities/listing.ts
// Listing aggregate — placement context.

import { DomainError } from '@/lib/errors';
import type { DisciplineTag } from '@/lib/constants';

export type ListingStatus = 'OPEN' | 'CLOSED';
export type { DisciplineTag };

export interface ListingProps {
  id: string;
  employerProfileId: string;
  title: string;
  description: string;
  disciplines: string[];
  location: string;
  isRemote: boolean;
  status: ListingStatus;
  isModerated: boolean; // admin flag
  createdAt: Date;
  updatedAt: Date;
}

export class Listing {
  private readonly props: ListingProps;

  constructor(props: ListingProps) {
    if (!props.disciplines.length) {
      throw new DomainError('A listing must target at least one discipline');
    }
    this.props = props;
  }

  get id() { return this.props.id; }
  get employerProfileId() { return this.props.employerProfileId; }
  get title() { return this.props.title; }
  get description() { return this.props.description; }
  get disciplines() { return this.props.disciplines; }
  get location() { return this.props.location; }
  get isRemote() { return this.props.isRemote; }
  get status() { return this.props.status; }
  get isModerated() { return this.props.isModerated; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  isOpen(): boolean {
    return this.props.status === 'OPEN' && !this.props.isModerated;
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
