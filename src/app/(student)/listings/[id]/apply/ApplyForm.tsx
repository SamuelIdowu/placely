'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FormGroup } from '@/components/ui/form-group';
import { submitApplicationAction } from './actions';
import { ArrowRight } from 'lucide-react';

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
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-800 font-medium">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-foreground">
            Cover Note to Employer <span className="text-muted-foreground font-normal">(Optional)</span>
          </span>
          <span className="text-body-muted tabular-nums">
            {note.length} / {maxChars}
          </span>
        </div>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, maxChars))}
          placeholder="Introduce yourself briefly and highlight relevant coursework, technical skills, or past engineering projects..."
          rows={4}
        />
      </div>

      <div className="pt-2 flex items-center justify-end gap-3">
        <Button
          type="submit"
          variant="indigo"
          size="lg"
          disabled={isSubmitting}
          className="gap-2 px-6"
        >
          {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
          {!isSubmitting && <ArrowRight className="w-4 h-4" />}
        </Button>
      </div>
    </form>
  );
}
