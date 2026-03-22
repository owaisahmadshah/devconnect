import { useMutation } from '@tanstack/react-query';

import { createOrganizationMemberInviteService } from '../-services/organizationMemberService';

export const useCreateOrganizationMemberInvite = () => {
  return useMutation({
    mutationFn: createOrganizationMemberInviteService,
  });
};
