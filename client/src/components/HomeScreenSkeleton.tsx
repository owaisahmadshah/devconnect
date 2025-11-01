import { NavbarSkeleton } from './NavbarSkeleton';
import { PostSkeleton } from './PostSkeleton';
import { Skeleton } from './ui/skeleton';

export const HomeScreenSkeleton = () => {
  return (
    <>
      <NavbarSkeleton />
      <div className="space-y-3 p-[75px]">
        <div>
          <Skeleton className="mx-auto h-10 w-3xl max-sm:w-full" />
        </div>
        <PostSkeleton />
      </div>
    </>
  );
};
