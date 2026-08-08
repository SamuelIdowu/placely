"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { VerificationPromoCard } from "./VerificationPromoCard";

export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [discipline, setDiscipline] = useState(searchParams.get("discipline") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [stipendRange, setStipendRange] = useState<number>(
    parseInt(searchParams.get("minStipend") || "30000", 10)
  );
  const [workMode, setWorkMode] = useState<string>(
    searchParams.get("isRemote") === "true"
      ? "Remote"
      : searchParams.get("isRemote") === "false"
      ? "On-Site"
      : "Any"
  );

  const activeTags = [
    discipline && { key: "discipline", label: discipline },
    location && { key: "location", label: location },
    keyword && { key: "keyword", label: `"${keyword}"` },
    workMode !== "Any" && { key: "workMode", label: workMode },
  ].filter(Boolean) as { key: string; label: string }[];

  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([k, v]) => {
      if (v) {
        params.set(k, v);
      } else {
        params.delete(k);
      }
    });
    params.set("page", "1");
    router.push(`/listings?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ keyword: keyword || null });
  };

  const removeTag = (key: string) => {
    if (key === "discipline") {
      setDiscipline("");
      updateFilters({ discipline: null });
    } else if (key === "location") {
      setLocation("");
      updateFilters({ location: null });
    } else if (key === "keyword") {
      setKeyword("");
      updateFilters({ keyword: null });
    } else if (key === "workMode") {
      setWorkMode("Any");
      updateFilters({ isRemote: null });
    }
  };

  const clearAll = () => {
    setKeyword("");
    setDiscipline("");
    setLocation("");
    setStipendRange(30000);
    setWorkMode("Any");
    router.push("/listings");
  };

  const disciplinesList = [
    "Computer Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Software Engineering",
  ];

  const locationsList = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Enugu"];

  return (
    <aside className="w-full md:w-72 shrink-0 space-y-6">
      <div className="bg-white rounded-lg border border-slate-200/80 shadow-md p-5 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            Filter Opportunities
          </div>
          {activeTags.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>

        {/* Active Tag Chips */}
        {activeTags.length > 0 && (
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Active Filters
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeTags.map((tag) => (
                <span
                  key={tag.key}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100"
                >
                  {tag.label}
                  <button
                    type="button"
                    onClick={() => removeTag(tag.key)}
                    className="hover:bg-indigo-200/60 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Keyword Search Input */}
        <form onSubmit={handleSearchSubmit} className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Keyword Search</label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Title, skill, or tech..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>
        </form>

        {/* Discipline Filter */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Discipline</label>
          <select
            value={discipline}
            onChange={(e) => {
              setDiscipline(e.target.value);
              updateFilters({ discipline: e.target.value || null });
            }}
            className="w-full px-3 py-2 text-xs rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 text-slate-800 font-medium"
          >
            <option value="">All Engineering Disciplines</option>
            {disciplinesList.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Location</label>
          <select
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              updateFilters({ location: e.target.value || null });
            }}
            className="w-full px-3 py-2 text-xs rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 text-slate-800 font-medium"
          >
            <option value="">All Locations</option>
            {locationsList.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Stipend Range Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-700">Min Stipend</label>
            <span className="font-extrabold text-indigo-600">
              ₦{stipendRange.toLocaleString()}/mo
            </span>
          </div>
          <input
            type="range"
            min="30000"
            max="150000"
            step="10000"
            value={stipendRange}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setStipendRange(val);
              updateFilters({ minStipend: val.toString() });
            }}
            className="w-full accent-indigo-600 bg-slate-200 h-1.5 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>₦30,000</span>
            <span>₦150,000+</span>
          </div>
        </div>

        {/* Segmented Work Mode Pills */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Work Mode</label>
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-md">
            {["Any", "On-Site", "Hybrid", "Remote"].map((mode) => {
              const active = workMode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    setWorkMode(mode);
                    if (mode === "Remote") updateFilters({ isRemote: "true" });
                    else if (mode === "On-Site") updateFilters({ isRemote: "false" });
                    else updateFilters({ isRemote: null });
                  }}
                  className={`py-1 text-[11px] font-semibold rounded transition-all text-center ${
                    active
                      ? "bg-white text-indigo-600 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {mode}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Verification Promo Callout */}
      <VerificationPromoCard />
    </aside>
  );
}
