import { useSuspenseQuery } from '@tanstack/react-query';
import * as profileService from '../services/profileService';

export const useProfile = (identifier: string) => {
  const { data: userProfile, error } = useSuspenseQuery({
    queryKey: ['profile', identifier] as const,
    queryFn: async () => {
      const { data: profile } = await profileService.profileService({
        identifier: identifier.trim(),
      });
      return profile;
    },
  });

  return { userProfile, error };
};
