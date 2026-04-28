import { TOrganizationSummaryResponse } from '../organization/response.js';
import { TUserProfileSummary } from '../profile/profileResponse.js';
import { TBaseJob } from './job.js';

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
