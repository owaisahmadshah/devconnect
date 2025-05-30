import { useSelector } from 'react-redux';
import { useSuspenseQuery } from '@tanstack/react-query';
import * as profileService from '../services/profileService';
import type { RootState } from '@/store/store';

export const useProfile = (username?: string) => {
  const { user } = useSelector((state: RootState) => state.profileSummary);

  const identifier = username?.trim() ?? user?.username;

  const { data: userProfile, error } = useSuspenseQuery({
    queryKey: ['profile', identifier] as const,
    queryFn: async () => {
      if (!identifier) {
        throw new Error('Username is required');
      }

      const { data: profile } = await profileService.profileService({ identifier });
      return profile;
    },
  });

  return { userProfile, error };
};
