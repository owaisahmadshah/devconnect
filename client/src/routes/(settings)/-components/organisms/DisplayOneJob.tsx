import { useFetchJobById } from '../../-hooks/useFetchJobById';
import { JobDetailCard } from './JobDetailCard';

export const DisplayOneJob = () => {
  const { data: job } = useFetchJobById();

  return (
    <div className="bg-background flex min-h-screen w-full flex-col items-center space-y-6 p-4 pt-6">
      <JobDetailCard {...job} />
    </div>
  );
};
