import { useMutation } from '@tanstack/react-query';
import { updateOrganizationFieldService } from '../-services/organizationService';

export const useUpdateOrganizationField = () => {
  return useMutation({
    mutationFn: updateOrganizationFieldService,
  });
};
