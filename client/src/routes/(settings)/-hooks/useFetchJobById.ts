import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchJobByIdService } from '../-services/jobService';
import { useParams } from '@tanstack/react-router';

export const useFetchJobById = () => {
  const { jobId } = useParams({
    from: '/(settings)/organization/$organizationURL/job/$jobId',
  });

  return useSuspenseQuery({
    queryKey: ['fetchJobById', jobId],
    queryFn: () => fetchJobByIdService(jobId),
  });
};
