import { Skeleton } from '@/components/ui/skeleton';

export const JobsSearchBarSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-2">
      {/* Title input */}
      <Skeleton className="h-9 w-full" />

      <div className="flex gap-2">
        {/* Location input */}
        <Skeleton className="h-9 flex-1" />
        {/* Type select */}
        <Skeleton className="h-9 w-40" />
        {/* Status select */}
        <Skeleton className="h-9 w-40" />
      </div>
    </div>
  );
};
