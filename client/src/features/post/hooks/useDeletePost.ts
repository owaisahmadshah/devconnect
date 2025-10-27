import { useMutation } from '@tanstack/react-query';
import { deletePostService } from '../services/postService';

export function useDeletePost() {
  return useMutation({
    mutationFn: deletePostService,
  });
}
