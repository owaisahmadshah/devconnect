import { useSuspenseQuery } from '@tanstack/react-query';
import * as profileService from '../services/profileService';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

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

  const { isLoggedIn, user } = useSelector((state: RootState) => state.profileSummary);

  const isCurrentUser = isLoggedIn && user?.username === identifier.trim();

  return { userProfile, error, isCurrentUser };
};
