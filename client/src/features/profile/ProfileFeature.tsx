import { useEffect, useState } from 'react';

import { ProfileTemplate } from '@/components/templates/ProfileTemplate';
import { type TUserProfileResponse } from 'shared';
import * as useProfile from './hooks/useProfile';

export const ProfileFeature = ({ identifier }: { identifier: string }) => {
  const [profile, setProfile] = useState<TUserProfileResponse>();

  const { userProfile, error, isCurrentUser } = useProfile.useProfile(identifier);

  const { mutateAsync, isPending } = useProfile.useProfileArrayUpdate(setProfile);

  const profileArrayDelete = useProfile.useProfileArrayDelete(setProfile);

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
          onProfileArrayDelete={profileArrayDelete.mutateAsync}
          isPending={isPending}
          profile={profile}
          isCurrentUser={isCurrentUser}
        />
      )}
    </>
  );
};
