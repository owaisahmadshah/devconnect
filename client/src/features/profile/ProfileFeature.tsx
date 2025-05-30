import { useEffect, useState } from 'react';

import { ProfileTemplate } from '@/components/templates/ProfileTemplate';
import { type TUserProfileResponse } from 'shared';
import { useProfile } from './hooks/useProfile';

export const ProfileFeature = () => {
  const [profile, setProfile] = useState<TUserProfileResponse>();

  const { userProfile, error } = useProfile();

  useEffect(() => {
    if (error) {
      throw new Error(error.message);
    }

    setProfile(userProfile);
  }, [userProfile, error]);

  return <>{profile && <ProfileTemplate profile={profile} isCurrentUser={false} />}</>;
};
