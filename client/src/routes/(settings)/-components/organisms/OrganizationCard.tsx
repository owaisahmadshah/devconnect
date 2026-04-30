import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Users, Briefcase, Settings, LayoutGrid, PlusCircle } from 'lucide-react';

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
  { key: 'members', label: 'Members', icon: Users },
  { key: 'posted-jobs', label: 'Job Listings', icon: Briefcase },
  { key: 'settings', label: 'Configuration', icon: Settings },
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
    <div className="bg-background min-h-screen pb-20">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        {/* Brand Header Card */}
        <div className="border-border/40 bg-card shadow-primary/5 relative overflow-hidden rounded-[2rem] border shadow-2xl">
          <div className="from-primary/5 absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-50" />
          <div className="relative space-y-6 p-8 md:p-10">
            <OrganizationHeader name={name} logo={logo} />
            <div
              className="prose prose-sm text-muted-foreground/90 max-w-3xl leading-relaxed font-medium"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Admin Navigation Sidebar */}
          {isAdmin && (
            <aside className="w-full shrink-0 lg:w-64">
              <div className="sticky top-6 space-y-6">
                <div className="border-border/40 bg-card rounded-2xl border p-2 shadow-sm">
                  <div className="px-4 py-3">
                    <p className="text-muted-foreground/60 text-[10px] font-black tracking-[0.2em] uppercase">
                      Organization Admin
                    </p>
                  </div>
                  <nav className="space-y-1">
                    <button
                      onClick={() => handleTabChange('posts')}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold tracking-tight uppercase transition-all',
                        activeTab === 'posts' || activeTab === 'jobs'
                          ? 'bg-primary text-primary-foreground shadow-primary/20 shadow-lg'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                    >
                      <LayoutGrid className="size-4" />
                      Public View
                    </button>

                    <div className="bg-border/40 mx-2 my-2 h-px" />

                    {ADMIN_SECTIONS.map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        onClick={() => handleTabChange(key)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold tracking-tight uppercase transition-all',
                          activeTab === key
                            ? 'bg-muted text-foreground'
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                        )}
                      >
                        <Icon
                          className={cn(
                            'size-4',
                            activeTab === key ? 'text-primary' : 'text-muted-foreground',
                          )}
                        />
                        {label}
                      </button>
                    ))}
                  </nav>

                  <div className="border-border/40 mt-4 border-t p-2">
                    <Link
                      to="/job/new"
                      search={{ organizationId: _id }}
                      className="group bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[11px] font-black tracking-widest uppercase transition-all"
                    >
                      <PlusCircle className="size-4 transition-transform group-hover:rotate-90" />
                      Post Position
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Dynamic Content Container */}
          <main className="min-w-0 flex-1">
            <div className="border-border/40 bg-card rounded-[2rem] border p-6 shadow-xl md:p-8">
              {isAdmin && isAdminSection ? (
                <div className="space-y-6">
                  <header className="mb-8">
                    <h2 className="text-foreground text-xl font-black tracking-widest uppercase">
                      {ADMIN_SECTIONS.find(s => s.key === activeTab)?.label}
                    </h2>
                    <div className="bg-primary mt-2 h-1 w-12 rounded-full" />
                  </header>

                  {activeTab === 'members' && (
                    <ErrorBoundary FallbackComponent={ErrorFallbackCompact}>
                      <Suspense
                        fallback={
                          <div className="text-muted-foreground animate-pulse text-[10px] font-bold tracking-widest uppercase">
                            Synchronizing Members...
                          </div>
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
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <Settings className="text-muted-foreground size-12 stroke-[1px] opacity-20" />
                      <p className="text-muted-foreground mt-4 text-[11px] font-black tracking-widest uppercase">
                        Configuration module under construction
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Public Interface */
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                  <TabsList className="mb-8 h-12 w-full justify-start gap-8 border-none bg-transparent p-0">
                    <TabsTrigger
                      value="posts"
                      className="data-[state=active]:border-primary data-[state=active]:text-foreground rounded-none border-b-2 border-transparent px-0 pb-3 text-sm font-black tracking-widest uppercase data-[state=active]:bg-transparent"
                    >
                      Insights
                    </TabsTrigger>
                    <TabsTrigger
                      value="jobs"
                      className="data-[state=active]:border-primary data-[state=active]:text-foreground rounded-none border-b-2 border-transparent px-0 pb-3 text-sm font-black tracking-widest uppercase data-[state=active]:bg-transparent"
                    >
                      Open Roles
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="posts" className="focus-visible:outline-none">
                    <div className="text-muted-foreground flex flex-col items-center justify-center py-20 text-center">
                      <LayoutGrid className="size-10 stroke-[1px] opacity-20" />
                      <p className="mt-4 text-[11px] font-black tracking-widest uppercase">
                        No activity recorded yet
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="jobs" className="focus-visible:outline-none">
                    <ErrorBoundary FallbackComponent={ErrorFallbackCompact}>
                      <Suspense fallback={<JobsListSkeleton />}>
                        <Jobs organizationId={_id} />
                      </Suspense>
                    </ErrorBoundary>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
