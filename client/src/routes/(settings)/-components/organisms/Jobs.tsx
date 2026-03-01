import { EmptyStateBox } from '@/components/organisms/EmptyStateBox';
import { useFetchAllJobsOfOrganization } from '../../-hooks/useFetchAllJobsOfOrganization';
import { JobSummaryCard } from './JobSummaryCard';
import { Button } from '@/components/ui/button';

interface IJobsProps {
  organizationId: string;
}

export const Jobs = ({ organizationId }: IJobsProps) => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useFetchAllJobsOfOrganization(organizationId);

  const jobs = data?.pages.flatMap(page => page.jobs) || [];

  return (
    <div>
      {jobs.length === 0 && (
        <EmptyStateBox
          title="No jobs available"
          description="There are no jobs available for this organization."
          showAddIcon={false}
        />
      )}
      {jobs.map(job => (
        <JobSummaryCard key={job._id} {...job} />
      ))}
      {hasNextPage && (
        <div className="px-4 py-2">
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} variant="link">
            {isFetchingNextPage ? 'Loading...' : 'Load more jobs'}
          </Button>
        </div>
      )}
    </div>
  );
};
