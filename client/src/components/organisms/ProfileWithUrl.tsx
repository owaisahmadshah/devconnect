import type { TUserProfileSummaryResponse } from 'shared';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/dateUtils';

interface ProfileWithUrlProps {
  user: TUserProfileSummaryResponse;
  profileSize?: 's' | 'm' | 'l' | 'connection';
  showName?: boolean;
  showImage?: boolean;
  reverse?: boolean;
  underlineOnHover?: boolean;
  postDate?: Date;
}

export const ProfileWithUrl = ({
  user,
  profileSize = 'm',
  showName = true,
  showImage = true,
  reverse = false,
  underlineOnHover = true,
  postDate,
}: ProfileWithUrlProps) => {
  return (
    <Link
      className={cn(
        'flex items-center gap-5',
        reverse && 'flex-row-reverse',
        profileSize === 'connection' && 'flex-col-reverse',
      )}
      to={'/profile/$identifier'}
      params={{
        identifier: user.profileUrls[0].url,
      }}
    >
      {showName && (
        <div>
          <div
            className={cn(
              'leading-tight font-semibold text-[--color-foreground]',
              underlineOnHover && 'hover:underline',
              profileSize === 's' && 'text-sm max-sm:text-xs',
              profileSize === 'm' && 'text-base max-sm:text-sm',
              profileSize === 'l' && 'text-lg max-sm:text-base',
            )}
          >
            {user.firstName} {user?.lastName}
          </div>
          {postDate && <p className="text-muted-foreground text-xs">{formatDate(postDate)}</p>}
        </div>
      )}
      {showImage && (
        <Avatar
          className={cn(
            profileSize === 's' && 'h-8 w-8 max-sm:h-6 max-sm:w-6',
            profileSize === 'm' && 'h-12 w-12 max-sm:h-8 max-sm:w-8',
            profileSize === 'l' && 'h-16 w-16 max-sm:h-10 max-sm:w-10',
            profileSize === 'connection' && 'h-32 w-32 max-sm:h-24 max-sm:w-24',
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
