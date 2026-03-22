import { apiPost, apiGet, apiDelete, apiPatch } from '@/lib/api-client';

import type {
  TCreateOrganizationMember,
  TDeleteOrganizationMember,
  TOrganizationMemberResponse,
  TUpdateOrganizationMemberRole,
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
    `/api/v1/organization-members/members/${organizationId}`,
  );
};

export const addManyMembersService = async (membersData: TCreateOrganizationMember[]) => {
  return apiPost<TOrganizationMemberResponse[]>(
    '/api/v1/organization-members/add-many',
    membersData,
  );
};

export const updateMemberRoleService = async (data: TUpdateOrganizationMemberRole) => {
  return apiPatch<TOrganizationMemberResponse>('/api/v1/organization-members/update-role', data);
};
