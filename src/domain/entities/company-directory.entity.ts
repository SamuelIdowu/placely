// src/domain/entities/company-directory.entity.ts
// Domain Entity — CompanyDirectory for university IT-approved and verified SIWES employers.
// Zero external dependencies.

export interface CompanyDirectoryProps {
  id: string;
  name: string;
  industry: string;
  location: string;
  address?: string | null;
  contactEmail?: string | null;
  phone?: string | null;
  websiteUrl?: string | null;
  isUniversityApproved: boolean;
  approvedByUniversity?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class CompanyDirectory {
  private readonly props: CompanyDirectoryProps;

  constructor(props: CompanyDirectoryProps) {
    if (!props.name || !props.industry || !props.location) {
      throw new Error('Company name, industry, and location are required');
    }
    this.props = {
      ...props,
      address: props.address ?? null,
      contactEmail: props.contactEmail ?? null,
      phone: props.phone ?? null,
      websiteUrl: props.websiteUrl ?? null,
      approvedByUniversity: props.approvedByUniversity ?? null,
    };
  }

  get id(): string { return this.props.id; }
  get name(): string { return this.props.name; }
  get industry(): string { return this.props.industry; }
  get location(): string { return this.props.location; }
  get address(): string | null | undefined { return this.props.address; }
  get contactEmail(): string | null | undefined { return this.props.contactEmail; }
  get phone(): string | null | undefined { return this.props.phone; }
  get websiteUrl(): string | null | undefined { return this.props.websiteUrl; }
  get isUniversityApproved(): boolean { return this.props.isUniversityApproved; }
  get approvedByUniversity(): string | null | undefined { return this.props.approvedByUniversity; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  toObject(): CompanyDirectoryProps {
    return { ...this.props };
  }
}
