import { Trash2, Briefcase, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDateRange, getDuration } from '@/lib/dateUtils';
import { type TExperienceWithId } from 'shared';
import { useProfileArrayDelete } from '../../-hooks/useProfile';
import { cn } from '@/lib/utils';

interface ExperienceItemProps extends Partial<TExperienceWithId> {
  isCurrentUser: boolean;
  className?: string;
}

export const ExperienceItem = ({
  _id,
  type,
  description,
  role,
  technologies,
  companyOrProject,
  location,
  started,
  ended,
  isCurrentUser,
  className,
}: ExperienceItemProps) => {
  const { mutateAsync, isPending } = useProfileArrayDelete();

  const deleteAchievement = async () => {
    await mutateAsync({ fieldName: 'experiences', deleteObjectId: _id as string });
  };

  return (
    <div className={cn('group flex w-full items-start justify-between gap-4', className)}>
      <div className="flex min-w-0 flex-1 gap-4">
        <div className="border-border/50 bg-muted/30 mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border">
          <Briefcase className="text-muted-foreground group-hover:text-primary size-6 transition-colors" />
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h4 className="text-foreground text-lg leading-tight font-bold tracking-tight uppercase">
              {role}
            </h4>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-foreground/80 text-[15px] font-medium">{companyOrProject}</p>
              {type && (
                <span className="text-muted-foreground bg-muted rounded px-2 py-0.5 text-[10px] font-black tracking-widest uppercase">
                  {type}
                </span>
              )}
            </div>
          </div>

          <div className="text-muted-foreground/70 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] font-bold tracking-wider uppercase">
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              <span>{getDateRange(started!, ended!)}</span>
              {getDuration(started!, ended!) && (
                <span className="text-primary/60">· {getDuration(started!, ended!)}</span>
              )}
            </div>

            {location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                <span>{location}</span>
              </div>
            )}
          </div>

          {description && (
            <p className="text-foreground/70 max-w-2xl text-[14px] leading-relaxed">
              {description}
            </p>
          )}

          {technologies && technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {technologies.map((tech, index) => (
                <span
                  key={index}
                  className="border-border/60 bg-background text-foreground/60 group-hover:border-primary/30 rounded-lg border px-2.5 py-1 text-[11px] font-bold tracking-tighter uppercase transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
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
