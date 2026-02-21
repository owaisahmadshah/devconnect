import { useMutation } from '@tanstack/react-query';

import { createJobService } from '../-services/jobService';

export const useCreateJob = () => {
  return useMutation({
    mutationFn: createJobService,
  });
};
