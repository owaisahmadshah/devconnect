import { apiPost, apiGet, apiDelete } from '@/lib/api-client';

import type {
  TCreateOrganizationMember,
  TDeleteOrganizationMember,
  TOrganizationMemberResponse,
} from 'shared';

export const createOrganizationMemberService = async (data: TCreateOrganizationMember) => {
  return apiPost<TOrganizationMemberResponse>('/api/v1/organization-members/create', data);
};

export const deleteOrganizationMemberService = async (data: TDeleteOrganizationMember) => {
  return apiDelete<TOrganizationMemberResponse>(
    `/api/v1/organization-members/${data.organizationId}/${data.userId}`,
  );
};

export const fetchAllMembersOfOrganizationService = async ({
  organizationId,
}: {
  organizationId: string;
}) => {
  return apiGet<TOrganizationMemberResponse[]>(
    `/api/v1/organization-members/${organizationId}/members`,
  );
};
