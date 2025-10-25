import { TUserProfileSummaryResponse } from '../profile/profileResponse';
import { TBasePost } from './post';

export type TPostResponse = Omit<TBasePost, 'createdBy'> & {
  _id: string;
  createdBy: TUserProfileSummaryResponse;
  createdAt: Date;
  updatedAt: Date;
};

export type TPostsResponseWithCursorPaginationResponse = {
  posts: TPostResponse[];
  hasMore: boolean;
  nextCursor: string | null;
};
