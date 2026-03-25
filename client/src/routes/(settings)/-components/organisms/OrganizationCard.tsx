import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Users, Briefcase, Settings } from 'lucide-react';

import { OrganizationHeader } from '../molecules/OgranizationHeader';
import { Jobs } from './Jobs';
import { useFetchOrganizationByURL } from '../../-hooks/useFetchOrganizationByURL';
import { Link } from '@tanstack/react-router';
import { JobsListSkeleton } from '../skeletons/JobListSkeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import NotFoundPage from '@/components/NotFound';
import ErrorFallbackCompact from '@/components/ErrorFallbackCompact';
import { Route } from '../../o.organization.$organizationURL';
import { ManageOrganizationMembers } from '../ManageOrganizationMembers';

const ADMIN_SECTIONS = [
  { key: 'members', label: 'Manage Members', icon: Users },
  { key: 'posted-jobs', label: 'Posted Jobs', icon: Briefcase },
  { key: 'settings', label: 'Settings', icon: Settings },
];

export const OrganizationCard = () => {
  const { data: organizationData, isLoading } = useFetchOrganizationByURL();
  const { tab } = Route.useSearch();
  const navigate = Route.useNavigate();

  if (isLoading) return null;
  if (!organizationData) return <NotFoundPage />;

  const { _id, name, description, logo, isAdmin } = organizationData;

  const activeTab = tab || 'posts';
  const isAdminSection = ADMIN_SECTIONS.some(s => s.key === activeTab);

  const handleTabChange = (nextTab: string) => {
    navigate({
      search: (prev: any) => ({ ...prev, tab: nextTab }),
      replace: true,
    });
  };

  return (
    <div className="bg-background mx-auto min-h-screen">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        {/* Header */}
        <div className="bg-card space-y-4 rounded-xl border p-6 shadow-sm">
          <OrganizationHeader name={name} logo={logo} />
          <div
            className="prose prose-sm text-muted-foreground max-w-none"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>

        {/* Main content */}
        <div className="flex items-start gap-4">
          {/* Admin sidebar */}
          {isAdmin && (
            <div className="bg-card w-48 shrink-0 overflow-hidden rounded-xl border shadow-sm">
              <div className="text-muted-foreground border-b px-4 py-3 text-xs font-semibold tracking-wider uppercase">
                Admin
              </div>
              <nav className="space-y-0.5 p-2">
                {ADMIN_SECTIONS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => handleTabChange(key)}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors',
                      activeTab === key
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </button>
                ))}
              </nav>

              {/* Quick actions */}
              <div className="space-y-0.5 border-t p-2">
                <Link
                  to="/job/new"
                  search={{ organizationId: _id }}
                  className="text-muted-foreground hover:bg-muted hover:text-foreground flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors"
                >
                  + Post Job
                </Link>
              </div>
            </div>
          )}

          {/* Content area */}
          <div className="bg-card min-w-0 flex-1 rounded-xl border p-6 shadow-sm">
            {/* Admin sections */}
            {isAdmin && isAdminSection ? (
              <>
                {activeTab === 'members' && (
                  <ErrorBoundary FallbackComponent={ErrorFallbackCompact}>
                    <Suspense
                      fallback={
                        <div className="text-muted-foreground text-sm">Loading members...</div>
                      }
                    >
                      <ManageOrganizationMembers organizationId={_id} />
                    </Suspense>
                  </ErrorBoundary>
                )}

                {activeTab === 'posted-jobs' && (
                  <ErrorBoundary FallbackComponent={ErrorFallbackCompact}>
                    <Suspense fallback={<JobsListSkeleton />}>
                      <Jobs organizationId={_id} />
                    </Suspense>
                  </ErrorBoundary>
                )}

                {activeTab === 'settings' && (
                  <ErrorBoundary FallbackComponent={ErrorFallbackCompact}>
                    <Suspense
                      fallback={
                        <div className="text-muted-foreground text-sm">Loading settings...</div>
                      }
                    >
                      {/* <OrganizationSettings organizationId={_id} /> */}
                      <p className="text-muted-foreground text-sm">Settings — coming soon.</p>
                    </Suspense>
                  </ErrorBoundary>
                )}
              </>
            ) : (
              /* Public tabs — visible to everyone */
              <Tabs value={activeTab} onValueChange={handleTabChange}>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
