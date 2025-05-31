import { useEffect, useState } from 'react';

import { ProfileTemplate } from '@/components/templates/ProfileTemplate';
import { type TUserProfileResponse } from 'shared';
import * as useProfile from './hooks/useProfile';

export const ProfileFeature = ({ identifier }: { identifier: string }) => {
  const [profile, setProfile] = useState<TUserProfileResponse>();

  const { userProfile, error, isCurrentUser } = useProfile.useProfile(identifier);

  const { mutateAsync, isPending } = useProfile.useProfileArrayUpdate();

  useEffect(() => {
    if (error) {
      return;
    }

    setProfile(userProfile);
  }, [userProfile, error]);

  return (
    <>
      {profile && (
        <ProfileTemplate
          onProfileArrayUpdate={mutateAsync}
          isPending={isPending}
          profile={profile}
          isCurrentUser={isCurrentUser}
        />
      )}
    </>
  );
};
