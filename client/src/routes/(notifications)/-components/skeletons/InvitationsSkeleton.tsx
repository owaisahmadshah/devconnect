import { Skeleton } from '@/components/ui/skeleton';

export const InvitationsSkeleton = () => (
  <div className="w-full space-y-2">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="border-border flex items-center gap-4 rounded-lg border p-4">
        <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);
