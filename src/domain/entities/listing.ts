// src/domain/entities/listing.ts
// Listing aggregate — placement context.

import { DomainError } from '@/lib/errors';

export type ListingStatus = 'OPEN' | 'CLOSED';

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
  get disciplines() { return this.props.disciplines; }
  get status() { return this.props.status; }
  get isModerated() { return this.props.isModerated; }
  get isOpen() { return this.props.status === 'OPEN' && this.props.isModerated; }

  close(): Listing {
    return new Listing({ ...this.props, status: 'CLOSED', updatedAt: new Date() });
  }

  moderate(): Listing {
    return new Listing({ ...this.props, isModerated: true, updatedAt: new Date() });
  }

  toObject(): ListingProps {
    return { ...this.props };
  }
}
