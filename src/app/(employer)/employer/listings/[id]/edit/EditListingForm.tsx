'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { DISCIPLINES } from '@/lib/constants';
import { updateListingAction } from './actions';
import type { ListingProps } from '@/domain/entities/listing';
import { LocationSelect } from '@/components/shared/LocationSelect';
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
  const [location, setLocation] = React.useState<string>(listing.location || '');
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
    formData.set('location', location);

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
              <Label className="text-sm font-medium text-slate-700">
                Location <span className="text-rose-500">*</span>
              </Label>
              <LocationSelect
                value={location}
                onChange={setLocation}
                required
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

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 border-b border-slate-100 pb-2">
              Stipend & Duration
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stipendAmount" className="text-sm font-medium text-slate-700">
                  Monthly Stipend (NGN)
                </Label>
                <Input
                  id="stipendAmount"
                  name="stipendAmount"
                  type="number"
                  min="0"
                  defaultValue={listing.stipendAmount ?? ''}
                  placeholder="e.g. 50000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="durationWeeks" className="text-sm font-medium text-slate-700">
                  Duration (Weeks)
                </Label>
                <Input
                  id="durationWeeks"
                  name="durationWeeks"
                  type="number"
                  min="1"
                  defaultValue={listing.durationWeeks ?? ''}
                  placeholder="e.g. 24"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicationDeadline" className="text-sm font-medium text-slate-700">
                  Application Deadline
                </Label>
                <Input
                  id="applicationDeadline"
                  name="applicationDeadline"
                  type="date"
                  defaultValue={listing.applicationDeadline ? new Date(listing.applicationDeadline).toISOString().split('T')[0] : ''}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxApplicants" className="text-sm font-medium text-slate-700">
                  Max Applicants
                </Label>
                <Input
                  id="maxApplicants"
                  name="maxApplicants"
                  type="number"
                  min="1"
                  defaultValue={listing.maxApplicants ?? ''}
                  placeholder="Leave empty for unlimited"
                />
              </div>

              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700 cursor-pointer">
                  <Checkbox
                    name="isStipendNegotiable"
                    checked={listing.isStipendNegotiable ?? false}
                    onCheckedChange={() => {}}
                  />
                  <span>Stipend is negotiable</span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements" className="text-sm font-medium text-slate-700">
              Requirements & Prerequisites
            </Label>
            <Textarea
              id="requirements"
              name="requirements"
              defaultValue={listing.requirements ?? ''}
              placeholder="e.g. Must be a 300-level engineering student, proficiency in CAD/MATLAB preferred..."
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="indigo"
              disabled={loading}
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
