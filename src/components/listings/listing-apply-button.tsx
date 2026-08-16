'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SiwesOutreachModal } from '@/components/student/siwes-outreach-modal';
import { ArrowRight, ExternalLink, Send } from 'lucide-react';

interface ListingApplyButtonProps {
  listingId: string;
  sourceType: 'NATIVE' | 'CURATED_EXTERNAL';
  externalUrl?: string | null;
  contactEmail?: string | null;
  companyName: string;
  location: string;
  isStudentVerified: boolean;
  isStudent: boolean;
}

export function ListingApplyButton({
  listingId,
  sourceType,
  externalUrl,
  contactEmail,
  companyName,
  location,
  isStudentVerified,
  isStudent,
}: ListingApplyButtonProps) {
  const [isOutreachOpen, setIsOutreachOpen] = useState(false);

  if (!isStudent) {
    return (
      <Link
        href="/sign-in"
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-indigo hover:bg-brand-indigo-hover text-white text-sm font-semibold transition-all shadow-xs w-full md:w-auto"
      >
        Sign In to Apply
      </Link>
    );
  }

  // Curated External with Portal URL
  if (sourceType === 'CURATED_EXTERNAL' && externalUrl) {
    return (
      <a
        href={externalUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-xs w-full md:w-auto"
      >
        Apply on Company Portal <ExternalLink className="w-4 h-4" />
      </a>
    );
  }

  // Curated External with Email Contact -> Opens SIWES Outreach Assistant
  if (sourceType === 'CURATED_EXTERNAL' || contactEmail) {
    return (
      <>
        <Button
          onClick={() => setIsOutreachOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 h-auto rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-xs w-full md:w-auto"
        >
          Apply via SIWES Outreach <Send className="w-4 h-4" />
        </Button>

        <SiwesOutreachModal
          isOpen={isOutreachOpen}
          onClose={() => setIsOutreachOpen(false)}
          targetCompany={companyName}
          targetEmail={contactEmail}
          targetLocation={location}
          listingId={listingId}
        />
      </>
    );
  }

  // Native Listing on Placely
  if (!isStudentVerified) {
    return (
      <Link
        href="/profile/settings"
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs w-full md:w-auto"
      >
        Verify Student ID to Apply
      </Link>
    );
  }

  return (
    <Link
      href={`/listings/${listingId}/apply`}
      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-indigo hover:bg-brand-indigo-hover text-white text-sm font-semibold transition-all shadow-xs w-full md:w-auto"
    >
      Apply for Placement <ArrowRight className="w-4 h-4" />
    </Link>
  );
}
