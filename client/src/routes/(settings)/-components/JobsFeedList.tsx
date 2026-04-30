import { Route } from '../jobs';
import { useFetchInfiniteFeedJobs } from '../-hooks/useFetchInfiniteFeedJobs';
import { useFetchInfiniteSearchJobs } from '../-hooks/useFetchInfiniteSearchJobs';
import { JobSummaryCard } from './organisms/JobSummaryCard';
import { JobsSearchBar } from './JobSearchBar';
import { JobsSearchBarSkeleton } from './skeletons/JobsSearchBarSkeleton';
import { JobsListSkeleton } from './skeletons/JobListSkeleton';

export const JobsFeedList = () => {
  const search = Route.useSearch();
  const isSearchActive = !!(search.q || search.location || search.type || search.status);

  const {
    data: feedData,
    isLoading: isFeedLoading,
    isError: isFeedError,
  } = useFetchInfiniteFeedJobs();
  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useFetchInfiniteSearchJobs();

  const isSearchLoadingAndActive = isSearchActive && isSearchLoading;
  const isError = isFeedError || (isSearchActive && isSearchError);

  const jobs = isSearchActive
    ? searchData?.pages.flatMap(page => page.jobs)
    : feedData?.pages.flatMap(page => page.jobs);

  if (isFeedLoading) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center space-y-2 py-4">
        <JobsSearchBarSkeleton />
        <div className="w-full">
          <JobsListSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center space-y-2 py-4">
        <JobsSearchBar />
        <p className="text-muted-foreground text-sm">Something went wrong. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center space-y-2 py-4">
      <JobsSearchBar />
      <div className="w-full">
        {isSearchLoadingAndActive && <JobsListSkeleton />}
        {!isSearchLoadingAndActive && jobs?.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">No jobs found.</p>
        ) : (
          jobs?.map(job => <JobSummaryCard key={job._id} {...job} />)
        )}
      </div>
    </div>
  );
};
