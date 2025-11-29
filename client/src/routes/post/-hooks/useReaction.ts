import { useMutation } from '@tanstack/react-query';
import { reactionService } from '../-services/postService';

export const useReaction = () => {
  return useMutation({
    mutationFn: reactionService,
    onSuccess: () => {
      // TODO Like ki arrer valuesN update korelk achi postsN fetch korawa likesN add korelk postA aggregate o khio use kori
    }
  });
};
