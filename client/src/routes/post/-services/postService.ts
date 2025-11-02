import { apiGet, apiPost } from '@/lib/api-client';
import type {
  TPagination,
  TPostById,
  TPostOfUser,
  TPostResponse,
  TPostsResponseWithCursorPaginationResponse,
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
