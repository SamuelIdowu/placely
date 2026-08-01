// src/domain/entities/saved-listing.ts
// Saved Listing entity — student bookmark context.

export interface SavedListingProps {
  id: string;
  studentProfileId: string;
  listingId: string;
  createdAt: Date;
}

export class SavedListing {
  private readonly props: SavedListingProps;

  constructor(props: SavedListingProps) {
    this.props = props;
  }

  get id() { return this.props.id; }
  get studentProfileId() { return this.props.studentProfileId; }
  get listingId() { return this.props.listingId; }
  get createdAt() { return this.props.createdAt; }

  toObject(): SavedListingProps {
    return { ...this.props };
  }
}
