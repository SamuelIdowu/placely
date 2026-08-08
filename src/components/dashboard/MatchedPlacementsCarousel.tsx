import React from "react";
import Link from "next/link";
import { VerificationBadge } from "@/components/shared/VerificationBadge";
import { MapPin, Banknote, ArrowRight, Sparkles, Building2 } from "lucide-react";
import { getCompanyAvatarColor } from "@/lib/tokens";

export interface MatchedListingItem {
  id: string;
  title: string;
  companyName: string;
  companyVerified: boolean;
  location: string;
  stipendText?: string;
  disciplines: string[];
  skills?: string[];
  isRemote?: boolean;
}

export interface MatchedPlacementsCarouselProps {
  discipline: string;
  university?: string;
  listings: MatchedListingItem[];
}

export function MatchedPlacementsCarousel({
  discipline,
  listings,
}: MatchedPlacementsCarouselProps) {
  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-indigo" />
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Top Matched Placements for {discipline}
          </h2>
        </div>
        <Link
          href={`/listings?discipline=${encodeURIComponent(discipline)}`}
          className="text-xs font-semibold text-brand-indigo hover:text-brand-indigo-hover transition-colors"
        >
          Explore All ({listings.length})
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="bg-card rounded-2xl p-6 text-center border border-dashed border-border">
          <Building2 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">
            No exact discipline matches found right now.
          </p>
          <Link
            href="/listings"
            className="mt-2 inline-block text-xs font-bold text-brand-indigo hover:text-brand-indigo-hover"
          >
            Browse all open SIWES placements
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {listings.slice(0, 4).map((listing) => {
            const avatarColor = getCompanyAvatarColor(listing.companyName);
            const initials = listing.companyName.charAt(0).toUpperCase();

            return (
              <div
                key={listing.id}
                className="bg-card rounded-2xl p-4.5 sm:p-5 border border-border shadow-2xs hover:border-brand-indigo transition-all hover:shadow-xs flex flex-col justify-between group"
              >
                <div>
                  {/* Company row */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs"
                        style={{ background: avatarColor }}
                      >
                        {initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-foreground">
                            {listing.companyName}
                          </span>
                          {listing.companyVerified && <VerificationBadge size="sm" />}
                        </div>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {listing.location} {listing.isRemote && "· Remote"}
                        </span>
                      </div>
                    </div>

                    {/* Stipend pill */}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stat-emerald-light text-stat-emerald border border-stat-emerald/30 shrink-0">
                      <Banknote className="w-3 h-3" />
                      {listing.stipendText ?? "₦60,000/mo"}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-xs sm:text-sm text-foreground group-hover:text-brand-indigo transition-colors line-clamp-1">
                    {listing.title}
                  </h3>

                  {/* Discipline tags */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {listing.disciplines.slice(0, 3).map((disc) => (
                      <span
                        key={disc}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-muted text-muted-foreground"
                      >
                        {disc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card footer CTA */}
                <div className="pt-3 mt-3 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground font-medium">
                    6 Months SIWES
                  </span>
                  <Link
                    href={`/listings/${listing.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-indigo group-hover:translate-x-0.5 transition-transform"
                  >
                    View & Apply <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
