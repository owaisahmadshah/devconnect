import { type InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';

import { createComment } from '../-services/postService';
import {
  type TCommentsResponseWithCursorPaginationResponse,
  type TPostsResponseWithCursorPaginationResponse,
} from 'shared';

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: (data, variables) => {
      const { postId } = data;
      const { profileUrl } = variables;

      queryClient.setQueryData<InfiniteData<TCommentsResponseWithCursorPaginationResponse>>(
        ['comments', postId],
        oldData => {
          if (!oldData) return oldData;

          console.log(oldData);

          oldData.pages[0].comments.unshift(data);

          return oldData;
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
                totalComments: post?.totalComments ? post.totalComments + 1 : 1,
              };
            }),
          })),
        };
      };

      queryClient.setQueryData(['feed-posts'], updatePostsCache);

      if (profileUrl) {
        queryClient.setQueryData(['feed-posts', profileUrl], updatePostsCache);
      }
    },
  });
}
