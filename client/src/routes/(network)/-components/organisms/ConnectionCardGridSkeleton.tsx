import { ConnectionCardSkeleton } from './ConnectionCardSkeleton';

export function ConnectionCardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <ConnectionCardSkeleton key={index} />
      ))}
    </div>
  );
}
