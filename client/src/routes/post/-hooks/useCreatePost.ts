import { useMutation } from '@tanstack/react-query';

import { createPostService } from '../-services/postService';

export function useCreatePost() {
  return useMutation({
    mutationFn: createPostService,
  });
}
