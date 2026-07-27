'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { submitApplicationAction } from './actions';

export function ApplyForm({ listingId }: { listingId: string }) {
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const maxChars = 500;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const res = await submitApplicationAction(listingId, note);

    if (!res.success) {
      setError(res.error ?? 'Submission failed');
      setIsSubmitting(false);
      return;
    }

    router.push('/applications');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-rose-50 border border-rose-200 p-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="note" className="text-sm font-semibold text-slate-900">
            Cover Note to Employer <span className="text-slate-400 font-normal">(Optional)</span>
          </Label>
          <span className="text-xs text-slate-500">
            {note.length} / {maxChars} characters
          </span>
        </div>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, maxChars))}
          placeholder="Introduce yourself briefly and highlight relevant coursework, technical skills, or past projects..."
          rows={4}
          className="rounded-[4px] border-slate-300 focus:border-slate-900 focus:ring-slate-900"
        />
      </div>

      <div className="pt-2 flex items-center justify-end gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-black hover:bg-slate-800 text-white rounded-[4px] px-6 font-medium"
        >
          {isSubmitting ? 'Submitting Application...' : 'Submit Application →'}
        </Button>
      </div>
    </form>
  );
}
