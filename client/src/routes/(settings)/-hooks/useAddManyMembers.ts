import { useMutation } from '@tanstack/react-query';

import { addManyMembersService } from '../-services/organizationMemberService';

export const useAddManyMembers = () => {
  return useMutation({
    mutationFn: addManyMembersService,
  });
};
