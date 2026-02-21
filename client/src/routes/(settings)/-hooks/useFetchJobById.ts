import { useQuery } from '@tanstack/react-query';
import { fetchJobByIdService } from '../-services/jobService';

export const useFetchJobById = () => {
  const jobId = '';

  // TODO: Get from params or accept in hook parameter

  return useQuery({
    queryKey: ['fetchJobById', jobId],
    queryFn: () => fetchJobByIdService(jobId),
  });
};
