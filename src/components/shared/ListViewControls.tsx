"use client";

import { Search, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ListViewControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: "grid" | "list";
  onViewChange: (mode: "grid" | "list") => void;
  placeholder?: string;
  children?: React.ReactNode; // For any extra filters (like dropdowns)
}

export function ListViewControls({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewChange,
  placeholder = "Search...",
  children,
}: ListViewControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full mb-6">
      <div className="relative w-full sm:max-w-md shrink-0">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
          <Search className="h-4 w-4" />
        </div>
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-10 w-full bg-card rounded-full border-border shadow-sm focus-visible:ring-1 focus-visible:ring-primary"
        />
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
        {children}
        <div className="flex items-center bg-secondary rounded-full p-1 shrink-0 ml-auto sm:ml-0">
          <button
            onClick={() => onViewChange("list")}
            className={`p-1.5 rounded-full flex items-center justify-center transition-colors ${
              viewMode === "list"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewChange("grid")}
            className={`p-1.5 rounded-full flex items-center justify-center transition-colors ${
              viewMode === "grid"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
