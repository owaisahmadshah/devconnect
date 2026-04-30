import { Trash2, GraduationCap, Calendar } from 'lucide-react';
import { getDateRange } from '@/lib/dateUtils';
import { type TEducationWithId } from 'shared';
import { useProfileArrayDelete } from '../../-hooks/useProfile';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EducationItemProps extends Partial<TEducationWithId> {
  isCurrentUser: boolean;
  className?: string;
}

export const EducationItem = ({
  _id,
  degree,
  fieldOfStudy,
  school,
  started,
  ended,
  isCurrentUser = false,
  className,
}: EducationItemProps) => {
  const { mutateAsync, isPending } = useProfileArrayDelete();

  const deleteAchievement = async () => {
    await mutateAsync({ fieldName: 'educations', deleteObjectId: _id as string });
  };

  return (
    <div className={cn('group flex w-full items-start justify-between gap-4', className)}>
      <div className="flex min-w-0 flex-1 gap-4">
        <div className="border-border/50 bg-muted/30 mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border">
          <GraduationCap className="text-muted-foreground group-hover:text-primary size-6 transition-colors" />
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div>
            <h4 className="text-foreground text-lg leading-tight font-bold tracking-tight uppercase">
              {school}
            </h4>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-foreground/80 text-[15px] font-medium">
                {degree}, {fieldOfStudy}
              </p>
            </div>
          </div>

          <div className="text-muted-foreground/70 flex items-center gap-1.5 text-[12px] font-bold tracking-wider uppercase">
            <Calendar className="size-3.5" />
            <span>{getDateRange(started!, ended!)}</span>
          </div>
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
