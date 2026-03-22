import { useSuspenseQuery } from '@tanstack/react-query';

import { fetchAllMembersOfOrganizationService } from '../-services/organizationMemberService';

export const useFetchAllMembersOfOrganization = (organizationId: string) => {
  return useSuspenseQuery({
    queryKey: ['fetch-org-members', organizationId],
    queryFn: () => fetchAllMembersOfOrganizationService({ organizationId }),
  });
};
