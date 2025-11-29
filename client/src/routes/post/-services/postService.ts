import { apiGet, apiPost } from '@/lib/api-client';
import {
  type TLikeResponse,
  type TCreateLike,
  type TPagination,
  type TPostById,
  type TPostOfUser,
  type TPostResponse,
  type TPostsResponseWithCursorPaginationResponse,
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

export const reactionService = async (body: TCreateLike) => {
  return apiPost<TLikeResponse>('/api/v1/reaction/react', body);
};
