import { useMutation } from '@tanstack/react-query';

import { rejectOrganizationInviteStatus } from '@/services/organizationMemberService';

export const useRejectOrganizationMemberInvite = () => {
  return useMutation({
    mutationFn: rejectOrganizationInviteStatus,
  });
};
