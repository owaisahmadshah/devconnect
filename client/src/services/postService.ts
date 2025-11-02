import { apiDelete } from '@/lib/api-client';
import type { TDeletePost } from 'shared';

export const deletePostService = async (query: TDeletePost) => {
  return apiDelete('/api/v1/posts/delete', query);
};
