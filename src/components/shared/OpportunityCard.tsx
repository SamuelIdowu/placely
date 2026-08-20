import React from "react";
import Link from "next/link";
import { Bookmark, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface OpportunityCardProps {
  id: string;
  title: string;
  companyName: string;
  logoUrl?: string;
  stipend: string;
  location: string;
  discipline: string;
  duration?: string;
  isRemote?: boolean;
  hrefPrefix?: string;
  isBookmarked?: boolean;
  onBookmarkToggle?: (id: string) => void;
}

export function OpportunityCard({
  id,
  title,
  companyName,
  logoUrl,
  stipend,
  location,
  discipline,
  duration = "6 Months",
  isRemote = false,
  hrefPrefix = "/listings",
  isBookmarked = false,
  onBookmarkToggle,
}: OpportunityCardProps) {
  return (
    <Card
      variant="interactive"
      className="group p-5 flex flex-col justify-between space-y-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-muted/60 border border-border/80 p-2 flex items-center justify-center font-bold text-foreground text-base shrink-0 overflow-hidden">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={companyName}
                className="w-full h-full object-contain rounded-md"
              />
            ) : (
              companyName.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <Link
              href={`${hrefPrefix}/${id}`}
              className="font-bold text-foreground text-base leading-snug hover:text-brand-indigo transition-colors line-clamp-1 group-hover:text-brand-indigo"
            >
              {title}
            </Link>
            <p className="text-body-muted text-xs font-medium mt-0.5">{companyName}</p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Save listing"
          onClick={() => onBookmarkToggle?.(id)}
          className={cn(
            "p-2 rounded-full transition-all duration-150 ease-out active:scale-95 shrink-0",
            isBookmarked
              ? "text-brand-indigo bg-brand-indigo-light"
              : "text-muted-foreground hover:text-brand-indigo hover:bg-muted/80"
          )}
        >
          <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-brand-indigo")} />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="px-2.5 py-0.5 rounded-full bg-muted text-foreground text-xs font-medium">
          {discipline}
        </span>
        {duration && (
          <span className="px-2.5 py-0.5 rounded-full bg-muted text-body-muted text-xs font-medium flex items-center gap-1">
            <Clock className="w-3 h-3 text-muted-foreground" />
            {duration}
          </span>
        )}
        {isRemote && (
          <span className="px-2.5 py-0.5 rounded-full bg-brand-indigo-light text-brand-indigo text-xs font-semibold">
            Remote
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
            Stipend
          </span>
          <span className="font-extrabold text-brand-indigo text-sm sm:text-base tabular-nums">
            {stipend}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-body-muted font-medium">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
            {location}
          </div>

          <Link
            href={`${hrefPrefix}/${id}`}
            className="p-2 min-h-[44px] min-w-[44px] rounded-full bg-muted text-foreground hover:bg-brand-indigo hover:text-white transition-all duration-150 ease-out active:scale-95 flex items-center justify-center"
            title="View Details"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
