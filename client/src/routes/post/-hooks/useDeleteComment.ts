import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';

import { deleteComment } from '../-services/postService';
import type {
  TCommentsResponseWithCursorPaginationResponse,
  TPostsResponseWithCursorPaginationResponse,
} from 'shared';

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: (data, variables) => {
      const { postId, commentId } = data;
      const { profileUrl } = variables;

      queryClient.setQueryData(
        ['comments', postId],
        (oldData: InfiniteData<TCommentsResponseWithCursorPaginationResponse> | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map(page => ({
              ...page,
              comments: page.comments.filter(comment => {
                return comment._id != commentId;
              }),
            })),
          };
        },
      );

      const updatePostsCache = (
        oldData: InfiniteData<TPostsResponseWithCursorPaginationResponse> | undefined,
      ) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            posts: page.posts.map(post => {
              if (post._id !== postId) return post;

              return {
                ...post,
                totalComments: post.totalComments! - 1,
              };
            }),
          })),
        };
      };

      queryClient.setQueryData(['feed-posts'], updatePostsCache);

      if (profileUrl) {
        queryClient.setQueryData(['user-posts', profileUrl], updatePostsCache);
      }
    },
  });
}
