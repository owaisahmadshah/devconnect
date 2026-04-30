import { Trash2, Trophy, Calendar } from 'lucide-react';
import { type TAchievementWithId } from 'shared';
import { formatDate } from '@/lib/dateUtils';
import { Button } from '@/components/ui/button';
import { useProfileArrayDelete } from '../../-hooks/useProfile';
import { cn } from '@/lib/utils';

interface AchievementItemProps extends Partial<TAchievementWithId> {
  isCurrentUser: boolean;
  className?: string;
}

export const AchievementItem = ({
  _id,
  title,
  awardedBy,
  description,
  date,
  isCurrentUser,
  className,
}: AchievementItemProps) => {
  const { mutateAsync, isPending } = useProfileArrayDelete();

  const deleteAchievement = async () => {
    await mutateAsync({ fieldName: 'achievements', deleteObjectId: _id as string });
  };

  return (
    <div className={cn('group flex w-full items-start justify-between gap-4', className)}>
      <div className="flex min-w-0 flex-1 gap-4">
        <div className="border-border/50 bg-muted/30 mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border">
          <Trophy className="text-muted-foreground group-hover:text-primary size-6 transition-colors" />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div>
            <h4 className="text-foreground text-lg leading-tight font-bold tracking-tight uppercase">
              {title}
            </h4>
            <p className="text-foreground/80 mt-1 text-[15px] font-medium">{awardedBy}</p>
          </div>

          {date && (
            <div className="text-muted-foreground/70 flex items-center gap-1.5 text-[12px] font-bold tracking-wider uppercase">
              <Calendar className="size-3.5" />
              <span>{formatDate(date)}</span>
            </div>
          )}

          {description && (
            <p className="text-foreground/70 max-w-2xl text-[14px] leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {isCurrentUser && (
        <Button
          variant="ghost"
          size="icon"
          onClick={deleteAchievement}
          disabled={isPending}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 w-9 shrink-0 transition-colors"
        >
          {isPending ? '...' : <Trash2 size={18} />}
        </Button>
      )}
    </div>
  );
};
