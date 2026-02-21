import { useMutation } from '@tanstack/react-query';
import { createOrganizationMemberService } from '../-services/organizationMemberService';

export const useCreateOrganizationMember = () => {
  return useMutation({
    mutationFn: createOrganizationMemberService,
  });
};
