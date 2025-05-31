import { useEffect, useState } from 'react';

import { ProfileTemplate } from '@/components/templates/ProfileTemplate';
import { type TUserProfileResponse } from 'shared';
import { useProfile } from './hooks/useProfile';

export const ProfileFeature = ({ identifier }: { identifier: string }) => {
  const [profile, setProfile] = useState<TUserProfileResponse>();

  const { userProfile, error, isCurrentUser } = useProfile(identifier);

  useEffect(() => {
    if (error) {
      return;
    }

    setProfile(userProfile);
  }, [userProfile, error]);

  return <>{profile && <ProfileTemplate profile={profile} isCurrentUser={isCurrentUser} />}</>;
};
