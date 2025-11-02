import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deletePostService } from '@/services/postService';

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePostService,
    onSuccess: (_data, postId) => {
      // Invalidate user posts cache
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
    },
  });
}
