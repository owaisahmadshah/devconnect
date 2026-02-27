import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createOrganizationService } from '../-services/organizationService';

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrganizationService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organizations-by-id'] });
    },
  });
};
