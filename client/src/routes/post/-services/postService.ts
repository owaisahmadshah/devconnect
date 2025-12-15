import { apiDelete, apiGet, apiPost } from '@/lib/api-client';
import {
  type TLikeResponse,
  type TCreateLike,
  type TPagination,
  type TPostById,
  type TPostOfUser,
  type TPostResponse,
  type TPostsResponseWithCursorPaginationResponse,
  type TCreateComment,
  type TCommentResponse,
  type TDeleteCommentSchema,
  type TCommentDeleteResponse,
  type TPostCommentsByIdSchema,
  type TCommentsResponseWithCursorPaginationResponse,
} from 'shared';

export const createPostService = async (data: FormData): Promise<TPostResponse> => {
  return apiPost<TPostResponse>('/api/v1/posts/create', data);
};

export const fetchFeedService = async (
  pagination: TPagination,
): Promise<TPostsResponseWithCursorPaginationResponse> => {
  return apiGet<TPostsResponseWithCursorPaginationResponse>('/api/v1/posts/feed', pagination);
};

export const fetchUserPostsService = async (
  params: TPostOfUser,
  pagination: TPagination,
): Promise<TPostsResponseWithCursorPaginationResponse> => {
  return apiGet<TPostsResponseWithCursorPaginationResponse>(
    `/api/v1/posts/user/${params.profileUrl}`,
    pagination,
  );
};

export const fetchPost = async (params: TPostById): Promise<TPostResponse> => {
  return apiGet<TPostResponse>(`/api/v1/posts/post/${params.postId}`);
};

export const reactionService = async (body: TCreateLike & { profileUrl?: string }) => {
  return apiPost<TLikeResponse>('/api/v1/reaction/react', {
    value: body.value,
    postId: body.postId,
    likedBy: body.likedBy,
  });
};

export const createComment = async (body: TCreateComment & { profileUrl?: string }) => {
  return apiPost<TCommentResponse>('/api/v1/comment/create', {
    postId: body.postId,
    body: body.body,
    commentBy: body.commentBy,
  });
};

export const deleteComment = async (query: TDeleteCommentSchema & { profileUrl?: string }) => {
  return apiDelete<TCommentDeleteResponse>('/api/v1/comment/delete', {
    _id: query._id,
  });
};

export const fetchComments = async (params: TPostCommentsByIdSchema, query: TPagination) => {
  return apiGet<TCommentsResponseWithCursorPaginationResponse>(
    `/api/v1/comment/comments/${params.postId}`,
    query,
  );
};
