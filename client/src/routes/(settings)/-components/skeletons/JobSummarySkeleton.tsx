import { Skeleton } from '@/components/ui/skeleton';

export const JobSummarySkeleton = () => {
  return (
    <div className="border-border bg-card flex gap-4 border-b p-4">
      <Skeleton className="h-12 w-12 shrink-0 rounded-md" />

      <div className="flex flex-1 flex-col space-y-2">
        <div className="flex items-start justify-between">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        <Skeleton className="h-4 w-1/4" />

        <div className="flex items-center gap-4 pt-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>

        <div className="mt-2">
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
};
