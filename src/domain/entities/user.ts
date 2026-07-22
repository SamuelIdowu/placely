// src/domain/entities/user.ts
// User domain entity — identity context.
// Mirrors Prisma User model but has NO Prisma dependency.

export type UserRole = 'STUDENT' | 'EMPLOYER' | 'ADMIN';

export interface UserProps {
  id: string;
  email: string;
  role: UserRole;
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private readonly props: UserProps;

  constructor(props: UserProps) {
    this.props = props;
  }

  get id() { return this.props.id; }
  get email() { return this.props.email; }
  get role() { return this.props.role; }
  get emailVerified() { return this.props.emailVerified; }
  get isEmailVerified() { return !!this.props.emailVerified; }

  isStudent() { return this.props.role === 'STUDENT'; }
  isEmployer() { return this.props.role === 'EMPLOYER'; }
  isAdmin() { return this.props.role === 'ADMIN'; }

  toObject(): UserProps {
    return { ...this.props };
  }
}
