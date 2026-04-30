import { IoPeople } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';
import type { TSkillWithId } from 'shared';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useProfileArrayDelete } from '../../-hooks/useProfile';

interface SkillItemProps extends Partial<TSkillWithId> {
  isCurrentUser: boolean;
  className: string;
  isEditable: boolean;
}

export const SkillItem = ({
  _id,
  skillName,
  skillProficiency,
  endorsements,
  isCurrentUser = false,
  className = '',
  isEditable = false,
}: SkillItemProps) => {
  const { mutateAsync, isPending } = useProfileArrayDelete();

  const handleDeleteItem = async () => {
    await mutateAsync({ fieldName: 'skills', deleteObjectId: _id as string });
  };

  return (
    <div className={cn('group flex items-center justify-between gap-4', className)}>
      <div className="flex min-w-0 flex-col gap-1.5">
        <div className="flex items-center gap-2.5">
          {!isEditable && <div className="bg-primary/60 size-1.5 shrink-0 rounded-full" />}
          <h4 className="text-foreground truncate text-[15px] font-bold tracking-tight uppercase">
            {skillName}
          </h4>
          <span className="text-muted-foreground bg-muted rounded px-2 py-0.5 text-[10px] font-black tracking-widest uppercase">
            {skillProficiency}
          </span>
        </div>

        {endorsements && endorsements.length > 0 && (
          <div className="ml-4 flex items-center gap-1.5">
            <div className="mr-1 flex -space-x-2">
              {/* This creates the stack effect for avatars later */}
              <div className="bg-muted border-background flex size-5 items-center justify-center rounded-full border-2">
                <IoPeople className="text-muted-foreground size-2.5" />
              </div>
            </div>
            <p className="text-muted-foreground text-[11px] font-bold">
              {endorsements.length} {endorsements.length === 1 ? 'Endorsement' : 'Endorsements'}
            </p>
          </div>
        )}
      </div>

      {isCurrentUser && isEditable && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDeleteItem}
          disabled={isPending}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 transition-colors"
        >
          {isPending ? '...' : <MdDelete className="size-4" />}
        </Button>
      )}
    </div>
  );
};
