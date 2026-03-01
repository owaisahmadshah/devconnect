import { JobSummarySkeleton } from './JobSummarySkeleton';

export const JobsListSkeleton = () => {
  return (
    <div className="w-full">
      {Array.from({ length: 5 }).map((_, i) => (
        <JobSummarySkeleton key={i} />
      ))}
    </div>
  );
};
