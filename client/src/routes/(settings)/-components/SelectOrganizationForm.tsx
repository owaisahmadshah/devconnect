import { useNavigate, useSearch } from '@tanstack/react-router';

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
    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
      <h1 className="text-2xl font-bold">Create a new Job.</h1>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <Input placeholder="Search organization..." />
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            {allOrganizations.map(org => (
              <OrganizationSummaryCard
                name={org.name}
                logo={org.logo}
                organizationURL={org.organizationURL}
                _id={org._id}
                redirectURL={'/job/new'}
                params={[{ name: 'organizationId', value: org._id }]}
                customClassName="my-2 px-3 rounded-md hover:bg-muted"
              />
            ))}
            {hasNextPage && (
              <div className="px-4 py-2">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  variant="link"
                >
                  {isFetchingNextPage ? 'Loading...' : 'Load more organizations'}
                </Button>
              </div>
            )}
          </ScrollArea>
          <Button
            className="bg-primary text-primary-foreground w-full rounded-full font-bold transition-all hover:opacity-90"
            onClick={() => navigate({ to: '/organization/new', search: { from } })}
          >
            Create new Organization
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
