import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';

import * as profileService from '../services/profileService';
import type { RootState } from '@/store/store';
import type { TAddProfileArrayField, TDeleteProfileArrayItem } from 'shared';
import {
  addArrayItemToProfile,
  deleteArrayItemProfile,
  setProfile,
} from '@/store/profile/profileSlice';
import { useEffect } from 'react';

export const useProfile = (identifier: string) => {
  const dispatch = useDispatch();

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

  // Dispatch to Redux once data is available
  useEffect(() => {
    if (userProfile) {
      dispatch(setProfile({ profile: userProfile, isCurrentUser }));
    }
  }, [userProfile, isCurrentUser, dispatch]);

  return { userProfile, error, isCurrentUser };
};

export const useProfileArrayUpdate = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (updateData: TAddProfileArrayField) =>
      profileService.addProfileArrayItemService(updateData),
    onSuccess: (data, variables) => {
      dispatch(addArrayItemToProfile({ fieldName: variables.fieldName, fieldData: data.data }));
    },
  });
};

export const useProfileArrayDelete = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (deleteData: TDeleteProfileArrayItem) =>
      profileService.removeProfileArrayItemService(deleteData),
    onSuccess: (_, variables) => {
      dispatch(deleteArrayItemProfile(variables));
    },
  });
};
