import { useMutation } from '@tanstack/react-query';
import { updateMemberRoleService } from '../-services/organizationMemberService';

export const useUpdateMemberRole = () => {
  return useMutation({
    mutationFn: updateMemberRoleService,
  });
};
