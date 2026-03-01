import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const SelectOrganizationSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
      {/* Title Skeleton */}
      <Skeleton className="h-8 w-48" />

      <Card className="w-full max-w-sm">
        <CardHeader>
          {/* Search Input Skeleton */}
          <Skeleton className="h-10 w-full rounded-md" />
        </CardHeader>

        <CardContent className="space-y-4">
          {/* ScrollArea Simulation */}
          <div className="h-64 space-y-3 overflow-hidden">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="my-2 flex items-center gap-3 rounded-md border border-transparent px-3 py-2"
              >
                {/* Org Logo Circle */}
                <Skeleton className="size-10 shrink-0 rounded-full" />
                <div className="flex flex-1 flex-col gap-2">
                  {/* Org Name */}
                  <Skeleton className="h-4 w-3/4" />
                  {/* Org URL/Subtitle */}
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>

          {/* "Create New Organization" Button Skeleton */}
          <Skeleton className="h-10 w-full rounded-full" />
        </CardContent>
      </Card>
    </div>
  );
};
