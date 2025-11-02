import { Skeleton } from './ui/skeleton';

export function NavbarSkeleton() {
  return (
    <nav className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/80 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur">
      <div className="mx-auto max-w-7xl">
        <ul className="flex h-[70px] items-center justify-between px-4 sm:px-6">
          {/* Desktop Search */}
          <li className="max-w-md flex-1 max-sm:hidden">
            <div className="relative">
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </li>

          {/* Navigation Links */}
          <li className="flex flex-1 items-center justify-center gap-1 sm:flex-initial sm:gap-2">
            {/* Mobile Search Button */}
            <div className="flex flex-col items-center justify-center gap-1 px-3 py-2 min-sm:hidden">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-3 w-12" />
            </div>

            {/* Home */}
            <div className="flex flex-col items-center justify-center gap-1 px-3 py-2">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-3 w-10" />
            </div>

            {/* Network */}
            <div className="flex flex-col items-center justify-center gap-1 px-3 py-2">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-3 w-14" />
            </div>

            {/* Jobs */}
            <div className="flex flex-col items-center justify-center gap-1 px-3 py-2">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-3 w-8" />
            </div>

            {/* Notifications */}
            <div className="flex flex-col items-center justify-center gap-1 px-3 py-2">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-3 w-20" />
            </div>
          </li>

          {/* Profile / Sign In */}
          <li className="flex flex-1 items-center justify-end sm:flex-initial">
            <div className="flex items-center gap-2 px-2 py-1">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-3 w-6 max-sm:hidden" />
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}
