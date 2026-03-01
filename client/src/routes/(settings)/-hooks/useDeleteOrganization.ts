import { useMutation } from '@tanstack/react-query';

import { deleteOrganizationService } from '../-services/organizationService';

export const useDeleteOrganization = () => {
  return useMutation({
    mutationFn: deleteOrganizationService,
  });
};
