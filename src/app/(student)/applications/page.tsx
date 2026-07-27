import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getMyApplicationsUseCase, studentProfileRepo } from '@/lib/container';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { ApplicationStatus } from '@/domain/entities/application';

export default async function MyApplicationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/sign-in?callbackUrl=/applications');
  }

  if (session.user.role !== 'STUDENT') {
    redirect('/employer/dashboard');
  }

  const studentProfile = await studentProfileRepo.findByUserId(session.user.id);
  if (!studentProfile) {
    redirect('/student/onboarding');
  }

  const rawApplications = await getMyApplicationsUseCase.execute(studentProfile.id);

  const applications = rawApplications.map((item) => ({
    id: item.application.id,
    listingId: item.listing.id,
    listingTitle: item.listing.title,
    companyName: item.listing.employer.companyName,
    verificationStatus: item.listing.employer.verificationStatus,
    location: item.listing.location,
    isRemote: item.listing.isRemote,
    status: item.application.status,
    appliedDate: new Date(item.application.createdAt).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  }));

  const activeApps = applications.filter((a) => ['APPLIED', 'SHORTLISTED', 'OFFERED'].includes(a.status));
  const completedApps = applications.filter((a) => ['ACCEPTED', 'DECLINED'].includes(a.status));

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            My Applications
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track and manage your submitted SIWES placement applications.
          </p>
        </div>
        <Link
          href="/listings"
          className="inline-flex items-center justify-center rounded-[4px] bg-black px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
        >
          Browse Open Listings →
        </Link>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-md mb-6">
          <TabsTrigger value="all" className="text-xs sm:text-sm font-semibold rounded-[4px]">
            All Applications ({applications.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="text-xs sm:text-sm font-semibold rounded-[4px]">
            Active ({activeApps.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs sm:text-sm font-semibold rounded-[4px]">
            Completed ({completedApps.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ApplicationsList items={applications} />
        </TabsContent>

        <TabsContent value="active">
          <ApplicationsList items={activeApps} />
        </TabsContent>

        <TabsContent value="completed">
          <ApplicationsList items={completedApps} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ApplicationsList({
  items,
}: {
  items: Array<{
    id: string;
    listingId: string;
    listingTitle: string;
    companyName: string;
    verificationStatus: string;
    location: string;
    isRemote: boolean;
    status: string;
    appliedDate: string;
  }>;
}) {
  if (items.length === 0) {
    return (
      <Card className="rounded-lg border border-slate-200 shadow-sm bg-white p-12 text-center">
        <CardContent className="space-y-3 pt-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            📑
          </div>
          <CardTitle className="text-lg font-semibold text-slate-900">
            No applications found
          </CardTitle>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            You haven&apos;t applied to any SIWES listings in this category yet. Explore verified engineering listings to get started.
          </p>
          <div className="pt-2">
            <Link
              href="/listings"
              className="inline-flex items-center justify-center rounded-[4px] bg-black px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
            >
              Browse Listings
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((app) => (
        <Link key={app.id} href={`/applications/${app.id}`}>
          <Card className="rounded-lg border border-slate-200 shadow-sm bg-white hover:border-slate-300 hover:shadow transition-all group">
            <CardHeader className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-base">
                    {app.listingTitle}
                  </span>
                  <VerificationBadge status={app.verificationStatus} />
                </div>
                <div className="text-xs sm:text-sm text-slate-600 flex flex-wrap items-center gap-2">
                  <span className="font-medium text-slate-800">{app.companyName}</span>
                  <span>•</span>
                  <span>{app.location} {app.isRemote && '(Remote)'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <span className="text-xs text-slate-500">
                  Applied {app.appliedDate}
                </span>
                <StatusBadge status={app.status as ApplicationStatus} />
              </div>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}
