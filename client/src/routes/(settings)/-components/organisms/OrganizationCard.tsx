import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { OrganizationHeader } from '../molecules/OgranizationHeader';
import { Jobs } from './Jobs';
import { useFetchOrganizationByURL } from '../../-hooks/useFetchOrganizationByURL';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { JobsListSkeleton } from '../skeletons/JobListSkeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import NotFoundPage from '@/components/NotFound';
import ErrorFallbackCompact from '@/components/ErrorFallbackCompact';

export const OrganizationCard = () => {
  const { data: organizationData, isLoading } = useFetchOrganizationByURL();

  const navigate = useNavigate({ from: '/(settings)/o/organization/$organizationURL' });
  const { tab } = useSearch({ from: `/(settings)/o/organization/$organizationURL` });

  if (isLoading) {
    return null;
  }

  if (!organizationData) return <NotFoundPage />;

  const { _id, name, description, logo } = organizationData;

  const handleTabChange = (nextTab: string) => {
    navigate({
      search: (prev: any) => ({
        ...prev,
        tab: nextTab,
      }),
      replace: true,
    });
  };

  return (
    <div className="bg-background mx-auto min-h-screen">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <div className="bg-card space-y-4 rounded-xl border p-6 shadow-sm">
          <OrganizationHeader name={name} logo={logo} />

          <div
            className="prose prose-sm text-muted-foreground max-w-none"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>

        <div
          className={cn(
            'bg-muted/40 rounded-xl border p-4 shadow-sm',
            !organizationData.isAdmin && 'hidden',
          )}
        >
          <div className="text-muted-foreground mb-3 text-sm font-semibold">Admin Controls</div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/o/organization/$organizationURL/edit"
              params={{
                organizationURL: _id,
              }}
              className="bg-background hover:bg-muted rounded-md border px-4 py-2 text-sm font-medium transition"
            >
              Edit Profile
            </Link>

            <Link
              to="/organization/$organizationURL/members"
              params={{
                organizationURL: _id,
              }}
              className="bg-background hover:bg-muted rounded-md border px-4 py-2 text-sm font-medium transition"
            >
              Manage Members
            </Link>

            <Link
              to="/job/new"
              search={{ organizationId: _id }}
              className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium transition hover:opacity-90"
            >
              Post Job
            </Link>
            {/* 
            <Link
              to="/organization/$organizationURL/analytics"
              className="bg-background hover:bg-muted rounded-md border px-4 py-2 text-sm font-medium transition"
            >
              Analytics
            </Link> */}
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <Tabs value={tab || 'posts'} onValueChange={handleTabChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
            </TabsList>

            <TabsContent value="posts">
              <p className="text-muted-foreground">Organization posts will appear here.</p>
            </TabsContent>

            <TabsContent value="jobs">
              <ErrorBoundary FallbackComponent={ErrorFallbackCompact}>
                <Suspense fallback={<JobsListSkeleton />}>
                  <Jobs organizationId={_id} />
                </Suspense>
              </ErrorBoundary>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
