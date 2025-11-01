import { Skeleton } from './ui/skeleton';

export function NavbarSkeleton() {
  return (
    <nav>
      <ul className="fixed z-1000 flex h-[70px] w-full items-center justify-center gap-8 max-sm:justify-around max-sm:gap-4">
        {/* Search Input */}
        <li>
          <Skeleton className="h-9 w-[30vw] rounded-2xl max-sm:hidden" />
          <div className="flex flex-col items-center justify-center gap-1 min-sm:hidden">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-3 w-10" />
          </div>
        </li>

        {/* Home */}
        <li>
          <div className="flex flex-col items-center justify-center gap-1">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-3 w-10" />
          </div>
        </li>

        {/* Network */}
        <li>
          <div className="flex flex-col items-center justify-center gap-1">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-3 w-14" />
          </div>
        </li>

        {/* Jobs */}
        <li>
          <div className="flex flex-col items-center justify-center gap-1">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-3 w-8" />
          </div>
        </li>

        {/* Notifications */}
        <li>
          <div className="flex flex-col items-center justify-center gap-1">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-3 w-20" />
          </div>
        </li>

        {/* Profile/Sign In */}
        <li>
          <Skeleton className="h-8 w-8 rounded-full" />
        </li>
      </ul>
    </nav>
  );
}
