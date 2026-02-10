import { TOrganizationSummaryResponse } from '../organization/response';
import { TUserProfileSummary } from '../profile/profileResponse';
import { TBaseJob } from './job';

export type TJobResponse = Omit<TBaseJob, 'organizationId' | 'postedBy'> & {
  _id: string;
  organization: TOrganizationSummaryResponse;
  postedBy: TUserProfileSummary;
  createdAt: Date;
};

export type TJobSummaryResponse = Omit<TJobResponse, 'postedBy' | 'type' | 'description'>;

export type TJobListResponseWithCursorPagination = {
  jobs: TJobSummaryResponse[];
  hasMore: boolean;
  nextCursor: string | null;
};
