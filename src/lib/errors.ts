// src/lib/errors.ts
// Domain error types — used by all domain entities and use cases.
// No external dependencies allowed in this file.

export class DomainError extends Error {
  readonly code: string;

  constructor(message: string, code = 'DOMAIN_ERROR') {
    super(message);
    this.name = 'DomainError';
    this.code = code;
    // Fix prototype chain for instanceof checks in transpiled code
    Object.setPrototypeOf(this, DomainError.prototype);
  }
}

export class NotFoundError extends DomainError {
  constructor(resource: string, id: string) {
    super(`${resource} not found: ${id}`, 'NOT_FOUND');
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class DuplicateApplicationError extends DomainError {
  constructor(message = 'Already applied to this listing') {
    super(message, 'DUPLICATE_APPLICATION');
    this.name = 'DuplicateApplicationError';
    Object.setPrototypeOf(this, DuplicateApplicationError.prototype);
  }
}

export class ListingClosedError extends DomainError {
  constructor(message = 'Listing is closed for applications') {
    super(message, 'LISTING_CLOSED');
    this.name = 'ListingClosedError';
    Object.setPrototypeOf(this, ListingClosedError.prototype);
  }
}
