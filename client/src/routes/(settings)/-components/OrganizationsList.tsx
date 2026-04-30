import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useFetchInfiniteOrganizations } from '../-hooks/useFetchInfiniteOrganizations';
import { OrganizationSummaryCard } from './organisms/OrganizationSummaryCard';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { Search, Plus, Building2 } from 'lucide-react';

export const OrganizationsList = () => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useFetchInfiniteOrganizations();

  const organizations = data?.pages.flatMap(page => page.organizations) || [];

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center space-y-6 px-4 py-10">
      <div className="space-y-2 text-center">
        <h1 className="text-foreground text-2xl font-black tracking-[0.2em] uppercase">
          Organizations
        </h1>
        <p className="text-muted-foreground text-[11px] font-bold tracking-widest uppercase">
          Connect with professional entities
        </p>
      </div>

      <Card className="border-border/40 bg-card w-full overflow-hidden rounded-2xl shadow-xl">
        <CardHeader className="border-border/10 bg-muted/5 border-b p-6">
          <div className="group relative">
            <Search className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-3 size-4 -translate-y-1/2 transition-colors" />
            <Input
              placeholder="Search organizations..."
              className="bg-muted/20 border-border/40 focus-visible:ring-primary/40 h-11 rounded-xl pl-10 transition-all focus-visible:ring-1"
              disabled={isFetchingNextPage || true}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px] px-6">
            <div className="space-y-1 py-4">
              {organizations.length > 0 ? (
                organizations.map(org => (
                  <OrganizationSummaryCard
                    key={org._id}
                    name={org.name}
                    logo={org.logo}
                    organizationURL={org.organizationURL}
                    _id={org._id}
                    customClassName="py-3 px-3 rounded-xl transition-all hover:bg-muted/50 border border-transparent hover:border-border/40"
                  />
                ))
              ) : (
                <div className="text-muted-foreground flex flex-col items-center justify-center space-y-3 py-20">
                  <Building2 className="size-10 stroke-[1.5px] opacity-20" />
                  <p className="text-[10px] font-black tracking-widest uppercase">
                    No organizations found
                  </p>
                </div>
              )}

              {hasNextPage && (
                <div className="flex justify-center py-6">
                  <Button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    variant="ghost"
                    className="hover:text-primary text-[10px] font-black tracking-widest uppercase transition-colors"
                  >
                    {isFetchingNextPage ? 'Synchronizing...' : 'Load more entities'}
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="bg-muted/5 border-border/10 border-t p-6">
            <Link to={'/organization/new'}>
              <Button className="h-12 w-full gap-2 rounded-xl font-black tracking-widest uppercase shadow-sm transition-all hover:opacity-90">
                <Plus className="size-4" />
                Register Organization
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
