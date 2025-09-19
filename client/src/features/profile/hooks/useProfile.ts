import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';

import * as profileService from '../services/profileService';
import type { RootState } from '@/store/store';
import type { TAddProfileArrayField, TDeleteProfileArrayItem, TUpdateProfileField } from 'shared';
import {
  addArrayItemToProfile,
  deleteArrayItemProfile,
  setProfile,
} from '@/store/profile/profileSlice';
import { useEffect } from 'react';

export const useProfile = (url: string) => {
  const dispatch = useDispatch();

  const { data: userProfile, error } = useSuspenseQuery({
    queryKey: ['profile', url] as const,
    queryFn: async () => {
      const { data: profile } = await profileService.profileService({
        url: url.trim(),
      });
      return profile;
    },
  });

  const { isLoggedIn, user } = useSelector((state: RootState) => state.profileSummary);

  const isCurrentUser = isLoggedIn && user?.username === userProfile?.username;

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

export const useProfilePictureUpdate = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (imageData: FormData) => profileService.updateProfilePicture(imageData),
    onSuccess: profile => {
      dispatch(setProfile({ profile: profile.data, isCurrentUser: true }));
    },
  });
};

export const useProfileFieldUpdate = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (updateData: TUpdateProfileField) =>
      profileService.updateProfileFieldService(updateData),
    onSuccess: response => {
      dispatch(setProfile({ profile: response.data, isCurrentUser: true }));
    },
  });
};

export const useFetchRepos = () => {
  return useMutation({
    mutationFn: profileService.fetchRepoService,
  });
};

export const useAddRepo = () => {
  return useMutation({
    mutationFn: profileService.addRepoProjectService,
  });
};
