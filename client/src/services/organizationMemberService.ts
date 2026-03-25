import { apiDelete, apiGet } from '@/lib/api-client';
import type {
  TDeleteOrganizationMemberInvite,
  TOrganizationMemberWithStatusResponse,
  TUpdateOrganizationMemberInvite,
} from 'shared';

export const rejectOrganizationInviteStatus = (data: TDeleteOrganizationMemberInvite) => {
  return apiDelete(`/api/v1/organization-members/${data.inviteId}`);
};

export const acceptOrganizationInviteStatus = (data: TUpdateOrganizationMemberInvite) => {
  return apiDelete(`/api/v1/organization-members/${data.inviteId}`);
};

export const fetchOrganizationsInvitations = () => {
  return apiGet<TOrganizationMemberWithStatusResponse[]>(
    '/api/v1/organization-members/invitations',
  );
};
