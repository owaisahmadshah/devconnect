import { useQuery } from '@tanstack/react-query';

import { fetchAllMembersOfOrganizationService } from '../-services/organizationMemberService';

export const useFetchAllMembersOfOrganization = () => {
  const organizationId = '';

  return useQuery({
    queryKey: ['fetchAllMembersOfOrganization'],
    queryFn: () => fetchAllMembersOfOrganizationService({ organizationId }),
  });
};
