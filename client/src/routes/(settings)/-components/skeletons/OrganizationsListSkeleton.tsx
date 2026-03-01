import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const OrganizationsListSkeleton = () => {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center space-y-2 py-4">
      {/* Title Skeleton */}
      <Skeleton className="mb-2 h-8 w-48" />

      <Card className="w-full max-w-sm">
        <CardHeader>
          {/* Input Search Skeleton */}
          <Skeleton className="h-10 w-full rounded-md" />
        </CardHeader>

        <CardContent>
          <div className="h-64 space-y-3 overflow-hidden pr-2">
            {/* Generating 4 mock items to fill the ScrollArea */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="my-2 flex items-center gap-3 rounded-md border border-transparent px-3 py-2"
              >
                {/* Logo Circle Skeleton */}
                <Skeleton className="size-10 shrink-0 rounded-full" />

                <div className="flex flex-1 flex-col gap-2">
                  {/* Organization Name Line */}
                  <Skeleton className="h-4 w-3/4" />
                  {/* Organization URL/Subtitle Line */}
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>

          {/* Create Button Skeleton */}
          <Skeleton className="mt-2 h-10 w-full rounded-full" />
        </CardContent>
      </Card>
    </div>
  );
};
