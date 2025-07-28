import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface DismissibleBadgeProps {
  avatar?: string;
  avatarFallBack?: string;
  avatarClasses?: string;
  text: string;
  onRemove?: () => void;
  customClasses?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive';
}

export const DismissibleBadge = ({
  avatar,
  avatarFallBack,
  avatarClasses,
  text,
  onRemove,
  customClasses,
  variant = 'default',
}: DismissibleBadgeProps) => {
  return (
    <Badge
      className={cn(
        'bg-muted text-muted-foreground relative rounded-full py-1 pr-6 pl-3 text-sm',
        customClasses,
      )}
      variant={variant}
    >
      {avatar && (
        <Avatar className={cn("h-8 w-8", avatarClasses)}>
          <AvatarImage src={avatar} />
          <AvatarFallback>{avatarFallBack}</AvatarFallback>
        </Avatar>
      )}
      <p>{text}</p>
      <button
        type="button"
        onClick={onRemove}
        className="hover:bg-muted-foreground/20 absolute -top-1 -right-1 rounded-full p-1 transition"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
};
