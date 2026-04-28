import { TOrganizationSummaryResponse } from '../organization/response.js';
import { TUserProfileSummary } from '../profile/profileResponse.js';
import { TBaseOrganizationMember } from './organization-member.js';

export type TOrganizationMemberResponse = Omit<
  TBaseOrganizationMember,
  'organizationId' | 'userId'
> & {
  _id: string;
  organization: TOrganizationSummaryResponse;
  user: TUserProfileSummary;
  createdAt: Date;
};

export type TOrganizationMemberWithStatusResponse = TOrganizationMemberResponse & {
  status: 'pending' | 'accepted';
};
