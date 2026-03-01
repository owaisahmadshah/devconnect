import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const JobDetailCardSkeleton = () => {
  return (
    <Card className="border-border bg-card w-full max-w-2xl overflow-hidden">
      <CardHeader className="space-y-4 p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            {/* Badge Skeleton */}
            <Skeleton className="h-5 w-24 rounded-full" />

            {/* Title Skeleton */}
            <Skeleton className="h-8 w-[250px] md:w-[350px]" />

            {/* Organization Skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton className="size-4 rounded-sm" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          {/* Status Badge Skeleton */}
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        {/* Metadata Row Skeleton */}
        <div className="flex flex-wrap gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-1">
              <Skeleton className="size-4 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="px-6 py-4">
        <div className="space-y-3">
          {/* Section Label */}
          <Skeleton className="h-4 w-24" />

          {/* Description Paragraph Skeletons */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[40%]" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/30 flex gap-3 border-t p-6">
        {/* Primary Action Button */}
        <Skeleton className="h-10 flex-1 rounded-md" />

        {/* Icon Button (Share) */}
        <Skeleton className="size-10 rounded-md shadow-none" />
      </CardFooter>
    </Card>
  );
};
