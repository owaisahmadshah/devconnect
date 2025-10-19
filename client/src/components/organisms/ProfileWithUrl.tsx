import type { TUserProfileSummaryResponse } from 'shared';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils';

interface ProfileWithUrlProps {
  user: TUserProfileSummaryResponse;
  profileSize?: 's' | 'm' | 'l';
  showName?: boolean;
  showImage?: boolean;
}

export const ProfileWithUrl = ({
  user,
  profileSize = 'm',
  showName = true,
  showImage = true,
}: ProfileWithUrlProps) => {
  return (
    <Link
      className="flex items-center gap-5"
      to={'/profile/$identifier'}
      params={{
        identifier: user.profileUrls[0].url,
      }}
    >
      {showName && (
        <p className="text-semi-bold hover:underline max-sm:hidden">
          {user.firstName} {user?.lastName}
        </p>
      )}
      {showImage && (
        <Avatar
          className={cn(
            profileSize === 's' && 'h-12 w-12 max-sm:h-8 max-sm:w-8',
            profileSize === 'm' && 'h-16 w-16 max-sm:h-10 max-sm:w-10',
            profileSize === 'l' && 'h-20 w-20 max-sm:h-12 max-sm:w-12',
          )}
        >
          <AvatarImage src={user.profilePictureUrl} />
          <AvatarFallback>
            {user.firstName[0]}
            {user?.lastName[0]}Z
          </AvatarFallback>
        </Avatar>
      )}
    </Link>
  );
};
