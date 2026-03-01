import { Skeleton } from '@/components/ui/skeleton';

export const OrganizationCardSkeleton = () => {
  return (
    <div className="bg-background mx-auto min-h-screen">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        {/* 1. Main Header & Description Section */}
        <div className="bg-card space-y-6 rounded-xl border p-6 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Logo Skeleton */}
            <Skeleton className="size-16 rounded-lg md:size-20" />
            <div className="space-y-2">
              {/* Name Skeleton */}
              <Skeleton className="h-8 w-48 md:w-64" />
              {/* Subtitle/URL Skeleton */}
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          {/* Description Prose Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[85%]" />
          </div>
        </div>

        {/* 2. Admin Controls Section Skeleton */}
        <div className="bg-muted/40 rounded-xl border p-4 shadow-sm">
          <Skeleton className="mb-3 h-4 w-28" /> {/* "Admin Controls" text */}
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-9 w-28 rounded-md" /> {/* Edit Profile */}
            <Skeleton className="h-9 w-36 rounded-md" /> {/* Manage Members */}
            <Skeleton className="h-9 w-24 rounded-md" /> {/* Post Job */}
          </div>
        </div>

        {/* 3. Tabs & Content Section Skeleton */}
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          {/* TabsList Skeleton */}
          <div className="mb-6 flex gap-2">
            <Skeleton className="h-10 w-20 rounded-md" />
            <Skeleton className="h-10 w-20 rounded-md" />
          </div>

          {/* Tab Content Placeholder */}
          <div className="space-y-4">
            {/* We can simulate a list or a content block here */}
            <div className="space-y-3">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
