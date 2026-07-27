'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { DISCIPLINES } from '@/lib/constants';
import { updateListingAction } from './actions';
import type { ListingProps } from '@/domain/entities/listing';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';

interface EditListingFormProps {
  listing: ListingProps;
}

export function EditListingForm({ listing }: EditListingFormProps) {
  const router = useRouter();
  const [selectedDisciplines, setSelectedDisciplines] = React.useState<string[]>(
    listing.disciplines || []
  );
  const [isRemote, setIsRemote] = React.useState<boolean>(listing.isRemote || false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const toggleDiscipline = (disc: string) => {
    setSelectedDisciplines((prev) =>
      prev.includes(disc) ? prev.filter((d) => d !== disc) : [...prev, disc]
    );
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (selectedDisciplines.length === 0) {
      setError('Please select at least one engineering discipline');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    selectedDisciplines.forEach((d) => formData.append('disciplines', d));
    formData.set('isRemote', isRemote ? 'true' : 'false');

    const res = await updateListingAction(listing.id, formData);
    setLoading(false);

    if (res.success) {
      router.push('/employer/listings');
    } else {
      setError(res.error || 'Failed to update listing');
    }
  }

  return (
    <Card className="rounded-lg shadow-sm border border-slate-200">
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg">Update Details</CardTitle>
        <CardDescription>Make changes to your active internship post</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm rounded-md bg-rose-50 text-rose-700 border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-slate-700">
              Listing Title <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              defaultValue={listing.title}
              required
              minLength={3}
              maxLength={120}
              className="rounded-[4px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-slate-700">
              Role Description & Requirements <span className="text-rose-500">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={listing.description}
              required
              minLength={20}
              rows={6}
              className="rounded-[4px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Target Engineering Disciplines <span className="text-rose-500">*</span>
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              {DISCIPLINES.map((disc) => {
                const checked = selectedDisciplines.includes(disc);
                return (
                  <label
                    key={disc}
                    className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggleDiscipline(disc)}
                    />
                    <span>{disc}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-slate-700">
                Location <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="location"
                name="location"
                defaultValue={listing.location}
                required
                className="rounded-[4px]"
              />
            </div>

            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700 cursor-pointer">
                <Checkbox
                  checked={isRemote}
                  onCheckedChange={(c) => setIsRemote(!!c)}
                />
                <span>Remote / Hybrid position</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="rounded-[4px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-[4px] bg-slate-900 text-white hover:bg-slate-800"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
