import { TUserProfileSummaryResponse } from '../profile/profileResponse';
import { TProjectWithId } from './project';

// Project response
export type TProjectResponse = Omit<TProjectWithId, 'createdBy' | 'collaborators'> & {
  createdBy: TUserProfileSummaryResponse;
  collaborators: TUserProfileSummaryResponse[];
};

export type TProjectSummaryResponse = Pick<
  TProjectResponse,
  | '_id'
  | 'title'
  | 'description'
  | 'createdBy'
  | 'tags'
  | 'techStacks'
  | 'creationDate'
  | 'createdAt'
  | 'updatedAt'
>;

export type TProjectsSummaryWithCursorPaginationResponse = {
  projects: TProjectSummaryResponse[];
  hasMore: boolean;
  nextCursor: string | null;
};

export type TProjectWithCursorPaginationResponse = {
  projects: TProjectResponse[];
  hasMore: boolean;
  nextCursor: string | null;
};
