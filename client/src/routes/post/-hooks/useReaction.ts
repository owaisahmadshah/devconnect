import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reactionService } from '../-services/postService';

export const useReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reactionService,
    onSuccess: (data, variables) => {
      const { postId, value, profileUrl } = variables;
      const isCreated = data.isCreated;

      const updatePostCache = (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            posts: page.posts.map(post => {
              if (post._id !== postId) return post;

              const updatedTotalLikes = isCreated ? post.totalLikes + 1 : post.totalLikes - 1;

              const updatedLikeType = isCreated ? value : undefined;

              return {
                ...post,
                totalLikes: updatedTotalLikes,
                likeType: updatedLikeType,
              };
            }),
          })),
        };
      };

      queryClient.setQueryData(['feed-posts'], updatePostCache);

      if (profileUrl) {
        queryClient.setQueryData(['user-posts', profileUrl], updatePostCache);
      }
    },
  });
};
