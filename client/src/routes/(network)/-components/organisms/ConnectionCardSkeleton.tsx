import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ConnectionCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex w-52 flex-col items-center gap-4 p-6 max-sm:w-36 max-sm:gap-3 max-sm:p-4">
        {/* Profile skeleton */}
        <div className="flex flex-col items-center gap-3 w-full">
          {/* Avatar skeleton */}
          <Skeleton className="h-24 w-24 rounded-full max-sm:h-16 max-sm:w-16" />
          
          {/* Name skeleton */}
          <Skeleton className="h-5 w-32 max-sm:w-24" />
          
          {/* Headline/bio skeleton */}
          {/* <Skeleton className="h-4 w-40 max-sm:w-28" /> */}
        </div>

        {/* Button skeleton */}
        <div className="w-full">
          <Skeleton className="h-9 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}