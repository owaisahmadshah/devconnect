import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const PostSkeleton = () => {
  return (
    <Card className="rounded-radius-lg border-border mx-auto h-3/4 w-3xl border py-2 shadow-sm max-sm:w-full">
      {/* Header */}
      <CardHeader className="border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {/* Profile Picture */}
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex flex-col gap-2">
            {/* Name */}
            <Skeleton className="h-4 w-32" />
            {/* Date */}
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        {/* Dots Menu */}
        <Skeleton className="h-5 w-5 rounded" />
      </CardHeader>

      {/* Description */}
      <CardContent className="space-y-2 px-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </CardContent>

      {/* Media/Image Carousel */}
      <div className="px-4 pb-4">
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>

      {/* Divider */}
      <div className="border-border mx-4 border-t" />

      {/* Actions */}
      <CardFooter className="px-2 sm:px-4">
        <div className="flex w-full justify-between gap-2">
          {/* Like Button */}
          <div className="flex flex-1 items-center justify-center gap-2">
            <Skeleton className="h-[18px] w-[18px] rounded" />
            <Skeleton className="hidden h-4 w-8 sm:block" />
          </div>

          {/* Comment Button */}
          <div className="flex flex-1 items-center justify-center gap-2">
            <Skeleton className="h-[18px] w-[18px] rounded" />
            <Skeleton className="hidden h-4 w-16 sm:block" />
          </div>

          {/* Share Button */}
          <div className="flex flex-1 items-center justify-center gap-2">
            <Skeleton className="h-[18px] w-[18px] rounded" />
            <Skeleton className="hidden h-4 w-10 sm:block" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
