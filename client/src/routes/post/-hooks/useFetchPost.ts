import { useSuspenseQuery } from '@tanstack/react-query';

import { fetchPost } from '../-services/postService';

export function useFetchPost(postId: string) {
  return useSuspenseQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPost({ postId }),
  });
}
