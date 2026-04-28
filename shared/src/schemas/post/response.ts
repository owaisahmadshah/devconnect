import { TlikeEnum } from '../like/like.js';
import { TUserProfileSummaryResponse } from '../profile/profileResponse.js';
import { TBasePost } from './post.js';

export type TPostResponse = Omit<TBasePost, 'createdBy'> & {
  _id: string;
  createdBy: TUserProfileSummaryResponse;
  createdAt: Date;
  updatedAt: Date;
  likeType?: TlikeEnum;
  totalLikes?: number;
  totalComments?: number;
};

export type TPostsResponseWithCursorPaginationResponse = {
  posts: TPostResponse[];
  hasMore: boolean;
  nextCursor: string | null;
};
