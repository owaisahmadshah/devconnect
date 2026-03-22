import { useMutation } from '@tanstack/react-query';
import { updateOrganizationLogoService } from '../-services/organizationService';

export const useUpdateOrganizationLogo = () => {
  return useMutation({
    mutationFn: updateOrganizationLogoService,
  });
};
