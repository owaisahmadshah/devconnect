import { ConnectionCardGridSkeleton } from './ConnectionCardGridSkeleton';
import { NetworkNavbarSkeleton } from './NetworkNavbarSkeleton';

export const NetworkSkeleton = () => {
  return (
    <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-4 space-y-2 py-4">
      <div className="flex w-full justify-center">
        <NetworkNavbarSkeleton />
      </div>
      <ConnectionCardGridSkeleton count={10} />
    </div>
  );
};
