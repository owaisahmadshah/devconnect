import { TUserProfileSummary } from '../profile/profileResponse.js';
import { TBaseOrganization } from './organization.js';

export type TOrganizationResponse = Omit<TBaseOrganization, 'createdBy'> & {
  _id: string;
  createdBy: TUserProfileSummary;
  createdAt: Date;
  isAdmin: boolean;
};

export type TOrganizationSummaryResponse = Omit<
  TOrganizationResponse,
  'description' | 'websiteURL' | 'createdBy' | 'createdAt' | 'isAdmin'
>;

export type TOrganizationListResponseWithCursorPagination = {
  organizations: TOrganizationSummaryResponse[];
  hasMore: boolean;
  nextCursor: string | null;
};
