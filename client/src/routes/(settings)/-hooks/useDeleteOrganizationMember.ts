import { useMutation } from '@tanstack/react-query';

import { deleteOrganizationMemberService } from '../-services/organizationMemberService';

export const useDeleteOrganizationMember = () => {
  return useMutation({
    mutationFn: deleteOrganizationMemberService,
  });
};
