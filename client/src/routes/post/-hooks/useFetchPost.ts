import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { fetchPost } from '../-services/postService';

export function useFetchPost(postId?: string) {
  const { postId: paramPostId } = useParams({ strict: false });

  const finalId = postId ?? paramPostId;

  return useQuery({
    queryKey: [postId],
    queryFn: () => fetchPost({ postId: finalId }),
  });
}
