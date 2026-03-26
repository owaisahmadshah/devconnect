import { Link } from '@tanstack/react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { TNotificationSummaryResponse, TNotificationType } from 'shared';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, UserPlus, UserCheck, Briefcase, Building2 } from 'lucide-react';

interface INotificationItemProps {
  notification: TNotificationSummaryResponse;
}

const notificationIconMap: Record<
  TNotificationType,
  { icon: React.ElementType; className: string }
> = {
  post_liked: {
    icon: Heart,
    className: 'bg-rose-500/10 text-rose-500',
  },
  post_comment: {
    icon: MessageCircle,
    className: 'bg-blue-500/10 text-blue-500',
  },
  connection_request: {
    icon: UserPlus,
    className: 'bg-violet-500/10 text-violet-500',
  },
  connection_accepted: {
    icon: UserCheck,
    className: 'bg-emerald-500/10 text-emerald-500',
  },
  job_posted: {
    icon: Briefcase,
    className: 'bg-amber-500/10 text-amber-500',
  },
  organization_invite: {
    icon: Building2,
    className: 'bg-cyan-500/10 text-cyan-500',
  },
};

export const NotificationItem = ({ notification }: INotificationItemProps) => {
  const { actor, type, isRead, message, redirectURL, createdAt } = notification;

  const iconConfig = notificationIconMap[type];
  const Icon = iconConfig.icon;

  const profileUrl = actor.profileUrls?.[0]?.url;
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  return (
    <Link
      to={redirectURL}
      className={cn(
        'group flex items-start gap-3 px-4 py-3 transition-colors duration-150',
        'hover:bg-accent/60 cursor-pointer',
        !isRead && 'bg-primary/[0.03]',
      )}
    >
      <div className="relative mt-0.5 shrink-0">
        <Link
          to="/profile/$identifier"
          params={{ identifier: profileUrl }}
          onClick={e => e.stopPropagation()}
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={actor.profilePictureUrl} alt={actor.firstName} />
            <AvatarFallback className="text-sm font-medium">
              {actor.firstName[0]}
              {actor.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
        </Link>

        <span
          className={cn(
            'absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full',
            iconConfig.className,
          )}
        >
          <Icon className="h-2.5 w-2.5" strokeWidth={2.5} />
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-foreground text-sm leading-snug">
          <Link
            to="/profile/$identifier"
            params={{ identifier: profileUrl }}
            onClick={e => e.stopPropagation()}
            className="font-semibold hover:underline"
          >
            {actor.firstName} {actor.lastName}
          </Link>{' '}
          <span className="text-muted-foreground">
            {message
              .replace(`${actor.firstName} ${actor.lastName}`, '')
              .replace(`${actor.firstName}`, '')
              .trim()}
          </span>
        </p>

        <p className="text-muted-foreground mt-0.5 text-xs">{timeAgo}</p>
      </div>

      {!isRead && <span className="bg-primary mt-1.5 h-2 w-2 shrink-0 rounded-full" />}
    </Link>
  );
};
