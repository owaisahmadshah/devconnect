import { TUserProfileSummary } from '../profile/profileResponse';
import { TBaseOrganization } from './organization';

export type TOrganizationResponse = Omit<TBaseOrganization, 'createdBy'> & {
  _id: string;
  createdBy: TUserProfileSummary;
  createdAt: Date;
};

export type TOrganizationSummaryResponse = Omit<
  TOrganizationResponse,
  'description' | 'websiteURL' | 'createdBy' | 'createdAt'
>;

export type TOrganizationListResponseWithCursorPagination = {
  organizations: TOrganizationSummaryResponse[];
  hasMore: boolean;
  nextCursor: string | null;
};
