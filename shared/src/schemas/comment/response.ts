import { TUserProfileSummary } from '../profile/profileResponse';
import { TBaseComment } from './comment';

export type TCommentResponse = Omit<TBaseComment, 'commentBy'> & {
  _id: string;
  commentBy: TUserProfileSummary;
  createdAt: Date;
  updatedAt: Date;
};

export type TCommentDeleteResponse = {
  success: boolean;
  commentId: string;
  postId: string;
};

export type TCommentsResponseWithCursorPaginationResponse = {
  comments: TCommentResponse[];
  hasMore: boolean;
  nextCursor: string | null;
};
