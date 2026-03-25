import { TOrganizationSummaryResponse } from '../organization/response';
import { TUserProfileSummary } from '../profile/profileResponse';
import { TBaseOrganizationMember } from './organization-member';

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
