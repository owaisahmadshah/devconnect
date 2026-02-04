import { Skeleton } from '@/components/ui/skeleton';

export const NetworkNavbarSkeleton = () => {
  return (
    <nav className="border-border bg-card flex w-[80%] items-center justify-between rounded-xl border px-8 py-4 shadow-sm">
      {/* Title skeleton */}
      <Skeleton className="h-7 w-32" />

      {/* Links skeleton */}
      <ul className="flex items-center gap-8">
        <li>
          <Skeleton className="h-5 w-24" />
        </li>
        <li>
          <Skeleton className="h-5 w-18" />
        </li>
      </ul>
    </nav>
  );
};
