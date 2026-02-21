import { useMutation } from '@tanstack/react-query';

import { deleteJobService } from '../-services/jobService';

export const useDeleteJob = () => {
  return useMutation({
    mutationFn: deleteJobService,
  });
};
