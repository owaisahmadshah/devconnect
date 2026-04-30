import { useNavigate, useSearch } from '@tanstack/react-router';
import { Search, Building2, Plus, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { OrganizationSummaryCard } from '@/routes/(settings)/-components/organisms/OrganizationSummaryCard';
import { useFetchInfiniteOrganizationsById } from '@/routes/(settings)/-hooks/useFetchInfiniteOrganizationsById';

export const SelectOrganizationForm = () => {
  const { from } = useSearch({ from: '/(settings)/organization/select' });

  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useFetchInfiniteOrganizationsById();

  const navigate = useNavigate();

  const allOrganizations = data?.pages.flatMap(page => page.organizations) ?? [];

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center space-y-8 px-4 py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-foreground text-3xl font-black tracking-[0.2em] uppercase">
          Select Entity
        </h1>
        <p className="text-muted-foreground text-[11px] font-bold tracking-widest uppercase">
          Choose an organization to represent for this job posting
        </p>
      </div>

      <Card className="border-border/40 bg-card w-full max-w-md overflow-hidden rounded-3xl shadow-2xl">
        <CardHeader className="border-border/10 bg-muted/5 border-b p-6">
          <div className="group relative">
            <Search className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-3 size-4 -translate-y-1/2 transition-colors" />
            <Input
              placeholder="Filter your organizations..."
              className="bg-muted/20 border-border/40 focus-visible:ring-primary/40 h-11 rounded-xl pl-10 transition-all focus-visible:ring-1"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-80 px-6">
            <div className="space-y-1 py-4">
              {allOrganizations.length > 0 ? (
                allOrganizations.map(org => (
                  <div key={org._id} className="group relative">
                    <OrganizationSummaryCard
                      name={org.name}
                      logo={org.logo}
                      organizationURL={org.organizationURL}
                      _id={org._id}
                      redirectURL={'/job/new'}
                      params={[{ name: 'organizationId', value: org._id }]}
                      customClassName="py-4 px-4 rounded-2xl transition-all hover:bg-primary/5 border border-transparent hover:border-primary/20"
                    />
                    <ArrowRight className="text-primary absolute top-1/2 right-4 size-4 -translate-x-2 -translate-y-1/2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground flex flex-col items-center justify-center space-y-4 py-16">
                  <Building2 className="size-12 stroke-[1px] opacity-20" />
                  <p className="text-[10px] font-black tracking-widest uppercase">
                    No organizations found
                  </p>
                </div>
              )}

              {hasNextPage && (
                <div className="flex justify-center py-4">
                  <Button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    variant="ghost"
                    className="hover:text-primary text-[10px] font-black tracking-widest uppercase"
                  >
                    {isFetchingNextPage ? 'Loading...' : 'Load more'}
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="bg-muted/5 border-border/10 border-t p-6">
            <Button
              className="shadow-primary/10 h-12 w-full gap-2 rounded-xl font-black tracking-widest uppercase shadow-lg transition-all hover:opacity-90"
              onClick={() => navigate({ to: '/organization/new', search: { from } })}
            >
              <Plus className="size-4" />
              New Organization
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="text-muted-foreground/50 text-[10px] font-bold tracking-tighter uppercase">
        Step 1 of 2: Identity Selection
      </p>
    </div>
  );
};
