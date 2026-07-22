// src/domain/events/offer-sent.ts
// Domain event — raised when an employer sends an offer.

export interface OfferSentEvent {
  readonly type: 'offer.sent';
  readonly applicationId: string;
  readonly studentId: string;
  readonly listingTitle: string;
  readonly occurredAt: Date;
}

export const createOfferSentEvent = (
  applicationId: string,
  studentId: string,
  listingTitle: string,
): OfferSentEvent => ({
  type: 'offer.sent',
  applicationId,
  studentId,
  listingTitle,
  occurredAt: new Date(),
});
