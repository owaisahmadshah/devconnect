import { IoPeople } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';

import type { TSkillWithId } from 'shared';
import { cn } from '@/lib/utils';
import { Button } from '../../../../components/ui/button';
import { useProfileArrayDelete } from '../../hooks/useProfile';

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
    <div className={cn('flex items-baseline justify-between', className)}>
      <div className="space-y-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {!isEditable && <div className="bg-foreground h-2 w-2 rounded-full"></div>}
            <h1 className="font-bold">{skillName}</h1>
            <p className="ml-2 text-xs">({skillProficiency})</p>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          {endorsements!.length > 0 && (
            <>
              <p className="flex items-center gap-2 text-sm">
                <IoPeople />
                Endorsements
              </p>
              <p>{endorsements!.length}</p>
              {/* TODO: Show all the user who have given endorsements */}
            </>
          )}
        </div>
      </div>

      {/* If the user is signed and looking at his own profile then he can perfom action on his profile */}
      {isCurrentUser && isEditable && (
        <div className="flex gap-2">
          <Button variant={'ghost'} size={'icon'} onClick={handleDeleteItem} disabled={isPending}>
            {isPending ? '...' : <MdDelete />}
          </Button>
        </div>
      )}
    </div>
  );
};
