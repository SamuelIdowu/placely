'use client';

import * as React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { DISCIPLINES } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Search, MapPin, Filter, X } from 'lucide-react';
import { useDebounceSearch } from '@/hooks/useDebounceSearch';

export function FilterControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { keyword, setKeyword } = useDebounceSearch(300);

  const selectedDiscipline = searchParams.get('discipline') || '';
  const selectedLocation = searchParams.get('location') || '';
  const selectedRemote = searchParams.get('isRemote') === 'true';

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    setKeyword('');
    router.replace(pathname);
  };

  const hasActiveFilters =
    !!keyword || !!selectedDiscipline || !!selectedLocation || selectedRemote;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          Filter Listings
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-7 px-2"
          >
            <X className="w-3 h-3 mr-1" /> Clear All
          </Button>
        )}
      </div>

      <Separator />

      {/* Keyword Search */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Search Keyword
        </Label>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. Electrical, CAD, SIWES..."
            className="pl-9 text-sm rounded-[4px]"
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Location
        </Label>
        <div className="relative">
          <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            value={selectedLocation}
            onChange={(e) => updateParam('location', e.target.value || null)}
            placeholder="e.g. Lagos, Abuja, Port Harcourt"
            className="pl-9 text-sm rounded-[4px]"
          />
        </div>
      </div>

      {/* Remote Toggle */}
      <div className="pt-1">
        <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700 cursor-pointer select-none">
          <Checkbox
            checked={selectedRemote}
            onCheckedChange={(checked) =>
              updateParam('isRemote', checked ? 'true' : null)
            }
          />
          <span>Remote Positions Only</span>
        </label>
      </div>

      <Separator />

      {/* Engineering Discipline Filter */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Engineering Discipline
        </Label>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer select-none">
            <Checkbox
              checked={!selectedDiscipline}
              onCheckedChange={() => updateParam('discipline', null)}
            />
            <span className={!selectedDiscipline ? 'font-semibold text-slate-900' : ''}>
              All Disciplines
            </span>
          </label>

          {DISCIPLINES.map((disc) => {
            const isChecked = selectedDiscipline === disc;
            return (
              <label
                key={disc}
                className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer select-none"
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    updateParam('discipline', checked ? disc : null)
                  }
                />
                <span className={isChecked ? 'font-semibold text-slate-900' : ''}>
                  {disc}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function FilterSidebar() {
  return (
    <aside className="w-64 shrink-0 bg-white p-5 rounded-lg border border-slate-200 shadow-sm self-start sticky top-6 hidden md:block">
      <FilterControls />
    </aside>
  );
}
