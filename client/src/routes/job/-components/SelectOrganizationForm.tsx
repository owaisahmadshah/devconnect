import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFetchInfiniteOrganizationsById } from '@/routes/(settings)/-hooks/useFetchInfiniteOrganizationsById';
import { useNavigate } from '@tanstack/react-router';

export const SelectOrganizationForm = () => {
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useFetchInfiniteOrganizationsById();

  const navigate = useNavigate();

  const allOrganizations = data?.pages.flatMap(page => page.organizations) ?? [];

  const handleNavigate = (orgId: string) => {
    navigate({ to: `/job/new?organizationId=${orgId}` });
  };

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
              <div
                key={org._id}
                className="hover:bg-accent flex cursor-pointer items-center justify-between rounded-md border-b px-4 py-2"
                onClick={() => handleNavigate(org._id)}
              >
                <p className="font-medium">{org.name}</p>
              </div>
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
            onClick={() => navigate({ to: '/organization/new' })}
          >
            Create new Organization
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
