import { useMutation } from '@tanstack/react-query';

import { createOrganizationService } from '../-services/organizationService';

export const useCreateOrganization = () => {
  return useMutation({
    mutationFn: createOrganizationService,
  });
};
