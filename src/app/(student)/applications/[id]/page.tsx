import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getThreadUseCase } from '@/lib/container';
import {
  mockApplications,
  mockListings,
  mockEmployerProfiles,
  mockStudentProfiles,
} from '@/lib/mock';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { OfferResponseButtons } from './OfferResponseButtons';
import { ApplicationMessagingSection } from './ApplicationMessagingSection';
import type { MessageProps } from '@/domain/entities/message';
import { getCompanyAvatarColor } from '@/lib/tokens';
import {
  ArrowLeft,
  Calendar,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  FileCheck,
  Download,
  ShieldCheck,
} from 'lucide-react';
import type { ApplicationStatus } from '@/domain/entities/application';

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/sign-in?callbackUrl=/applications/${id}`);
  }

  const application = mockApplications.find((a) => a.id === id);
  if (!application) {
    notFound();
  }

  const listing = mockListings.find((l) => l.id === application.listingId);
  if (!listing) {
    notFound();
  }

  const employer = mockEmployerProfiles.find((e) => e.id === listing.employerProfileId);
  const student = mockStudentProfiles.find((s) => s.id === application.studentId);

  const companyName = employer?.companyName || 'Verified Corporate Partner';
  const avatarColor = getCompanyAvatarColor(companyName);
  const initials = companyName.charAt(0).toUpperCase();

  let initialMessages: MessageProps[] = [];
  let initialIsLocked = ['ACCEPTED', 'DECLINED'].includes(application.status);

  try {
    const threadResult = await getThreadUseCase.execute({
      applicationId: application.id,
      userId: session.user.id,
    });
    initialMessages = threadResult.messages.map((m) => m.toObject());
    if (typeof threadResult.isLocked === 'boolean') {
      initialIsLocked = threadResult.isLocked;
    }
  } catch (err) {
    console.error('Error prefetching messages on server:', err);
  }

  const appliedDate = new Date(application.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const updatedDate = new Date(application.updatedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-7xl space-y-6 pb-14">
      <Link
        href={
          session.user.role === 'EMPLOYER'
            ? `/employer/listings/${listing.id}/applicants/${application.id}`
            : '/applications'
        }
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-indigo transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {session.user.role === 'EMPLOYER' ? 'Back to Applicants' : 'Back to My Applications'}
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-base font-bold shrink-0 shadow-xs"
                style={{ background: avatarColor }}
              >
                {initials}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">{companyName}</span>
                  {employer?.verificationStatus === 'VERIFIED' && <VerificationBadge size="md" />}
                </div>

                <h1 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-slate-900">
                  {listing.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {listing.location} {listing.isRemote && '(Remote)'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    6 Months SIWES
                  </span>
                </div>
              </div>
            </div>

            <div className="self-start sm:self-center">
              <StatusBadge status={application.status as ApplicationStatus} />
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* Action Box if OFFERED */}
          {session.user.role === 'STUDENT' && application.status === 'OFFERED' && (
            <div className="rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 p-4.5 sm:p-5 space-y-3.5">
              <div className="flex items-center gap-2.5 text-amber-900">
                <Sparkles className="w-4.5 h-4.5 text-amber-600 animate-pulse" />
                <h3 className="font-bold text-sm sm:text-base">You Received an Official SIWES Placement Offer!</h3>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                Accepting this offer confirms your industrial attachment with {companyName} and automatically generates your official university placement letter with supervisor contact details.
              </p>
              <OfferResponseButtons applicationId={application.id} />
            </div>
          )}

          {/* Official Acceptance Letter Banner if ACCEPTED */}
          {application.status === 'ACCEPTED' && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-emerald-950">
              <div className="flex items-start gap-3">
                <FileCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-bold">Official SIWES Acceptance Letter Ready</h4>
                  <p className="text-xs text-emerald-800">
                    Your placement is confirmed. Download your verified institutional letter to submit to your University SIWES Coordinator.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shrink-0 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" /> Download Letter (PDF)
              </button>
            </div>
          )}

          {/* Timeline & Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-[18px] bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Date Applied
              </span>
              <span className="font-semibold text-slate-900 mt-0.5 block">{appliedDate}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Last Status Update
              </span>
              <span className="font-semibold text-slate-900 mt-0.5 block">{updatedDate}</span>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                ITF Compliance
              </span>
              <span className="font-semibold text-indigo-700 mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Form 8 Approved
              </span>
            </div>
          </div>

          {/* Cover Note Section */}
          {application.note && (
            <div className="space-y-2">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Submitted Cover Note
              </h4>
              <div className="rounded-[18px] border border-slate-200/80 p-4.5 text-xs text-slate-800 bg-slate-50/50 leading-relaxed whitespace-pre-wrap">
                {application.note}
              </div>
            </div>
          )}

          {/* Messaging Section */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Direct In-Placement Messaging
            </h4>
            <ApplicationMessagingSection
              applicationId={application.id}
              currentUserId={session.user.id}
              initialMessages={initialMessages}
              initialIsLocked={initialIsLocked}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
