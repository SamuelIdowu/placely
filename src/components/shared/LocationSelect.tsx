'use client';

import * as React from 'react';
import { MapPin, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NIGERIAN_STATES_AND_CITIES } from '@/lib/constants';

interface LocationSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

export function LocationSelect({ value, onChange, required, className }: LocationSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [showCustom, setShowCustom] = React.useState(false);
  const [customValue, setCustomValue] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = NIGERIAN_STATES_AND_CITIES.map((sc) => ({
    ...sc,
    cities: sc.cities.filter(
      (c) =>
        c.toLowerCase().includes(search.toLowerCase()) ||
        sc.state.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((sc) => sc.cities.length > 0 || sc.state.toLowerCase().includes(search.toLowerCase()));

  const isCustom = value && !NIGERIAN_STATES_AND_CITIES.some((sc) =>
    sc.cities.some((c) => c === value) || sc.state === value
  );

  const displayLabel = isCustom ? value : value || '';

  function selectLocation(city: string, state: string) {
    onChange(`${city}, ${state}`);
    setIsOpen(false);
    setSearch('');
  }

  function selectState(state: string) {
    onChange(state);
    setIsOpen(false);
    setSearch('');
  }

  function handleCustomSubmit() {
    if (customValue.trim()) {
      onChange(customValue.trim());
      setCustomValue('');
      setShowCustom(false);
      setIsOpen(false);
      setSearch('');
    }
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => { setIsOpen(!isOpen); setTimeout(() => inputRef.current?.focus(), 50); }}
        className={cn(
          'w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-xs rounded-xl border bg-slate-50/50 text-left transition-all',
          isOpen ? 'border-brand-indigo ring-2 ring-brand-indigo/20' : 'border-slate-200 hover:border-slate-300',
          !value && 'text-slate-400'
        )}
      >
        <span className="flex items-center gap-2 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate font-medium">{displayLabel || 'Select location'}</span>
        </span>
        <ChevronDown className={cn('w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {/* Hidden input for form submission */}
      <input type="hidden" name="location" value={value} required={required} />

      {/* Clear button */}
      {value && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onChange(''); }}
          className="absolute right-8 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Clear location"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-slate-100">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search state or city..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-indigo bg-slate-50/50"
            />
          </div>

          {/* Options */}
          <div className="max-h-60 overflow-y-auto p-1">
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-center text-xs text-slate-500">
                No matching locations found
              </div>
            )}

            {filtered.map((sc) => (
              <div key={sc.state}>
                {/* State header */}
                <button
                  type="button"
                  onClick={() => selectState(sc.state)}
                  className={cn(
                    'w-full text-left px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-colors',
                    value === sc.state
                      ? 'bg-brand-indigo text-white'
                      : 'text-slate-500 hover:bg-slate-50'
                  )}
                >
                  {sc.state}
                </button>
                {/* Cities */}
                {sc.cities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => selectLocation(city, sc.state)}
                    className={cn(
                      'w-full text-left pl-7 pr-3 py-1.5 text-xs rounded-md transition-colors',
                      value === `${city}, ${sc.state}`
                        ? 'bg-brand-indigo-light text-indigo-950 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    )}
                  >
                    {city}
                  </button>
                ))}
              </div>
            ))}

            {/* Custom input option */}
            <div className="border-t border-slate-100 mt-1 pt-1">
              {!showCustom ? (
                <button
                  type="button"
                  onClick={() => setShowCustom(true)}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-brand-indigo hover:bg-indigo-50 rounded-md transition-colors"
                >
                  + Enter a custom location
                </button>
              ) : (
                <form
                  onSubmit={(e) => { e.preventDefault(); handleCustomSubmit(); }}
                  className="px-3 py-2 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    placeholder="e.g. Warri Industrial Layout"
                    autoFocus
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-indigo"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-brand-indigo rounded-lg hover:bg-brand-indigo-hover transition-colors"
                  >
                    Add
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
