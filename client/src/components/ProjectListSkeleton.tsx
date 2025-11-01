import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

const ProjectItemSkeleton = () => {
  return (
    <div className="space-y-3 border-b px-4 py-4 w-3xl mx-auto">
      {/* Title */}
      <Skeleton className="h-6 w-3/4" />

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>

      {/* Tech Stacks */}
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-12 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
        <Skeleton className="h-6 w-18 rounded-full" />
      </div>

      {/* Date */}
      <Skeleton className="h-3 w-32" />
    </div>
  );
};

export const ProjectListSkeleton = () => {
  return (
    <ScrollArea className="h-full">
      <ProjectItemSkeleton />
      <ProjectItemSkeleton />
      <ProjectItemSkeleton />
    </ScrollArea>
  );
};
