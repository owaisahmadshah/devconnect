import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

import * as profileService from '../services/profileService';
import type { RootState } from '@/store/store';
import type { TUserProfileResponse, TUserProfileUpdateArrayData } from 'shared';

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

export const useProfileArrayUpdate = (
  setProfile: React.Dispatch<React.SetStateAction<TUserProfileResponse | undefined>>,
) => {
  return useMutation({
    mutationFn: (updateData: TUserProfileUpdateArrayData) =>
      profileService.addProfileArrayItemService(updateData),
    onSuccess: (_, variables) => {
      setProfile(prev => {
        if (!prev) return prev;

        return {
          ...prev,
          [variables.fieldName]: [...prev[variables.fieldName], variables.fieldData],
        };
      });
    },
  });
};
