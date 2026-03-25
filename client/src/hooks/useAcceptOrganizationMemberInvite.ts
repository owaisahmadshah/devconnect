import { useMutation } from '@tanstack/react-query';

import { acceptOrganizationInviteStatus } from '@/services/organizationMemberService';

export const useAcceptOrganizationMemberInvite = () => {
  return useMutation({
    mutationFn: acceptOrganizationInviteStatus,
  });
};
