import React from "react";
import Link from "next/link";
import { Bookmark, MapPin, Clock, ArrowUpRight } from "lucide-react";
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
    <div className="group bg-white rounded-lg border border-slate-100 shadow-md hover:shadow-lg transition-all duration-200 p-5 flex flex-col justify-between space-y-4 relative">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 p-2 flex items-center justify-center font-bold text-slate-700 text-base shrink-0 overflow-hidden">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={companyName}
                className="w-full h-full object-contain rounded"
              />
            ) : (
              companyName.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <Link
              href={`${hrefPrefix}/${id}`}
              className="font-bold text-slate-900 text-base leading-snug hover:text-indigo-600 transition-colors line-clamp-1 group-hover:text-indigo-600"
            >
              {title}
            </Link>
            <p className="text-slate-500 text-xs font-medium mt-0.5">{companyName}</p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Save listing"
          onClick={() => onBookmarkToggle?.(id)}
          className={cn(
            "p-2 rounded-md transition-colors shrink-0",
            isBookmarked
              ? "text-indigo-600 bg-indigo-50"
              : "text-slate-400 hover:text-indigo-600 hover:bg-slate-50"
          )}
        >
          <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-indigo-600")} />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
          {discipline}
        </span>
        {duration && (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {duration}
          </span>
        )}
        {isRemote && (
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
            Remote
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
            Stipend
          </span>
          <span className="font-extrabold text-indigo-600 text-sm sm:text-base">
            {stipend}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-slate-500 font-medium">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {location}
          </div>

          <Link
            href={`${hrefPrefix}/${id}`}
            className="p-1.5 rounded-md bg-slate-50 text-slate-600 hover:bg-indigo-600 hover:text-white transition-colors"
            title="View Details"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
