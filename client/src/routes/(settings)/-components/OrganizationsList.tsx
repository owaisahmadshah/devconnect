import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useFetchInfiniteOrganizations } from '../-hooks/useFetchInfiniteOrganizations';
import { OrganizationSummaryCard } from './organisms/OrganizationSummaryCard';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

export const OrganizationsList = () => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useFetchInfiniteOrganizations();

  const organizations = data?.pages.flatMap(page => page.organizations) || [];

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center space-y-2 py-4">
      <h1>Organizations List</h1>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <Input placeholder="Search organization..." disabled={isFetchingNextPage || true} />
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            {organizations.map(org => (
              <OrganizationSummaryCard
                name={org.name}
                logo={org.logo}
                organizationURL={org.organizationURL}
                _id={org._id}
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
          <Link to={'/organization/new'}>
            <Button className="bg-primary text-primary-foreground mt-2 w-full rounded-full font-bold transition-all hover:opacity-90">
              Create new Organization
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
