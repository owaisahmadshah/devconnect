import { useMutation } from '@tanstack/react-query';

import { updateJobStatusService } from '../-services/jobService';

export const useUpdateJobStatus = () => {
  return useMutation({
    mutationFn: updateJobStatusService,
  });
};
