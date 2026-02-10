import { TOrganizationResponse } from '../organization/response';
import { TUserProfileSummary } from '../profile/profileResponse';
import { TBaseOrganizationMember } from './organization-member';

export type TOrganizationMemberResponse = Omit<
  TBaseOrganizationMember,
  'organizationId' | 'userId'
> & {
  _id: string;
  organization: TOrganizationResponse;
  user: TUserProfileSummary;
  createdAt: Date;
};
